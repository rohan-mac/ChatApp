import { Router } from 'express';
import {
  login,
  logout,
  me,
  refreshAccessToken,
  register
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema
} from '../validators/authValidator.js';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/refresh', validateRequest(refreshTokenSchema), refreshAccessToken);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, me);

export default router;
