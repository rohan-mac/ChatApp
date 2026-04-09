import { asyncHandler } from '../middleware/asyncHandler.js';
import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import { Report } from '../models/Report.js';
import { User } from '../models/User.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalChats, totalMessages, activeUsers, openReports] = await Promise.all([
    User.countDocuments(),
    Chat.countDocuments(),
    Message.countDocuments(),
    User.countDocuments({ isOnline: true }),
    Report.countDocuments({ status: 'open' })
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [messagesPerDay, reportsPerDay] = await Promise.all([
    Message.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    Report.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json({
    totals: { totalUsers, totalChats, totalMessages, activeUsers, openReports },
    analytics: { messagesPerDay, reportsPerDay }
  });
});

export const getAdminUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json(users);
});

export const getAdminChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find()
    .populate('participants', 'name email role')
    .populate({ path: 'lastMessageId', populate: { path: 'senderId', select: 'name email' } })
    .sort({ updatedAt: -1 });
  res.json(chats);
});

export const deleteAdminUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User removed' });
});

export const deleteAdminMessage = asyncHandler(async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ message: 'Message removed' });
});

export const getFlaggedMessages = asyncHandler(async (req, res) => {
  const flagged = await Message.find({ isSpam: true })
    .populate('senderId', 'name email')
    .sort({ createdAt: -1 });
  res.json(flagged);
});

export const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate('reporterId', 'name email')
    .populate('targetUserId', 'name email')
    .populate('messageId')
    .sort({ createdAt: -1 });
  res.json(reports);
});
