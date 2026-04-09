import { z } from 'zod';

const passthroughObject = z.object({}).passthrough();

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(100)
  }),
  query: passthroughObject,
  params: passthroughObject
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  }),
  query: passthroughObject,
  query: passthroughObject,
  params: passthroughObject
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional()
  }),
  query: passthroughObject,
  params: passthroughObject
});
