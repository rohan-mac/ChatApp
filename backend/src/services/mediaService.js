import { uploadMessageAttachment, uploadAvatar } from './uploadService.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../lib/appError.js';

/**
 * Upload attachment for message
 * 
 * This function handles uploading message attachments (images, videos, documents)
 * directly to Cloudinary. No local fallback.
 * 
 * @param {Object} file - Multer file object
 * @returns {Promise<Array>} Array with single attachment object containing Cloudinary URL
 * @throws {AppError} If upload fails
 */
export const uploadAttachment = async (file) => {
  if (!file) {
    return [];
  }

  try {
    const uploadResult = await uploadMessageAttachment(file);
    
    if (!uploadResult) {
      return [];
    }

    return [
      {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
        type: uploadResult.type,
        name: uploadResult.name,
        size: uploadResult.size,
        width: uploadResult.width,
        height: uploadResult.height,
        duration: uploadResult.duration
      }
    ];
  } catch (error) {
    logger.error('Attachment upload failed in mediaService', {
      filename: file?.originalname,
      error: error.message
    });
    throw error;
  }
};

/**
 * Upload user profile picture
 * 
 * This function handles uploading profile avatars to Cloudinary.
 * 
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Cloudinary URL for the avatar
 * @throws {AppError} If upload fails
 */
export const uploadProfilePicture = async (file) => {
  if (!file) {
    return null;
  }

  try {
    const uploadResult = await uploadAvatar(file);
    return uploadResult.url;
  } catch (error) {
    logger.error('Profile picture upload failed in mediaService', {
      filename: file?.originalname,
      error: error.message
    });
    throw error;
  }
};

/**
 * Extract Cloudinary public_id from URL
 * 
 * Useful for deletion and management of stored files
 * 
 * @param {string} url - Cloudinary secure URL
 * @returns {string|null} Public ID or null
 */
export const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const match = url.match(/\/([^/]+\/[^/.]+)(?:\.[^/]*)?$/);
    return match ? match[1] : null;
  } catch (error) {
    logger.warn('Failed to extract public ID from URL', { url, error: error.message });
    return null;
  }
};
