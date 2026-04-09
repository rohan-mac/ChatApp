import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL
  });

export const generateRefreshTokenValue = () => crypto.randomBytes(48).toString('hex');

export const getRefreshTokenExpiry = () => {
  const date = new Date();
  date.setDate(date.getDate() + env.REFRESH_TOKEN_TTL_DAYS);
  return date;
};
