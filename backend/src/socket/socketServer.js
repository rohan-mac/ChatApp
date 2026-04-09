import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';

export const configureSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));

    try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      socket.userId = payload.sub || payload.id;
      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    socket.join(userId);

    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
    io.emit('presence:update', { userId, isOnline: true, lastSeen: new Date().toISOString() });

    socket.on('chat:join', (chatId) => socket.join(chatId));
    socket.on('chat:leave', (chatId) => socket.leave(chatId));

    socket.on('chat:typing', ({ chatId, senderId }) => {
      socket.to(chatId).emit('chat:typing', { chatId, senderId });
    });

    socket.on('message:delivered', async ({ messageId, chatId }) => {
      await Message.findByIdAndUpdate(messageId, { $addToSet: { deliveredTo: userId } });
      io.to(chatId).emit('message:status', { messageId, status: 'delivered', userId });
    });

    socket.on('message:seen', async ({ messageId, chatId }) => {
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { deliveredTo: userId, seenBy: userId }
      });
      io.to(chatId).emit('message:status', { messageId, status: 'seen', userId });
    });

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
      io.emit('presence:update', { userId, isOnline: false, lastSeen: new Date().toISOString() });
      logger.debug('Socket disconnected', { userId });
    });
  });
};
