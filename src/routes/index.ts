import { Router } from 'express';

import { authController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/auth/signin', authController.login);
router.post('/auth/signup', authController.register);
router.post('/auth/refresh', authController.refresh);
router.get('/auth/me', authenticate, authController.fetchMe);

export default router;
