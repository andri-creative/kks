import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import 'dotenv/config';

const app: Express = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-timestamp', 'x-token', 'x-client-id', 'X-Timestamp', 'X-Token'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Main Root Endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'success',
        message: 'Server Berjalan dengan Baik!'
    });
});

// Mount API Routes
app.use('/' + (process.env.API_PATH || 'v1/api'), apiRouter);

export default app;