import { Router } from 'express';
import multer from 'multer';
import {
  blockUser,
  deleteUser,
  getProfile,
  getUsers,
  promoteToAdmin,
  registerPushToken,
  toggleBlockUser,
  unblockUser,
  updatePreferences,
  updateProfile
} from '../controllers/userController.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  blockUserSchema,
  registerPushTokenSchema,
  searchUsersSchema,
  updatePreferencesSchema,
  updateProfileSchema
} from '../validators/userValidator.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/', verifyToken, validateRequest(searchUsersSchema), getUsers);
router.get('/me', verifyToken, getProfile);
router.patch('/me', verifyToken, upload.single('avatar'), validateRequest(updateProfileSchema), updateProfile);
router.patch('/preferences', verifyToken, validateRequest(updatePreferencesSchema), updatePreferences);
router.post('/push-token', verifyToken, validateRequest(registerPushTokenSchema), registerPushToken);
router.post('/block/:id', verifyToken, validateRequest(blockUserSchema), blockUser);
router.post('/unblock/:id', verifyToken, validateRequest(blockUserSchema), unblockUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);
router.patch('/moderation/block/:id', verifyToken, isAdmin, toggleBlockUser);
router.patch('/promote/:id', verifyToken, isAdmin, promoteToAdmin);

export default router;
