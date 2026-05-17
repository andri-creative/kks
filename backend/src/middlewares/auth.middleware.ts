/// <reference path="../@types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helpers/jwt.helper';
import { errorResponse } from '../helpers/response.helper';
import { User } from '../models';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const xToken = req.headers['x-token'];
        const xTimestamp = req.headers['x-timestamp'];

        // 1. Validasi keberadaan X-Timestamp (Proteksi Replay Attack)
        if (!xTimestamp) {
            errorResponse(res, 'Akses ditolak! Header X-Timestamp wajib disertakan.', 400);
            return;
        }

        const requestTime = parseInt(xTimestamp as string, 10);
        if (isNaN(requestTime)) {
            errorResponse(res, 'Format X-Timestamp tidak valid! Harus berupa Unix timestamp (dalam detik).', 400);
            return;
        }

        // Hitung selisih waktu server dengan request (toleransi maksimal 5 menit / 300 detik)
        const currentTime = Math.floor(Date.now() / 1000);
        const timeDiff = Math.abs(currentTime - requestTime);

        if (timeDiff > 300) {
            errorResponse(res, 'Request kedaluwarsa! Selisih waktu X-Timestamp terlalu jauh.', 401);
            return;
        }

        // 2. Validasi keberadaan X-Token
        if (!xToken || typeof xToken !== 'string') {
            errorResponse(res, 'Akses ditolak! Header X-Token tidak disediakan.', 401);
            return;
        }

        const decoded = verifyToken(xToken);
        if (!decoded) {
            errorResponse(res, 'Token tidak valid atau telah kedaluwarsa!', 401);
            return;
        }

        // Cari user di database
        const user = await User.findByPk(decoded.id);
        if (!user) {
            errorResponse(res, 'Pengguna tidak ditemukan!', 404);
            return;
        }

        if (user.status !== 'Active') {
            errorResponse(res, 'Akun Anda tidak aktif! Silakan hubungi admin.', 403);
            return;
        }

        // Simpan data user ke request.currentUser (berkat @types/express.d.ts)
        req.currentUser = user.toJSON();
        
        next();
    } catch (error) {
        errorResponse(res, 'Terjadi kesalahan sistem pada middleware auth.', 500);
    }
};

// Middleware Khusus Admin
export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.currentUser || req.currentUser.roles !== 'Admin') {
        errorResponse(res, 'Akses ditolak! Menu ini hanya untuk Administrator.', 403);
        return;
    }
    next();
};
