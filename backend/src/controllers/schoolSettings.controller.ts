import { Request, Response } from 'express';
import { SchoolSettingsService } from '../services/schoolSettings.service';
import { successResponse, errorResponse } from '../helpers/response.helper';

export class SchoolSettingsController {
    static async getSettings(req: Request, res: Response): Promise<void> {
        try {
            const settings = await SchoolSettingsService.getSettings();
            successResponse(res, settings, 'Pengaturan branding & sistem berhasil diambil.', 200);
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal mengambil pengaturan.', 400);
        }
    }

    static async updateSettings(req: Request, res: Response): Promise<void> {
        try {
            const settings = await SchoolSettingsService.updateSettings(req.body);
            successResponse(res, settings, 'Pengaturan branding & sistem berhasil diperbarui.', 200);
        } catch (error: any) {
            errorResponse(res, error.message || 'Gagal memperbarui pengaturan.', 400);
        }
    }
}
