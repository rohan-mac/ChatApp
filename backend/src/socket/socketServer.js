import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';
import CallHandler from './callHandler.js';
import { Chat } from '../models/Chat.js';

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

    const callHandler = new CallHandler(io);
    callHandler.registerSocket(userId, socket.id);

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

    // Call events
    socket.on('call-user', (data) => callHandler.handleCallUser(socket, data));
    socket.on('accept-call', (data) => callHandler.handleAcceptCall(socket, data));
    socket.on('reject-call', (data) => callHandler.handleRejectCall(socket, data));
    socket.on('end-call', (data) => callHandler.handleEndCall(socket, data));
    socket.on('ice-candidate', (data) => callHandler.handleIceCandidate(socket, data));
    socket.on('call-toggle', (data) => callHandler.handleToggleMedia(socket, data));

    socket.on('disconnect', async () => {
      callHandler.unregisterSocket(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
      io.emit('presence:update', { userId, isOnline: false, lastSeen: new Date().toISOString() });
      logger.debug('Socket disconnected', { userId });
    });
  });
};
