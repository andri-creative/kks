import { Router } from 'express';
import { VoteController } from '../controllers/vote.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { validateRequest, createVoteSchema } from '../validators';

const router = Router();

// Semua route voting wajib terautentikasi
router.use(authMiddleware);

// 1. Melakukan Voting (Pilih Kandidat): POST /api/votes
router.post('/', validateRequest(createVoteSchema), VoteController.castVote);

// 2. Menutup Sesi Karena Waktu Habis (Auto-Logout): POST /api/votes/expire
router.post('/expire', VoteController.expireSession);

// 3. Mengambil Statistik Hasil Voting: GET /api/votes/stats
router.get('/stats', VoteController.getStats);

// 4. Mengambil Semua Data Log Pemilihan (Hanya Admin): GET /api/votes
router.get('/', adminMiddleware, VoteController.getAllVotes);

export default router;
