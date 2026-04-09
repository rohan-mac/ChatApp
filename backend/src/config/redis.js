import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const createRedisClients = async (io) => {
  if (!env.REDIS_URL) {
    logger.info('Redis disabled; using in-memory fallbacks');
    return null;
  }

  try {
    const command = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 1 });
    const pub = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 1 });
    const sub = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 1 });

    io.adapter(createAdapter(pub, sub));
    await command.ping();
    logger.info('Redis connected and socket adapter enabled');

    return { command, pub, sub };
  } catch (error) {
    logger.error('Redis connection failed, continuing without adapter', { message: error.message });
    return null;
  }
};
