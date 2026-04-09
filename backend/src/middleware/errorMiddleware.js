import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || res.statusCode || 500;

  logger.error(error.message || 'Unhandled error', {
    path: req.originalUrl,
    method: req.method,
    stack: error.stack,
    details: error.details
  });

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.issues
    });
  }

  return res.status(statusCode >= 400 ? statusCode : 500).json({
    message: error.message || 'Server error',
    details: error.details || undefined
  });
};
