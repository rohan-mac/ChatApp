import mongoose from 'mongoose';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../lib/appError.js';
import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';

const chatPopulate = [
  { path: 'participants', select: 'name email profilePic isOnline lastSeen role isVerified' },
  { path: 'admins', select: 'name email' },
  {
    path: 'lastMessageId',
    populate: [
      { path: 'senderId', select: 'name email profilePic' },
      { path: 'replyTo', select: 'text senderId' }
    ]
  }
];

const decorateChats = async (chats, userId) => {
  const decorated = await Promise.all(
    chats.map(async (chat) => {
      const unreadCount = await Message.countDocuments({
        chatId: chat._id,
        senderId: { $ne: userId },
        deletedForEveryone: false,
        deletedFor: { $ne: userId },
        seenBy: { $ne: userId }
      });

      const counterpart =
        chat.type === 'direct'
          ? chat.participants.find((participant) => participant._id.toString() !== userId.toString()) || null
          : null;

      return {
        ...chat.toObject(),
        unreadCount,
        counterpart
      };
    })
  );

  return decorated;
};

export const getChats = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, archived, search } = req.validated.query;
  const skip = (page - 1) * limit;

  const query = { participants: req.user._id };

  if (archived === 'true') {
    query.archivedBy = req.user._id;
  } else if (archived === 'false') {
    query.archivedBy = { $ne: req.user._id };
  }

  if (search) {
    query.$or = [{ title: { $regex: search, $options: 'i' } }];
  }

  const [chats, total] = await Promise.all([
    Chat.find(query).populate(chatPopulate).sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Chat.countDocuments(query)
  ]);

  const decoratedChats = await decorateChats(chats, req.user._id);

  res.json({
    data: decoratedChats,
    pagination: { page, limit, total, hasMore: skip + decoratedChats.length < total }
  });
});

export const createOrGetChat = asyncHandler(async (req, res) => {
  const { receiverId } = req.validated.body;

  if (receiverId === req.user._id.toString()) {
    throw new AppError('You cannot create a chat with yourself', 400);
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new AppError('Receiver not found', 404);
  }

  let chat = await Chat.findOne({
    type: 'direct',
    participants: { $all: [req.user._id, receiverId], $size: 2 }
  }).populate(chatPopulate);

  if (!chat) {
    chat = await Chat.create({
      type: 'direct',
      participants: [req.user._id, receiverId]
    });
    chat = await chat.populate(chatPopulate);
  }

  const [decorated] = await decorateChats([chat], req.user._id);
  res.status(201).json(decorated);
});

export const createGroupChat = asyncHandler(async (req, res) => {
  const { title, participantIds, description = '' } = req.validated.body;
  const uniqueParticipants = [...new Set([...participantIds, req.user._id.toString()])];

  const users = await User.countDocuments({ _id: { $in: uniqueParticipants } });
  if (users !== uniqueParticipants.length) {
    throw new AppError('One or more participants do not exist', 404);
  }

  const chat = await Chat.create({
    type: 'group',
    title,
    description,
    participants: uniqueParticipants,
    admins: [req.user._id]
  });

  const populated = await chat.populate(chatPopulate);
  const [decorated] = await decorateChats([populated], req.user._id);
  res.status(201).json(decorated);
});

export const updateGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.validated.params;
  const { title, description, participantId, action } = req.validated.body;
  const chat = await Chat.findById(chatId);

  if (!chat || chat.type !== 'group') {
    throw new AppError('Group chat not found', 404);
  }

  if (!chat.admins.some((adminId) => adminId.toString() === req.user._id.toString())) {
    throw new AppError('Only group admins can update the group', 403);
  }

  if (title !== undefined) chat.title = title;
  if (description !== undefined) chat.description = description;
  if (participantId && action === 'add') {
    chat.participants.addToSet(new mongoose.Types.ObjectId(participantId));
  }
  if (participantId && action === 'remove') {
    chat.participants = chat.participants.filter((id) => id.toString() !== participantId);
    chat.admins = chat.admins.filter((id) => id.toString() !== participantId);
  }

  await chat.save();
  const populated = await chat.populate(chatPopulate);
  const [decorated] = await decorateChats([populated], req.user._id);
  res.json(decorated);
});

export const pinChat = asyncHandler(async (req, res) => {
  const { chatId } = req.validated.params;
  await Chat.findByIdAndUpdate(chatId, { $addToSet: { pinnedBy: req.user._id } });
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { pinnedChats: chatId } });
  res.json({ message: 'Chat pinned successfully' });
});

export const archiveChat = asyncHandler(async (req, res) => {
  const { chatId } = req.validated.params;
  await Chat.findByIdAndUpdate(chatId, { $addToSet: { archivedBy: req.user._id } });
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { archivedChats: chatId } });
  res.json({ message: 'Chat archived successfully' });
});

export const clearChat = asyncHandler(async (req, res) => {
  const { chatId } = req.validated.params;
  const chat = await Chat.findOne({ _id: chatId, participants: req.user._id });
  if (!chat) {
    throw new AppError('Chat not found', 404);
  }

  await Message.updateMany(
    { chatId, deletedForEveryone: false, deletedFor: { $ne: req.user._id } },
    { $addToSet: { deletedFor: req.user._id } }
  );
  res.json({ message: 'Chat cleared successfully' });
});

export const unarchiveChat = asyncHandler(async (req, res) => {
  const { chatId } = req.validated.params;
  await Chat.findByIdAndUpdate(chatId, { $pull: { archivedBy: req.user._id } });
  await User.findByIdAndUpdate(req.user._id, { $pull: { archivedChats: chatId } });
  res.json({ message: 'Chat unarchived successfully' });
});

export const getChatMessagesPreview = asyncHandler(async (req, res) => {
  const { chatId } = req.validated.params;
  const messages = await Message.find({ chatId, deletedFor: { $ne: req.user._id }, deletedForEveryone: false })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('senderId', 'name email profilePic');

  res.json(messages);
});
