import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { stream } from './utils/logger.js';

const app = express();

app.set('trust proxy', env.TRUST_PROXY);
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true
  })
);
app.use(compression());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream }));
app.use(express.json({ limit: env.JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: env.JSON_LIMIT }));
app.use(cookieParser());
app.use('/api', apiLimiter);

app.get('/health', async (req, res) => {
  const redis = req.app.get('redis');
  let redisStatus = 'disabled';

  if (redis) {
    try {
      await redis.ping();
      redisStatus = 'up';
    } catch {
      redisStatus = 'down';
    }
  }

  res.json({
    status: 'ok',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    services: { redis: redisStatus }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
