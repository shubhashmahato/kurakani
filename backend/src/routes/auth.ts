import { Router } from 'express';
import { firebaseAuth, getMe, updatePushToken, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/firebase', firebaseAuth);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/push-token', authenticate, updatePushToken);
router.post('/logout', authenticate, logout);

export default router;