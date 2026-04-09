import { logger } from '../utils/logger.js';

export const sendPushNotification = async ({ user, title, body, data = {} }) => {
  if (!user?.pushTokens?.length) {
    return;
  }

  logger.info('Push notification queued', {
    userId: user._id?.toString?.(),
    title,
    body,
    tokenCount: user.pushTokens.length,
    data
  });
};
