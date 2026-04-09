import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../lib/appError.js';
import { User } from '../models/User.js';
import { asyncHandler } from './asyncHandler.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.accessToken || null;

  if (!token) {
    throw new AppError('Unauthorized: missing token', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new AppError('Unauthorized: invalid token', 401);
  }

  const user = await User.findById(decoded.sub || decoded.id).select('-passwordHash');

  if (!user) {
    throw new AppError('Unauthorized: user not found', 401);
  }

  if (user.isBlocked) {
    throw new AppError('Account is blocked', 403);
  }

  req.user = user;
  next();
});

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Forbidden: admin access only', 403));
  }

  next();
};
