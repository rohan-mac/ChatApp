import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  markReadAndGetChat
} from '../controllers/notificationController.js';
import { z } from 'zod';

const router = Router();

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(50).default(20).optional(),
  unreadOnly: z.string().optional()
});

const idParamsSchema = z.object({ id: objectId });

router.get(
  '/',
  verifyToken,
  validateRequest({
    body: z.object({}).passthrough(),
    query: listQuerySchema,
    params: z.object({}).passthrough()
  }),
  getNotifications
);

router.get(
  '/unread-count',
  verifyToken,
  validateRequest({
    body: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
    params: z.object({}).passthrough()
  }),
  getUnreadCount
);

router.patch(
  '/:id/read',
  verifyToken,
  validateRequest({
    body: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
    params: idParamsSchema
  }),
  markAsRead
);

router.patch(
  '/read-all',
  verifyToken,
  validateRequest({
    body: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
    params: z.object({}).passthrough()
  }),
  markAllAsRead
);

router.delete(
  '/:id',
  verifyToken,
  validateRequest({
    body: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
    params: idParamsSchema
  }),
  deleteNotification
);

// Used by SW / notification click flow
router.post(
  '/click/mark-read',
  verifyToken,
  validateRequest({
    body: z.object({ notificationId: objectId }),
    query: z.object({}).passthrough(),
    params: z.object({}).passthrough()
  }),
  markReadAndGetChat
);

// Internal placeholder for requirement `POST /api/notifications/send`
// (not implemented here yet; currently notifications are created from sendMessage)
router.post(
  '/send',
  verifyToken,
  asyncHandler(async (req, res) => {
    res.status(501).json({ message: 'Not implemented: send endpoint. Notifications are created from message events.' });
  })
);

export default router;

