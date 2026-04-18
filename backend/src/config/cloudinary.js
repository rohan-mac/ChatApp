import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

/**
 * Cloudinary Configuration
 * 
 * Required environment variables:
 * - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
 * - CLOUDINARY_API_KEY: Cloudinary API key
 * - CLOUDINARY_API_SECRET: Cloudinary API secret
 */

const isConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME && 
  env.CLOUDINARY_API_KEY && 
  env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  try {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true
    });
    logger.info('✓ Cloudinary configured successfully', {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!env.CLOUDINARY_API_KEY,
      hasApiSecret: !!env.CLOUDINARY_API_SECRET
    });
  } catch (error) {
    logger.error('✗ Failed to configure Cloudinary:', error);
    throw new Error(`Cloudinary configuration failed: ${error.message}`);
  }
} else {
  const missing = [];
  if (!env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!env.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
  if (!env.CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET');

  const message = `Cloudinary is not fully configured. Missing: ${missing.join(', ')}`;
  logger.error(message);
  throw new Error(message);
}

/**
 * Generate signed URL for secure file delivery
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Signed secure URL
 */
export const generateSignedUrl = (publicId) => {
  try {
    const signedUrl = cloudinary.url(publicId, {
      secure: true,
      sign_url: true,
      type: 'authenticated',
      resource_type: 'auto'
    });
    return signedUrl;
  } catch (error) {
    logger.error('Failed to generate signed URL', { publicId, error: error.message });
    throw error;
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image, video)
 */
export const deleteCloudinaryFile = async (publicId, resourceType = 'image') => {
  if (!publicId || !publicId.startsWith('chat-app/')) {
    logger.warn('Invalid public ID for deletion', { publicId });
    return { result: 'not_deleted' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    logger.debug('File deleted from Cloudinary', { publicId, result: result.result });
    return result;
  } catch (error) {
    logger.error('Failed to delete file from Cloudinary', { publicId, error: error.message });
    throw error;
  }
};

export const isCloudinaryEnabled = isConfigured;
export default cloudinary;
