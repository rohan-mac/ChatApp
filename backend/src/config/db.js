import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== 'production'
    });
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection failed', { message: error.message, stack: error.stack });
    process.exit(1);
  }
};
