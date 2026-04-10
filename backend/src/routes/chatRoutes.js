import { Router } from 'express';
import {
  archiveChat,
  clearChat,
  createGroupChat,
  createOrGetChat,
  getChatMessagesPreview,
  getChats,
  pinChat,
  unarchiveChat,
  updateGroupChat
} from '../controllers/chatController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  chatActionSchema,
  createDirectChatSchema,
  createGroupChatSchema,
  listChatsSchema,
  updateGroupSchema
} from '../validators/chatValidator.js';

const router = Router();

router.get('/', verifyToken, validateRequest(listChatsSchema), getChats);
router.post('/', verifyToken, validateRequest(createDirectChatSchema), createOrGetChat);
router.post('/group', verifyToken, validateRequest(createGroupChatSchema), createGroupChat);
router.patch('/group/:chatId', verifyToken, validateRequest(updateGroupSchema), updateGroupChat);
router.get('/:chatId/preview', verifyToken, validateRequest(chatActionSchema), getChatMessagesPreview);
router.post('/:chatId/pin', verifyToken, validateRequest(chatActionSchema), pinChat);
router.post('/:chatId/archive', verifyToken, validateRequest(chatActionSchema), archiveChat);
router.post('/:chatId/clear', verifyToken, validateRequest(chatActionSchema), clearChat);
router.delete('/:chatId/archive', verifyToken, validateRequest(chatActionSchema), unarchiveChat);

export default router;
