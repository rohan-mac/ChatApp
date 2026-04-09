import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../lib/appError.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { User } from '../models/User.js';
import { generateRefreshTokenValue, getRefreshTokenExpiry, signAccessToken } from '../services/tokenService.js';

const buildAuthPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profilePic: user.profilePic,
  bio: user.bio,
  status: user.status,
  themePreference: user.themePreference,
  notificationsEnabled: user.notificationsEnabled,
  role: user.role,
  isVerified: user.isVerified
});

const persistRefreshToken = async ({ user, req, res }) => {
  const refreshToken = generateRefreshTokenValue();
  const expiresAt = getRefreshTokenExpiry();

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt,
    userAgent: req.headers['user-agent'] || '',
    ipAddress: req.ip
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt
  });

  return refreshToken;
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validated.body;
  const existing = await User.findOne({ email });

  if (existing) {
    throw new AppError('Email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    passwordHash,
    isVerified: true
  });

  user.isOnline = true;
  user.lastSeen = new Date();
  await user.save();

  const accessToken = signAccessToken(user);
  const refreshToken = await persistRefreshToken({ user, req, res });

  res.status(201).json({
    message: 'Registration successful',
    user: buildAuthPayload(user),
    accessToken,
    token: accessToken,
    refreshToken
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new AppError('Invalid credentials', 401);
  }

  if (user.isBlocked) {
    throw new AppError('Account is blocked', 403);
  }

  user.isOnline = true;
  user.lastSeen = new Date();
  await user.save();

  const accessToken = signAccessToken(user);
  const refreshToken = await persistRefreshToken({ user, req, res });

  res.json({
    user: buildAuthPayload(user),
    accessToken,
    token: accessToken,
    refreshToken
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.validated.body.refreshToken || req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new AppError('Refresh token is required', 401);
  }

  const tokenDoc = await RefreshToken.findOne({
    token: refreshToken,
    revokedAt: null,
    expiresAt: { $gt: new Date() }
  });

  if (!tokenDoc) {
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await User.findById(tokenDoc.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const accessToken = signAccessToken(user);
  res.json({ accessToken, token: accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (token) {
    await RefreshToken.findOneAndUpdate({ token }, { revokedAt: new Date() });
  }

  await User.findByIdAndUpdate(req.user._id, { isOnline: false, lastSeen: new Date() });
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: buildAuthPayload(req.user) });
});
