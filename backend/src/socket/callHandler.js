import { User } from '../models/User.js';
import { Chat } from '../models/Chat.js';
import { logger } from '../utils/logger.js';

class CallHandler {
  constructor(io) {
    this.io = io;
    this.userSockets = new Map(); // userId -> socket.id
    this.activeCalls = new Map(); // callId -> {from, to, chatId, type, timestamp}
    this.callCooldowns = new Map(); // `${from}_${to}` -> timeoutId
  }

  registerSocket(userId, socketId) {
    this.userSockets.set(userId.toString(), socketId);
  }

  unregisterSocket(userId) {
    this.userSockets.delete(userId.toString());
    // Cleanup active calls for this user
    for (const [callId, call] of this.activeCalls.entries()) {
      if (call.from === userId.toString() || call.to === userId.toString()) {
        this.cleanupCall(callId);
      }
    }
  }

  async validateDirectChat(chatId, callerId, calleeId) {
    const chat = await Chat.findById(chatId).populate('participants');
    if (!chat || chat.type !== 'direct' || chat.participants.length !== 2) {
      return { valid: false, error: 'Invalid direct chat' };
    }
    const [user1, user2] = chat.participants.map(p => p._id.toString());
    if (!([user1, user2].includes(callerId) && [user1, user2].includes(calleeId))) {
      return { valid: false, error: 'Not participants in chat' };
    }
    return { valid: true, chat };
  }

  async validateOnlineStatus(userId) {
    const user = await User.findById(userId).select('isOnline');
    return user?.isOnline || false;
  }

  isOnCooldown(fromId, toId) {
    const key = `${fromId}_${toId}`;
    return !!this.callCooldowns.get(key);
  }

  setCooldown(fromId, toId) {
    const key = `${fromId}_${toId}`;
    const timeout = setTimeout(() => {
      this.callCooldowns.delete(key);
    }, 30000); // 30s cooldown
    this.callCooldowns.set(key, timeout);
  }

  async handleCallUser(socket, data) {
    const { toUserId, callId, type, chatId, offer } = data;
    const fromUserId = socket.userId;

    // Validation
    if (!this.userSockets.has(toUserId)) {
      socket.emit('call-error', { callId, error: 'User offline' });
      return;
    }

    if (this.isOnCooldown(fromUserId, toUserId)) {
      socket.emit('call-error', { callId, error: 'Call too frequent' });
      return;
    }

    const chatValid = await this.validateDirectChat(chatId, fromUserId, toUserId);
    if (!chatValid.valid) {
      socket.emit('call-error', { callId, error: chatValid.error });
      return;
    }

    const calleeOnline = await this.validateOnlineStatus(toUserId);
    if (!calleeOnline) {
      socket.emit('call-error', { callId, error: 'Callee offline' });
      return;
    }

    // Record active call
    this.activeCalls.set(callId, { from: fromUserId, to: toUserId, chatId, type, timestamp: Date.now() });
    this.setCooldown(fromUserId, toUserId);

    // Send to callee
    const targetSocketId = this.userSockets.get(toUserId);
    this.io.to(targetSocketId).emit('incoming-call', {
      fromUserId,
      callId,
      type,
      offer,
      chatId
    });

    logger.info('Call initiated', { callId, from: fromUserId, to: toUserId, type });
  }

  async handleAcceptCall(socket, data) {
    const { callId, answer } = data;
    const call = this.activeCalls.get(callId);
    if (!call) return;

    const targetSocketId = this.userSockets.get(call.from);
    if (targetSocketId) {
      this.io.to(targetSocketId).emit('call-accepted', { callId, answer });
      logger.info('Call accepted', { callId, by: socket.userId });
    }
  }

  handleRejectCall(socket, data) {
    const { callId, reason } = data;
    const call = this.activeCalls.get(callId);
    if (!call) return;

    const targetSocketId = this.userSockets.get(call.from);
    if (targetSocketId) {
      this.io.to(targetSocketId).emit('call-rejected', { callId, reason });
    }
    this.cleanupCall(callId);
    logger.info('Call rejected', { callId, by: socket.userId, reason });
  }

  handleEndCall(socket, data) {
    const { callId } = data;
    this.cleanupCall(callId);
    // Notify both parties
    const call = this.activeCalls.get(callId);
    if (call) {
      const sockets = [
        this.userSockets.get(call.from),
        this.userSockets.get(call.to)
      ];
      sockets.forEach(socketId => {
        if (socketId) {
          this.io.to(socketId).emit('call-ended', { callId });
        }
      });
    }
    logger.info('Call ended', { callId, by: socket.userId });
  }

  handleIceCandidate(socket, data) {
    const { candidate, callId } = data;
    const call = this.activeCalls.get(callId);
    if (!call) return;

    const targetSocketId = socket.userId === call.from 
      ? this.userSockets.get(call.to)
      : this.userSockets.get(call.from);

    if (targetSocketId) {
      this.io.to(targetSocketId).emit('ice-candidate', { candidate, callId });
    }
  }

  handleToggleMedia(socket, data) {
    const { callId, type, enabled } = data; // type: 'mute', 'camera'
    const call = this.activeCalls.get(callId);
    if (!call) return;

    const targetSocketId = socket.userId === call.from 
      ? this.userSockets.get(call.to)
      : this.userSockets.get(call.from);

    if (targetSocketId) {
      this.io.to(targetSocketId).emit('call-toggle', { callId, type, enabled });
    }
  }

  cleanupCall(callId) {
    this.activeCalls.delete(callId);
  }
}

export default CallHandler;

