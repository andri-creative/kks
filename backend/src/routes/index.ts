import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import candidateRouter from './candidate.route';
import voteRouter from './vote.route';
import schoolSettingsRouter from './schoolSettings.route';

const router = Router();

// Gabungkan semua route dengan prefix masing-masing
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/candidates', candidateRouter);
router.use('/votes', voteRouter);
router.use('/school-settings', schoolSettingsRouter);

// Helper route for bypassing CORS on CDN images for PDF generation
router.get('/proxy-image', async (req, res) => {
    try {
        const imageUrl = req.query.url as string;
        if (!imageUrl) {
            res.status(400).json({ error: 'URL is required' });
            return;
        }
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const contentType = response.headers.get('content-type') || 'image/png';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400')
        res.send(buffer);
    } catch (error) {
        console.error('Image proxy error:', error);
        res.status(500).json({ error: 'Failed to proxy image' });
    }
});

export default router;
