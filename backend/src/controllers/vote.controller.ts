import { Request, Response } from 'express';
import { VoteService } from '../services/vote.service';
import { successResponse, errorResponse } from '../helpers/response.helper';

export class VoteController {
    // 1. Melakukan Voting (Pilih Kandidat)
    static async castVote(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.currentUser?.id;
            if (!userId) {
                errorResponse(res, 'Anda tidak terautentikasi!', 401);
                return;
            }

            const { candidate_id, time_remaining } = req.body;
            const vote = await VoteService.castVote(userId, candidate_id, Number(time_remaining || 0));
            
            successResponse(res, vote, 'Pilihan Anda berhasil disimpan! Terima kasih atas partisipasi Anda.', 201);
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal melakukan voting.', 400);
        }
    }

    // 2. Menutup Sesi Karena Waktu Habis (Auto-Logout)
    static async expireSession(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.currentUser?.id;
            if (!userId) {
                errorResponse(res, 'Anda tidak terautentikasi!', 401);
                return;
            }

            const result = await VoteService.expireSession(userId);
            successResponse(res, result, 'Batas waktu habis. Sesi Anda berhasil dinonaktifkan.', 200);
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal memproses penutupan sesi.', 400);
        }
    }

    // 2. Mengambil Statistik Hasil Real-Time
    static async getStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await VoteService.getStatistics();
            successResponse(res, stats, 'Statistik voting berhasil dimuat.');
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal memuat statistik voting.');
        }
    }

    // 3. Mengambil Semua Data Log Pemilihan (Untuk Admin)
    static async getAllVotes(req: Request, res: Response): Promise<void> {
        try {
            const votes = await VoteService.getAllVotes();
            successResponse(res, votes, 'Seluruh data audit log voting berhasil dimuat.');
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal memuat data audit log voting.');
        }
    }
}
