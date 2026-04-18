import { Router } from 'express';
import {
  deleteMessage,
  editMessage,
  getMessagesByChat,
  reactToMessage,
  reportMessage,
  searchMessages,
  sendMessage,
  toggleStarMessage,
  updateMessageStatus
} from '../controllers/messageController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { uploadAttachment } from '../middleware/uploadMiddleware.js';
import {
  deleteMessageSchema,
  editMessageSchema,
  listMessagesSchema,
  messageStatusSchema,
  reactionSchema,
  reportMessageSchema,
  searchMessagesSchema,
  toggleStarSchema,
  sendMessageSchema
} from '../validators/messageValidator.js';

const router = Router();

router.post('/', verifyToken, uploadAttachment.single('file'), validateRequest(sendMessageSchema), sendMessage);
router.get('/search', verifyToken, validateRequest(searchMessagesSchema), searchMessages);
router.get('/:chatId', verifyToken, validateRequest(listMessagesSchema), getMessagesByChat);
router.patch('/:id', verifyToken, validateRequest(editMessageSchema), editMessage);
router.patch('/:id/status', verifyToken, validateRequest(messageStatusSchema), updateMessageStatus);
router.post('/:id/star', verifyToken, validateRequest(toggleStarSchema), toggleStarMessage);
router.post('/:id/reactions', verifyToken, validateRequest(reactionSchema), reactToMessage);
router.post('/:id/report', verifyToken, validateRequest(reportMessageSchema), reportMessage);
router.delete('/:id', verifyToken, validateRequest(deleteMessageSchema), deleteMessage);

export default router;
