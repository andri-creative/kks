import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../helpers/response.helper';

export class AuthController {
    // Handler untuk login
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { code } = req.body;
            const result = await AuthService.login(code);
            successResponse(res, result, 'Login berhasil!', 200);
        } catch (error: any) {
            errorResponse(res, error.message || 'Login gagal!', 400);
        }
    }
}
