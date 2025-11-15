// backend/src/routes/userRoutes.ts
import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);

// Current user
router.get('/me', authenticate, getCurrentUser);

export default router;
