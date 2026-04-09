import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../lib/appError.js';
import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import { uploadAttachment } from '../services/mediaService.js';
import { sendPushNotification } from '../services/notificationService.js';
import { evaluateMessageSpam } from '../services/spamService.js';

const messagePopulate = [
  { path: 'senderId', select: 'name email profilePic' },
  { path: 'replyTo', populate: { path: 'senderId', select: 'name email profilePic' } }
];

const serializeMessage = (message, currentUserId) => {
  const source = typeof message.toObject === 'function' ? message.toObject() : message;
  const firstAttachment = source.attachments?.[0] || null;

  return {
    ...source,
    mediaUrl: source.mediaUrl || firstAttachment?.url || '',
    mediaType: source.messageType === 'text' ? firstAttachment?.type || 'text' : source.messageType,
    status: (source.seenBy?.length || 0) > 1
      ? 'seen'
      : (source.deliveredTo?.length || 0) > 1
        ? 'delivered'
        : 'sent'
  };
};

const assertChatAccess = async (chatId, userId) => {
  const chat = await Chat.findOne({ _id: chatId, participants: userId });
  if (!chat) {
    throw new AppError('Chat not found', 404);
  }

  return chat;
};

export const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, text = '', replyTo, clientMessageId } = req.validated.body;

  if (!text.trim() && !req.file) {
    throw new AppError('Message text or attachment is required', 400);
  }

  const chat = await assertChatAccess(chatId, req.user._id);

  if (clientMessageId) {
    const duplicate = await Message.findOne({
      senderId: req.user._id,
      clientMessageId
    }).populate(messagePopulate);

    if (duplicate) {
      return res.status(200).json(duplicate);
    }
  }

  const attachments = await uploadAttachment(req.file);
  const spam = evaluateMessageSpam({ text });
  const receiverId =
    chat.type === 'direct'
      ? chat.participants.find((participantId) => participantId.toString() !== req.user._id.toString()) || null
      : null;
  const messageType = attachments[0]?.type || 'text';
  const mediaUrl = attachments[0]?.url || '';

  const message = await Message.create({
    chatId,
    senderId: req.user._id,
    receiverId,
    text,
    mediaUrl,
    messageType,
    attachments,
    replyTo: replyTo || null,
    deliveredTo: [req.user._id],
    seenBy: [req.user._id],
    clientMessageId,
    isSpam: spam.isSpam
  });

  chat.lastMessageId = message._id;
  await chat.save();

  const populated = await Message.findById(message._id).populate(messagePopulate);
  const recipientIds = chat.participants.filter((participantId) => participantId.toString() !== req.user._id.toString());
  const recipients = await User.find({ _id: { $in: recipientIds } }).select('pushTokens');

  await Promise.all(
    recipients.map((recipient) =>
      sendPushNotification({
        user: recipient,
        title: 'New message',
        body: text || 'Attachment received',
        data: { chatId: chat._id.toString(), messageId: message._id.toString() }
      })
    )
  );

  const io = req.app.get('io');
  const serialized = serializeMessage(populated, req.user._id);
  io?.to(chat._id.toString()).emit('message:new', serialized);
  recipientIds.forEach((recipientId) => {
    io?.to(recipientId.toString()).emit('message:new', serialized);
  });
  res.status(201).json(serialized);
});

export const getMessagesByChat = asyncHandler(async (req, res) => {
  const { chatId } = req.validated.params;
  const { page = 1, limit = 30 } = req.validated.query;
  await assertChatAccess(chatId, req.user._id);

  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find({
      chatId,
      deletedForEveryone: false,
      deletedFor: { $ne: req.user._id }
    })
      .populate(messagePopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments({ chatId, deletedForEveryone: false, deletedFor: { $ne: req.user._id } })
  ]);

  res.json({
    data: messages.reverse().map((message) => serializeMessage(message, req.user._id)),
    pagination: { page, limit, total, hasMore: skip + messages.length < total }
  });
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
  const { status } = req.validated.body;
  const message = await Message.findById(req.validated.params.id);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  const update =
    status === 'delivered'
      ? { $addToSet: { deliveredTo: req.user._id } }
      : { $addToSet: { seenBy: req.user._id, deliveredTo: req.user._id } };

  const updated = await Message.findByIdAndUpdate(message._id, update, { new: true }).populate(messagePopulate);

  const io = req.app.get('io');
  io?.to(updated.chatId.toString()).emit('message:status', {
    messageId: updated._id,
    status,
    userId: req.user._id
  });
  io?.to(updated.senderId.toString()).emit('message:status', {
    messageId: updated._id,
    status,
    userId: req.user._id
  });

  res.json(serializeMessage(updated, req.user._id));
});

export const reactToMessage = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { emoji } = req.validated.body;
  const message = await Message.findById(id);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  message.reactions = message.reactions.filter((reaction) => reaction.userId.toString() !== req.user._id.toString());
  message.reactions.push({ userId: req.user._id, emoji });
  await message.save();

  const updated = await Message.findById(id).populate(messagePopulate);
  req.app.get('io')?.to(updated.chatId.toString()).emit('message:updated', serializeMessage(updated, req.user._id));
  res.json(serializeMessage(updated, req.user._id));
});

export const editMessage = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { text } = req.validated.body;
  const message = await Message.findById(id);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  if (message.senderId.toString() !== req.user._id.toString()) {
    throw new AppError('Only the sender can edit this message', 403);
  }

  message.text = text;
  message.isEdited = true;
  message.editedAt = new Date();
  await message.save();

  const populated = await Message.findById(id).populate(messagePopulate);
  const serialized = serializeMessage(populated, req.user._id);
  req.app.get('io')?.to(populated.chatId.toString()).emit('message:updated', serialized);
  res.json(serialized);
});

export const toggleStarMessage = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const message = await Message.findById(id);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  const existing = message.starredBy.some((entry) => entry.toString() === req.user._id.toString());

  if (existing) {
    message.starredBy = message.starredBy.filter((entry) => entry.toString() !== req.user._id.toString());
  } else {
    message.starredBy.addToSet(req.user._id);
  }

  await message.save();

  const populated = await Message.findById(id).populate(messagePopulate);
  const serialized = serializeMessage(populated, req.user._id);
  req.app.get('io')?.to(populated.chatId.toString()).emit('message:updated', serialized);
  res.json(serialized);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { scope } = req.validated.body;
  const message = await Message.findById(id);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  if (scope === 'everyone') {
    if (message.senderId.toString() !== req.user._id.toString()) {
      throw new AppError('Only the sender can delete for everyone', 403);
    }

    message.deletedForEveryone = true;
    message.deletedAt = new Date();
    message.isDeleted = true;
    message.text = '';
    message.attachments = [];
    message.mediaUrl = '';
    message.messageType = 'text';
  } else {
    message.deletedFor.addToSet(req.user._id);
  }

  await message.save();
  req.app.get('io')?.to(message.chatId.toString()).emit('message:deleted', {
    messageId: message._id,
    scope,
    userId: req.user._id
  });
  res.json({ message: 'Message deleted successfully' });
});

export const searchMessages = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.validated.query;
  const skip = (page - 1) * limit;

  const chats = await Chat.find({ participants: req.user._id }).select('_id');
  const chatIds = chats.map((chat) => chat._id);

  const query = {
    chatId: { $in: chatIds },
    $text: { $search: q },
    deletedForEveryone: false,
    deletedFor: { $ne: req.user._id }
  };

  const [messages, total] = await Promise.all([
    Message.find(query)
      .populate(messagePopulate)
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments(query)
  ]);

  res.json({
    data: messages.map((message) => serializeMessage(message, req.user._id)),
    pagination: { page, limit, total, hasMore: skip + messages.length < total }
  });
});

export const reportMessage = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const { reason } = req.validated.body;

  const message = await Message.findById(id);
  if (!message) {
    throw new AppError('Message not found', 404);
  }

  const report = await Report.create({
    reporterId: req.user._id,
    targetUserId: message.senderId,
    messageId: message._id,
    reason
  });

  message.isSpam = true;
  await message.save();

  res.status(201).json(report);
});
