import bcrypt from 'bcryptjs';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../lib/appError.js';
import { User } from '../models/User.js';
import { uploadProfilePicture } from '../services/mediaService.js';
import { logger } from '../utils/logger.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.validated.query;
  const skip = (page - 1) * limit;

  const blockedByMe = req.user.blockedUsers || [];
  const query = {
    _id: { $ne: req.user._id, $nin: blockedByMe }
  };

  if (search) {
    query.$text = { $search: search };
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select('name email profilePic bio status isOnline lastSeen role isVerified')
      .sort(search ? { score: { $meta: 'textScore' } } : { isOnline: -1, lastSeen: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query)
  ]);

  res.json({
    data: users,
    pagination: { page, limit, total, hasMore: skip + users.length < total }
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  logger.debug('Updating profile', {
    userId: req.user._id,
    hasFile: !!req.file,
    body: req.validated.body
  });

  const updates = {};

  // Process name field
  if (req.validated.body.name !== undefined && req.validated.body.name !== null) {
    const nameValue = String(req.validated.body.name).trim();
    if (nameValue.length >= 2) {
      updates.name = nameValue;
    } else if (nameValue.length > 0) {
      throw new AppError('Name must be at least 2 characters', 400);
    }
  }

  // Process bio field
  if (req.validated.body.bio !== undefined && req.validated.body.bio !== null) {
    const bioValue = String(req.validated.body.bio).trim();
    if (bioValue.length <= 160) {
      updates.bio = bioValue;
    } else {
      throw new AppError('Bio must be at most 160 characters', 400);
    }
  }

  // Process status field
  if (req.validated.body.status !== undefined && req.validated.body.status !== null) {
    const statusValue = String(req.validated.body.status).trim();
    if (statusValue.length <= 80) {
      updates.status = statusValue;
    } else {
      throw new AppError('Status must be at most 80 characters', 400);
    }
  }

  // Handle avatar upload if file is provided
  if (req.file) {
    try {
      logger.debug('Uploading avatar', {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      const avatarUrl = await uploadProfilePicture(req.file);
      if (avatarUrl) {
        updates.profilePic = avatarUrl;
        logger.info('Avatar uploaded successfully', {
          userId: req.user._id,
          url: avatarUrl
        });
      }
    } catch (error) {
      logger.error('Avatar upload failed in updateProfile', {
        userId: req.user._id,
        error: error.message
      });
      throw error; // Let error middleware handle it
    }
  }

  // If there are no updates, return current user
  if (Object.keys(updates).length === 0) {
    logger.debug('No updates provided');
    return res.json({ message: 'No updates provided', user: req.user });
  }

  logger.debug('Applying profile updates', {
    userId: req.user._id,
    fields: Object.keys(updates)
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select('-passwordHash');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  logger.info('Profile updated successfully', {
    userId: req.user._id,
    updatedFields: Object.keys(updates)
  });

  res.json({ message: 'Profile updated successfully', user });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    req.validated.body,
    { new: true, runValidators: true }
  ).select('-passwordHash');

  res.json({ message: 'Preferences updated successfully', user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.validated.body;

  const user = await User.findById(req.user._id).select('+passwordHash');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const matches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matches) {
    throw new AppError('Current password is incorrect', 400);
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);
  await User.findByIdAndUpdate(req.user._id, { passwordHash: newPasswordHash });

  res.json({ message: 'Password changed successfully' });
});

export const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  if (id === req.user._id.toString()) {
    throw new AppError('You cannot block yourself', 400);
  }

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { blockedUsers: id } });
  res.json({ message: 'User blocked successfully' });
});

export const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  await User.findByIdAndUpdate(req.user._id, { $pull: { blockedUsers: id } });
  res.json({ message: 'User unblocked successfully' });
});

export const registerPushToken = asyncHandler(async (req, res) => {
  const { pushToken } = req.validated.body;
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { pushTokens: pushToken } });
  res.json({ message: 'Push token registered' });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json({ message: 'User deleted successfully' });
});

export const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
});

export const promoteToAdmin = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: 'admin' }, { new: true }).select('-passwordHash');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ message: 'User promoted to admin', user });
});
