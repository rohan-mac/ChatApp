import { Router } from 'express';
import {
  blockUser,
  changePassword,
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
import { uploadAvatar } from '../middleware/uploadMiddleware.js';
import {
  blockUserSchema,
  changePasswordSchema,
  registerPushTokenSchema,
  searchUsersSchema,
  updatePreferencesSchema,
  updateProfileSchema
} from '../validators/userValidator.js';

const router = Router();

router.get('/', verifyToken, validateRequest(searchUsersSchema), getUsers);
router.get('/me', verifyToken, getProfile);
router.patch('/me', verifyToken, uploadAvatar.single('avatar'), validateRequest(updateProfileSchema), updateProfile);
router.patch('/preferences', verifyToken, validateRequest(updatePreferencesSchema), updatePreferences);
router.patch('/change-password', verifyToken, validateRequest(changePasswordSchema), changePassword);
router.post('/push-token', verifyToken, validateRequest(registerPushTokenSchema), registerPushToken);
router.post('/block/:id', verifyToken, validateRequest(blockUserSchema), blockUser);
router.post('/unblock/:id', verifyToken, validateRequest(blockUserSchema), unblockUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);
router.patch('/moderation/block/:id', verifyToken, isAdmin, toggleBlockUser);
router.patch('/promote/:id', verifyToken, isAdmin, promoteToAdmin);

export default router;
