import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const passthroughObject = z.object({}).passthrough();

export const searchUsersSchema = z.object({
  body: passthroughObject,
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20)
  }),
  params: passthroughObject
});

export const blockUserSchema = z.object({
  body: passthroughObject,
  query: passthroughObject,
  params: z.object({
    id: objectId
  })
});

export const registerPushTokenSchema = z.object({
  body: z.object({
    pushToken: z.string().trim().min(8)
  }),
  query: passthroughObject,
  params: passthroughObject
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    bio: z.string().trim().max(160).optional(),
    status: z.string().trim().max(80).optional()
  }),
  query: passthroughObject,
  params: passthroughObject
});

export const updatePreferencesSchema = z.object({
  body: z.object({
    themePreference: z.enum(['light', 'dark']).optional(),
    notificationsEnabled: z.boolean().optional(),
    readReceiptsEnabled: z.boolean().optional()
  }),
  query: passthroughObject,
  params: passthroughObject
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6)
  }),
  query: passthroughObject,
  params: passthroughObject
});
