// backend/src/routes/userRoutes.ts
import { Router } from 'express';
import { register, login, refresh, getCurrentUser } from '../controllers/userController';
import { getMyEmployee } from '../controllers/meController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);

// Current user
router.get('/me', authenticate, getCurrentUser);
router.get('/me/employee', authenticate, getMyEmployee);

export default router;
