import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const passthroughObject = z.object({}).passthrough();

export const sendMessageSchema = z.object({
  body: z.object({
    chatId: objectId,
    text: z.string().trim().max(4000).optional().default(''),
    replyTo: objectId.optional(),
    clientMessageId: z.string().trim().max(120).optional()
  }),
  query: passthroughObject,
  params: passthroughObject
});

export const listMessagesSchema = z.object({
  body: passthroughObject,
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(30)
  }),
  params: z.object({
    chatId: objectId
  })
});

export const messageStatusSchema = z.object({
  body: z.object({
    status: z.enum(['delivered', 'seen'])
  }),
  query: passthroughObject,
  params: z.object({
    id: objectId
  })
});

export const editMessageSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1).max(4000)
  }),
  query: passthroughObject,
  params: z.object({
    id: objectId
  })
});

export const toggleStarSchema = z.object({
  body: passthroughObject,
  query: passthroughObject,
  params: z.object({
    id: objectId
  })
});

export const reactionSchema = z.object({
  body: z.object({
    emoji: z.string().trim().min(1).max(8)
  }),
  query: passthroughObject,
  params: z.object({
    id: objectId
  })
});

export const deleteMessageSchema = z.object({
  body: z.object({
    scope: z.enum(['me', 'everyone'])
  }),
  query: passthroughObject,
  params: z.object({
    id: objectId
  })
});

export const searchMessagesSchema = z.object({
  body: passthroughObject,
  query: z.object({
    q: z.string().trim().min(1),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20)
  }),
  params: passthroughObject
});

export const reportMessageSchema = z.object({
  body: z.object({
    reason: z.string().trim().min(4).max(250)
  }),
  query: passthroughObject,
  params: z.object({
    id: objectId
  })
});
