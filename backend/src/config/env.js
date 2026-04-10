import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16).default('refresh-secret-change-me'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  CLIENT_URLS: z.string().optional(),
  JSON_LIMIT: z.string().default('5mb'),
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  FCM_SERVER_KEY: z.string().optional()
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.message).join(', ')}`);
}

// Build CORS origins list
const buildCorsOrigins = () => {
  const origins = new Set();

  // Always allow localhost for development
  origins.add('http://localhost:5173');
  origins.add('http://localhost:5174');
  origins.add('http://localhost:3000');
  origins.add('https://chat-app-git-main-rohan-macs-projects.vercel.app');
  origins.add('https://chat-app-tau-ivory.vercel.app');
  origins.add('capacitor://localhost'); // For mobile apps using Capacitor
  // Add configured client URL
  if (parsed.data.CLIENT_URL) {
    origins.add(parsed.data.CLIENT_URL);
  }

  // Add additional URLs from CLIENT_URLS env var
  if (parsed.data.CLIENT_URLS) {
    parsed.data.CLIENT_URLS.split(',').forEach((url) => {
      origins.add(url.trim());
    });
  }

  return Array.from(origins);
};

export const env = {
  ...parsed.data,
  CORS_ORIGINS: buildCorsOrigins()
};
