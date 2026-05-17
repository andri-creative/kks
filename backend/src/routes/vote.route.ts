import { Router } from 'express';
import { VoteController } from '../controllers/vote.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest, createVoteSchema } from '../validators';

const router = Router();

// Semua route voting wajib terautentikasi
router.use(authMiddleware);

// 1. Melakukan Voting (Pilih Kandidat): POST /api/votes
router.post('/', validateRequest(createVoteSchema), VoteController.castVote);

// 2. Mengambil Statistik Hasil Voting: GET /api/votes/stats
router.get('/stats', VoteController.getStats);

export default router;
