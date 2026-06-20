import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../lib/appError.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

const toObjectId = (v) => {
  try {
    if (!v) return null;
    if (v instanceof mongoose.Types.ObjectId) return v;
    return new mongoose.Types.ObjectId(v);
  } catch {
    return null;
  }
};

export const getNotifications = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    unreadOnly = 'false'
  } = req.validated.query;

  const unread = unreadOnly === true || unreadOnly === 'true';

  const query = { userId: req.user._id };
  if (unread) query.read = false;

  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('chatId', '_id type title')
      .populate('senderId', 'name profilePic email')
      .lean(),
    Notification.countDocuments(query)
  ]);

  res.json({
    data: notifications.map((n) => ({
      _id: n._id,
      senderId: n.senderId,
      chatId: n.chatId,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      createdAt: n.createdAt
    })),
    pagination: { page, limit, total, hasMore: skip + notifications.length < total }
  });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ userId: req.user._id, read: false });
  res.json({ unreadCount: count });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const notifId = toObjectId(id);
  if (!notifId) throw new AppError('Invalid notification id', 400);

  const notif = await Notification.findOneAndUpdate(
    { _id: notifId, userId: req.user._id },
    { $set: { read: true } },
    { new: true }
  );

  if (!notif) throw new AppError('Notification not found', 404);

  res.json({ message: 'Notification marked as read', notification: notif });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, read: false },
    { $set: { read: true } }
  );

  res.json({ message: 'All notifications marked as read' });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const notifId = toObjectId(id);
  if (!notifId) throw new AppError('Invalid notification id', 400);

  const deleted = await Notification.findOneAndDelete({ _id: notifId, userId: req.user._id });
  if (!deleted) throw new AppError('Notification not found', 404);

  res.json({ message: 'Notification deleted' });
});

// Optional internal endpoint used by SW/app if needed.
// Here we just mark as read and return associated chatId.
export const markReadAndGetChat = asyncHandler(async (req, res) => {
  const { notificationId } = req.validated.body;
  const notifId = toObjectId(notificationId);
  if (!notifId) throw new AppError('Invalid notification id', 400);

  const notif = await Notification.findOneAndUpdate(
    { _id: notifId, userId: req.user._id },
    { $set: { read: true } },
    { new: true }
  );

  if (!notif) throw new AppError('Notification not found', 404);

  res.json({ notification: notif, chatId: notif.chatId });
});

