import { Request, Response } from 'express';
import { CandidateService } from '../services/candidate.service';
import { successResponse, errorResponse } from '../helpers/response.helper';

export class CandidateController {
    // 1. Ambil semua kandidat
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const candidates = await CandidateService.getAll();
            successResponse(res, candidates, 'Berhasil memuat daftar kandidat.');
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal memuat daftar kandidat.');
        }
    }

    // 2. Ambil detail kandidat
    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const candidate = await CandidateService.getById(id);
            successResponse(res, candidate, 'Berhasil memuat detail kandidat.');
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal memuat detail kandidat.');
        }
    }

    // 3. Tambah kandidat baru
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const newCandidate = await CandidateService.create(req.body);
            successResponse(res, newCandidate, 'Kandidat baru berhasil ditambahkan!', 201);
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal menambahkan kandidat baru.', 400);
        }
    }

    // 4. Update data kandidat
    static async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const updatedCandidate = await CandidateService.update(id, req.body);
            successResponse(res, updatedCandidate, 'Data kandidat berhasil diperbarui!');
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal memperbarui data kandidat.', 400);
        }
    }

    // 5. Hapus kandidat
    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await CandidateService.delete(id);
            successResponse(res, null, 'Kandidat berhasil dihapus dari database.');
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal menghapus kandidat.');
        }
    }
}
