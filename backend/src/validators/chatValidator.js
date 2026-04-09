import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const passthroughObject = z.object({}).passthrough();

export const createDirectChatSchema = z.object({
  body: z.object({
    receiverId: objectId
  }),
  query: passthroughObject,
  params: passthroughObject
});

export const createGroupChatSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(120),
    participantIds: z.array(objectId).min(2),
    description: z.string().trim().max(300).optional()
  }),
  query: passthroughObject,
  params: passthroughObject
});

export const updateGroupSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().max(300).optional(),
    participantId: objectId.optional(),
    action: z.enum(['add', 'remove']).optional()
  }),
  query: passthroughObject,
  params: z.object({
    chatId: objectId
  })
});

export const listChatsSchema = z.object({
  body: passthroughObject,
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
    archived: z.enum(['true', 'false']).optional(),
    search: z.string().optional()
  }),
  params: passthroughObject
});

export const chatActionSchema = z.object({
  body: passthroughObject,
  query: passthroughObject,
  params: z.object({
    chatId: objectId
  })
});
