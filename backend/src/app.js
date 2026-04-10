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
import { stream, logger } from './utils/logger.js';

const app = express();

// ============================================================================
// CRITICAL: Trust proxy MUST be set before CORS for accurate IP detection
// ============================================================================
app.set('trust proxy', env.TRUST_PROXY);

// ============================================================================
// Helmet: Security headers
// ============================================================================
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// ============================================================================
// CORS Configuration - PRODUCTION READY
// ============================================================================
// This MUST come before all routes and middleware that need CORS support

const corsOptions = {
  // Strict origin validation - NO wildcards in production
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in the whitelist
    if (env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      // Log rejected origins for debugging
      logger.warn('CORS request blocked', {
        origin,
        allowedOrigins: env.CORS_ORIGINS
      });
      callback(new Error('Not allowed by CORS'));
    }
  },

  // Allow sending cookies and auth headers with requests
  credentials: true,

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],

  // Allowed request headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Accept-Language',
    'Content-Length'
  ],

  // Headers exposed to the browser
  exposedHeaders: ['Content-Length', 'X-Content-Type-Options'],

  // Cache preflight requests for 86400 seconds (24 hours)
  maxAge: 86400,

  // Whether to include credentials in the response
  preflightContinue: false
};

// Apply CORS middleware BEFORE any routes
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests explicitly (already handled by cors middleware,
// but making it explicit for clarity)
app.options('*', cors(corsOptions));

// ============================================================================
// DEBUG MIDDLEWARE: Log request origins (development/staging)
// ============================================================================
app.use((req, res, next) => {
  if (env.NODE_ENV !== 'production') {
    logger.debug('Incoming request', {
      method: req.method,
      path: req.path,
      origin: req.get('origin') || 'no-origin',
      userAgent: req.get('user-agent')?.substring(0, 50)
    });
  }
  next();
});

// ============================================================================
// Standard middleware stack
// ============================================================================
app.use(compression());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream }));
app.use(express.json({ limit: env.JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: env.JSON_LIMIT }));
app.use(cookieParser());

// Rate limiting applied after CORS to avoid blocking preflight requests
app.use('/api', apiLimiter);

// ============================================================================
// Health check endpoint (no auth required)
// ============================================================================
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
    cors: {
      allowedOrigins: env.CORS_ORIGINS
    },
    services: { redis: redisStatus }
  });
});

// ============================================================================
// API Routes
// ============================================================================
// These routes automatically get CORS headers from the middleware above
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// ============================================================================
// 404 and Error Handling (must be last)
// ============================================================================
app.use(notFound);
app.use(errorHandler);

export default app;
