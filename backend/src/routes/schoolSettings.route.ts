import { Router } from 'express';
import { SchoolSettingsController } from '../controllers/schoolSettings.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// 1. Ambil pengaturan (Public untuk login branding): GET /api/school-settings
router.get('/', SchoolSettingsController.getSettings);

// 2. Perbarui pengaturan (Hanya Admin): PUT /api/school-settings
router.put('/', authMiddleware, adminMiddleware, SchoolSettingsController.updateSettings);

export default router;
