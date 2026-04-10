import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { createRedisClients } from './config/redis.js';
import { configureSocket } from './socket/socketServer.js';
import { logger } from './utils/logger.js';

const bootstrap = async () => {
  await connectDB();

  const server = http.createServer(app);

  // ============================================================================
  // Socket.IO CORS Configuration - MUST match HTTP CORS
  // ============================================================================
  const io = new Server(server, {
    cors: {
      // Strict origin validation for Socket.IO (same as Express CORS)
      origin: (origin, callback) => {
        // Allow requests with no origin
        if (!origin) {
          return callback(null, true);
        }

        // Check if origin is whitelisted
        if (env.CORS_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          logger.warn('Socket.IO CORS request blocked', {
            origin,
            allowedOrigins: env.CORS_ORIGINS
          });
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  const redis = await createRedisClients(io);
  app.set('io', io);
  app.set('redis', redis?.command ?? null);

  configureSocket(io);

  server.listen(env.PORT, () => {
    logger.info('HTTP server started', {
      port: env.PORT,
      env: env.NODE_ENV,
      corsOrigins: env.CORS_ORIGINS
    });
  });

  // ============================================================================
  // Graceful Shutdown Handler
  // ============================================================================
  const shutdown = async (signal) => {
    logger.info('Graceful shutdown requested', { signal });
    server.close(async () => {
      await mongoose.connection.close();
      if (redis?.command) await redis.command.quit();
      if (redis?.pub) await redis.pub.quit();
      if (redis?.sub) await redis.sub.quit();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

bootstrap().catch((error) => {
  logger.error('Bootstrap failed', { message: error.message, stack: error.stack });
  process.exit(1);
});
