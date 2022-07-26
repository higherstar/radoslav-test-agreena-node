import { Router } from 'express';

import { authController } from '../controllers/AuthController';
import { certificateController } from "../controllers/CertificateController";

import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/auth/signin', authController.login);
router.post('/auth/signup', authController.register);
router.post('/auth/refresh', authController.refresh);

router.get('/carbon/allowed-list', authenticate, certificateController.getAvailableList);
router.get('/carbon/owned-list', authenticate, certificateController.getOwnedList);
router.post('/carbon/transfer/:id', authenticate, certificateController.transfer);

export default router;
