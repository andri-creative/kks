import { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { validateRequest, createCandidateSchema, updateCandidateSchema } from '../validators';

const router = Router();

// Semua route di bawah ini wajib terautentikasi (Siswa & Admin)
router.use(authMiddleware);

// 1. Ambil semua kandidat: GET /api/candidates (Akses: Siswa & Admin)
router.get('/', CandidateController.getAll);

// 2. Ambil detail kandidat: GET /api/candidates/:id (Akses: Siswa & Admin)
router.get('/:id', CandidateController.getById);

// --- PROTEKSI KHUSUS ADMIN ---
// 3. Tambah kandidat baru: POST /api/candidates (Akses: Admin)
router.post('/', adminMiddleware, validateRequest(createCandidateSchema), CandidateController.create);

// 4. Update data kandidat: PUT /api/candidates/:id (Akses: Admin)
router.put('/:id', adminMiddleware, validateRequest(updateCandidateSchema), CandidateController.update);

// 5. Hapus kandidat: DELETE /api/candidates/:id (Akses: Admin)
router.delete('/:id', adminMiddleware, CandidateController.delete);

export default router;
