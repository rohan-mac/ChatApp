import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../lib/appError.js';
import { User } from '../models/User.js';
import { uploadAttachment } from '../services/mediaService.js';

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
  const updates = { ...req.validated.body };

  if (req.file) {
    const [attachment] = await uploadAttachment(req.file);
    updates.profilePic = attachment?.url || '';
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select('-passwordHash');

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
