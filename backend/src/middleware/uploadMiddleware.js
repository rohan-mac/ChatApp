import multer from 'multer';
import { AppError } from '../lib/appError.js';

/**
 * Allowed MIME types for different file categories
 */
const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
};

const ALL_ALLOWED_TYPES = Object.values(ALLOWED_MIME_TYPES).flat();

/**
 * File size limits (in bytes)
 */
const FILE_SIZE_LIMITS = {
  avatar: 5 * 1024 * 1024, // 5MB for profile pictures
  attachment: 20 * 1024 * 1024 // 20MB for message attachments
};

/**
 * Get file category based on MIME type
 */
const getFileCategory = (mimetype) => {
  for (const [category, types] of Object.entries(ALLOWED_MIME_TYPES)) {
    if (types.includes(mimetype)) {
      return category;
    }
  }
  return null;
};

/**
 * Validate file MIME type
 */
const validateMimeType = (mimetype, allowedTypes = ALL_ALLOWED_TYPES) => {
  return allowedTypes.includes(mimetype);
};

/**
 * Create multer instance for avatar uploads (smaller limit, images only)
 */
export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: FILE_SIZE_LIMITS.avatar },
  fileFilter: (req, file, callback) => {
    // Validate MIME type
    if (!validateMimeType(file.mimetype, ALLOWED_MIME_TYPES.image)) {
      return callback(new AppError('Only image files (JPEG, PNG, GIF, WebP) are allowed for avatar', 400));
    }

    // Validate file size
    if (file.size > FILE_SIZE_LIMITS.avatar) {
      return callback(new AppError(`Avatar size must be less than ${FILE_SIZE_LIMITS.avatar / (1024 * 1024)}MB`, 400));
    }

    callback(null, true);
  }
});

/**
 * Create multer instance for message attachments (larger limit, mixed types)
 */
export const uploadAttachment = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: FILE_SIZE_LIMITS.attachment },
  fileFilter: (req, file, callback) => {
    // Validate MIME type
    if (!validateMimeType(file.mimetype, ALL_ALLOWED_TYPES)) {
      const allowed = Object.keys(ALLOWED_MIME_TYPES).join(', ');
      return callback(new AppError(`Only ${allowed} files are allowed`, 400));
    }

    // Validate file size
    if (file.size > FILE_SIZE_LIMITS.attachment) {
      return callback(new AppError(`File size must be less than ${FILE_SIZE_LIMITS.attachment / (1024 * 1024)}MB`, 400));
    }

    callback(null, true);
  }
});

/**
 * Middleware to validate file exists (for optional file endpoints)
 */
export const validateFileExists = (req, res, next) => {
  if (!req.file) {
    // File is optional for updates, but required for send message
    return next();
  }
  
  // File exists and passed multer validation
  next();
};

/**
 * Export utilities for use in services
 */
export const fileUtils = {
  getFileCategory,
  validateMimeType,
  FILE_SIZE_LIMITS,
  ALLOWED_MIME_TYPES
};
