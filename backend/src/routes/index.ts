import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import candidateRouter from './candidate.route';
import voteRouter from './vote.route';

const router = Router();

// Gabungkan semua route dengan prefix masing-masing
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/candidates', candidateRouter);
router.use('/votes', voteRouter);

export default router;
