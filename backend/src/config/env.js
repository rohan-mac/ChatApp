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
  REDIS_URL: z.string().optional(),
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

export const env = {
  ...parsed.data,
  CORS_ORIGINS: parsed.data.CLIENT_URLS
    ? parsed.data.CLIENT_URLS.split(',').map((origin) => origin.trim())
    : [parsed.data.CLIENT_URL]
};
