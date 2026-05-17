import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import dbConfig from './config/db.json';

const app: Express = express();
app.use(cors({
    origin: '*', // Untuk development, ganti dengan domain spesifik di production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Main Root Endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'success',
        message: 'Server Berjalan dengan Baik!'
    });
});

// Mount API Routes
app.use('/' + dbConfig.path, apiRouter);

export default app;