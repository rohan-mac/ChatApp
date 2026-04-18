import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

const enabled = Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

if (enabled) {
  try {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET
    });
    console.log('✓ Cloudinary configured successfully');
  } catch (error) {
    console.error('✗ Failed to configure Cloudinary:', error.message);
  }
} else {
  console.warn('⚠ Cloudinary is not configured. Media uploads will use local fallback URLs.');
}

export const isCloudinaryEnabled = enabled;
export default cloudinary;
