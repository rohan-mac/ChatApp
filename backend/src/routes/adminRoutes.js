import { Router } from 'express';
import {
  deleteAdminMessage,
  deleteAdminUser,
  getAdminChats,
  getAdminUsers,
  getDashboardStats,
  getFlaggedMessages,
  getReports
} from '../controllers/adminController.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken, isAdmin);
router.get('/dashboard', getDashboardStats);
router.get('/users', getAdminUsers);
router.delete('/user/:id', deleteAdminUser);
router.get('/chats', getAdminChats);
router.delete('/message/:id', deleteAdminMessage);
router.get('/reports', getReports);
router.get('/reports/flagged', getFlaggedMessages);

export default router;
