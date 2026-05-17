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

            const { candidate_id } = req.body;
            const vote = await VoteService.castVote(userId, candidate_id);
            
            successResponse(res, vote, 'Pilihan Anda berhasil disimpan! Terima kasih atas partisipasi Anda.', 201);
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal melakukan voting.', 400);
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
}
