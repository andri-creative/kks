import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { successResponse, errorResponse } from '../helpers/response.helper';

export class UserController {
    // 1. Ambil semua pemilih
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await UserService.getAll();
            successResponse(res, users, 'Berhasil memuat daftar pemilih.');
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal memuat daftar pemilih.');
        }
    }

    // 2. Ambil detail pemilih berdasarkan ID
    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const user = await UserService.getById(id);
            successResponse(res, user, 'Berhasil memuat detail pemilih.');
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal memuat detail pemilih.');
        }
    }

    // 3. Tambah pemilih baru
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const newUser = await UserService.create(req.body);
            successResponse(res, newUser, 'Pemilih baru berhasil didaftarkan!', 201);
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal mendaftarkan pemilih baru.', 400);
        }
    }

    // 4. Update data pemilih
    static async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const updatedUser = await UserService.update(id, req.body);
            successResponse(res, updatedUser, 'Data pemilih berhasil diperbarui!');
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal memperbarui data pemilih.', 400);
        }
    }

    // 5. Hapus pemilih
    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await UserService.delete(id);
            successResponse(res, null, 'Pemilih berhasil dihapus dari database.');
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal menghapus pemilih.');
        }
    }
}
