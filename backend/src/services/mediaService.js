import cloudinary, { isCloudinaryEnabled } from '../config/cloudinary.js';
import { logger } from '../utils/logger.js';

export const uploadAttachment = async (file) => {
  if (!file) return [];

  const type = file.mimetype.startsWith('image')
    ? 'image'
    : file.mimetype.startsWith('video')
      ? 'video'
      : 'document';

  // If Cloudinary is not enabled, return local storage URL
  if (!isCloudinaryEnabled) {
    logger.debug('Cloudinary disabled, using local storage URL');
    return [
      {
        url: `local://${file.originalname}`,
        type,
        name: file.originalname,
        size: file.size
      }
    ];
  }

  try {
    logger.debug('Attempting Cloudinary upload', { filename: file.originalname, size: file.size });

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'chatapp/media', timeout: 60000 },
        (error, uploadResult) => {
          if (error) {
            logger.error('Cloudinary upload stream error', { error: error.message });
            reject(error);
          } else {
            logger.debug('Cloudinary upload successful', { url: uploadResult.secure_url });
            resolve(uploadResult);
          }
        }
      );

      if (!uploadStream) {
        const err = new Error('Failed to create Cloudinary upload stream');
        logger.error('Upload stream creation failed', { error: err.message });
        return reject(err);
      }

      uploadStream.on('error', (err) => {
        logger.error('Cloudinary stream error event', { error: err.message });
        reject(err);
      });

      uploadStream.end(file.buffer);
    });

    return [
      {
        url: result.secure_url,
        type,
        name: file.originalname,
        size: file.size
      }
    ];
  } catch (error) {
    // Log the error and fall back to local storage URL
    logger.warn('Cloudinary upload failed, using local fallback', {
      filename: file.originalname,
      error: error.message,
      code: error.code
    });

    return [
      {
        url: `local://${Date.now()}_${file.originalname}`,
        type,
        name: file.originalname,
        size: file.size
      }
    ];
  }
};
