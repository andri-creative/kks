import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { validateRequest, createUserSchema, updateUserSchema } from '../validators';

const router = Router();

// Semua route di bawah ini diproteksi (Hanya Admin)
router.use(authMiddleware);
router.use(adminMiddleware);

// 1. Ambil semua pemilih: GET /api/users
router.get('/', UserController.getAll);

// 2. Ambil detail pemilih: GET /api/users/:id
router.get('/:id', UserController.getById);

// 3. Tambah pemilih baru: POST /api/users
router.post('/', validateRequest(createUserSchema), UserController.create);

// 4. Update data pemilih: PUT /api/users/:id
router.put('/:id', validateRequest(updateUserSchema), UserController.update);

// 5. Hapus pemilih: DELETE /api/users/:id
router.delete('/:id', UserController.delete);

export default router;
