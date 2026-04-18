import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../lib/appError.js';
import { fileUtils } from '../middleware/uploadMiddleware.js';

/**
 * Upload file to Cloudinary
 * 
 * @param {Object} file - Multer file object with buffer property
 * @param {Object} options - Upload options
 * @param {string} options.folder - Cloudinary folder path (e.g., 'chat-app/documents')
 * @param {string} options.resourceType - 'image' | 'video' | 'auto'
 * @param {number} options.timeout - Upload timeout in milliseconds
 * @returns {Promise<Object>} Upload result with url, public_id, type, name, size
 * @throws {AppError} If upload fails
 */
export const uploadToCloudinary = async (file, options = {}) => {
  if (!file || !file.buffer) {
    throw new AppError('No file provided for upload', 400);
  }

  const {
    folder = 'chat-app/documents',
    resourceType = 'auto',
    timeout = 60000
  } = options;

  // Validate MIME type
  const fileCategory = fileUtils.getFileCategory(file.mimetype);
  if (!fileCategory) {
    throw new AppError(`Unsupported file type: ${file.mimetype}`, 400);
  }

  // Validate file size
  if (file.size > fileUtils.FILE_SIZE_LIMITS.attachment) {
    throw new AppError(
      `File size exceeds limit of ${fileUtils.FILE_SIZE_LIMITS.attachment / (1024 * 1024)}MB`,
      400
    );
  }

  try {
    logger.debug('Starting Cloudinary upload', {
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      folder,
      resourceType
    });

    // Create readable stream from buffer
    const bufferStream = Readable.from(file.buffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder,
          original_filename: file.originalname.split('.')[0],
          display_name: file.originalname,
          timeout
        },
        (error, result) => {
          if (error) {
            logger.error('Cloudinary upload callback error', {
              error: error.message,
              code: error.code
            });
            reject(error);
          } else {
            logger.debug('Cloudinary upload successful', {
              publicId: result.public_id,
              url: result.secure_url,
              size: result.bytes
            });
            resolve(result);
          }
        }
      );

      if (!uploadStream) {
        const err = new Error('Failed to create Cloudinary upload stream');
        logger.error('Upload stream creation failed', { error: err.message });
        reject(err);
      }

      // Handle stream errors
      uploadStream.on('error', (err) => {
        logger.error('Cloudinary stream error', {
          error: err.message,
          code: err.code
        });
        reject(err);
      });

      // Pipe buffer stream to upload stream
      bufferStream.pipe(uploadStream);
    });

    // Return standardized upload result
    return {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      type: fileCategory,
      name: file.originalname,
      size: uploadResult.bytes || file.size,
      width: uploadResult.width || null,
      height: uploadResult.height || null,
      duration: uploadResult.duration || null
    };
  } catch (error) {
    logger.error('Cloudinary upload failed', {
      filename: file.originalname,
      error: error.message,
      code: error.code,
      http_code: error.http_code
    });

    // Throw specific error based on error type
    if (error.http_code === 401 || error.http_code === 403) {
      throw new AppError('Cloudinary authentication failed. Check API credentials.', 500);
    }

    if (error.message.includes('timeout')) {
      throw new AppError('File upload timeout. Please try again.', 408);
    }

    if (error.message.includes('size')) {
      throw new AppError(`File too large. Maximum size: ${fileUtils.FILE_SIZE_LIMITS.attachment / (1024 * 1024)}MB`, 413);
    }

    throw new AppError(`File upload failed: ${error.message}`, 500);
  }
};

/**
 * Upload avatar with optimizations for profile pictures
 * 
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>} Upload result
 */
export const uploadAvatar = async (file) => {
  if (!file) {
    throw new AppError('No file provided for avatar upload', 400);
  }

  try {
    const result = await uploadToCloudinary(file, {
      folder: 'chat-app/avatars',
      resourceType: 'image',
      timeout: 30000
    });

    logger.info('Avatar uploaded successfully', {
      publicId: result.public_id,
      url: result.url
    });

    return result;
  } catch (error) {
    logger.error('Avatar upload failed', { error: error.message });
    throw error;
  }
};

/**
 * Upload message attachment (image, video, document)
 * 
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>} Upload result
 */
export const uploadMessageAttachment = async (file) => {
  if (!file) {
    return null;
  }

  try {
    const fileCategory = fileUtils.getFileCategory(file.mimetype);
    
    // Determine folder based on file type
    let folder = 'chat-app/documents';
    let resourceType = 'auto';

    if (fileCategory === 'image') {
      folder = 'chat-app/images';
      resourceType = 'image';
    } else if (fileCategory === 'video') {
      folder = 'chat-app/videos';
      resourceType = 'video';
    }

    const result = await uploadToCloudinary(file, {
      folder,
      resourceType,
      timeout: 60000
    });

    logger.info('Message attachment uploaded successfully', {
      type: fileCategory,
      publicId: result.public_id,
      size: result.size
    });

    return result;
  } catch (error) {
    logger.error('Message attachment upload failed', { error: error.message });
    throw error;
  }
};

/**
 * Handle multiple file uploads (batch upload)
 * 
 * @param {Array<Object>} files - Array of multer file objects
 * @param {string} uploadType - 'avatar' | 'attachment'
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadMultipleFiles = async (files, uploadType = 'attachment') => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadFn = uploadType === 'avatar' ? uploadAvatar : uploadMessageAttachment;

  try {
    const results = await Promise.allSettled(files.map((file) => uploadFn(file)));

    const uploaded = [];
    const failed = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        uploaded.push(result.value);
      } else {
        failed.push({
          filename: files[index].originalname,
          error: result.reason.message
        });
      }
    });

    if (failed.length > 0) {
      logger.warn('Some files failed to upload', { failed });
    }

    return uploaded;
  } catch (error) {
    logger.error('Batch upload failed', { error: error.message });
    throw new AppError('Batch upload failed', 500);
  }
};
