import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Endpoint Login: POST /api/auth/login
router.post('/login', AuthController.login);

export default router;
