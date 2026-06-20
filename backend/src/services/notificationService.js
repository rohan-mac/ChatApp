import { getFirebaseMessaging } from '../config/firebaseAdmin.js';
import { logger } from '../utils/logger.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

const isFirebaseNotConfigured = () => !getFirebaseMessaging();

const safeToString = (v) => (v === undefined || v === null ? '' : String(v));

/**
 * Send FCM push to a user (multi-device tokens).
 *
 * @param {Object} params
 * @param {Object} params.user - recipient user doc with _id and pushTokens
 * @param {string} params.title
 * @param {string} params.body
 * @param {Object} params.data - custom payload
 */
export const sendPushNotification = async ({ user, title, body, data = {} }) => {
  if (!user?._id) return;
  const tokens = Array.isArray(user.pushTokens) ? user.pushTokens : [];
  if (!tokens.length) return;

  if (isFirebaseNotConfigured()) {
    logger.warn('FCM not configured; skipping sendPushNotification', {
      userId: user._id.toString(),
      tokenCount: tokens.length
    });
    return;
  }

  const messaging = getFirebaseMessaging();

  const messagePayload = {
    tokens,
    notification: {
      title: safeToString(title) || 'New message',
      body: safeToString(body) || ''
    },
    data: Object.fromEntries(
      Object.entries({
        type: data.type || 'message',
        chatId: safeToString(data.chatId),
        senderId: safeToString(data.senderId),
        senderName: safeToString(data.senderName),
        notificationId: safeToString(data.notificationId),
        // optional fields
        messageId: safeToString(data.messageId)
      }).map(([k, v]) => [k, typeof v === 'string' ? v : safeToString(v)])
    ),
    android: {
      priority: 'high'
    },
    apns: {
      headers: {
        'apns-priority': '10'
      }
    }
  };

  try {
    logger.info('FCM batch send', {
      userId: user._id.toString(),
      tokenCount: tokens.length,
      chatId: data.chatId
    });

    const response = await messaging.sendEachForMulticast(messagePayload);

    const invalidTokens = [];
    response.responses.forEach((r, idx) => {
      const token = tokens[idx];
      if (!r?.error) return;
      const code = r.error.code || '';
      const msg = r.error.message || '';

      // Common invalid token errors
      if (
        code.includes('registration-token-not-') ||
        code.includes('invalid-registration-token') ||
        msg.includes('registration-token-not-') ||
        msg.includes('invalid')
      ) {
        invalidTokens.push(token);
      }
    });

    if (invalidTokens.length) {
      await User.updateOne(
        { _id: user._id },
        { $pull: { pushTokens: { $in: invalidTokens } } }
      );
      logger.info('Removed invalid FCM tokens', {
        userId: user._id.toString(),
        removed: invalidTokens.length
      });
    }

    return response;
  } catch (error) {
    logger.error('FCM send failed', {
      userId: user._id.toString(),
      chatId: data.chatId,
      error: error?.message
    });
    return null;
  }
};

/**
 * Create notification history row with idempotency (messageId+recipientId+type).
 */
export const createNotificationHistory = async ({ recipientId, senderId, chatId, title, message, type, messageId }) => {
  try {
    const created = await Notification.create({
      userId: recipientId,
      senderId,
      chatId,
      title,
      message,
      type,
      read: false,
      messageId: messageId || null
    });
    return created;
  } catch (e) {
    // If unique sparse index triggers, treat as duplicate
    logger.debug('Notification history dedupe hit', {
      recipientId: recipientId?.toString?.(),
      chatId: chatId?.toString?.(),
      messageId: messageId?.toString?.()
    });
    return await Notification.findOne({
      userId: recipientId,
      messageId: messageId || null,
      type
    });
  }
};

