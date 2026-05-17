import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateRequest = (schema: z.ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Validasi data request body, query, dan params
            const parsed = (await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })) as any;
            
            // Masukkan data yang sudah tervalidasi kembali ke request secara aman
            if (parsed.body !== undefined) {
                req.body = parsed.body;
            }
            if (parsed.query !== undefined) {
                Object.assign(req.query, parsed.query);
            }
            if (parsed.params !== undefined) {
                Object.assign(req.params, parsed.params);
            }
            
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format pesan error agar rapi dan mudah dibaca oleh Frontend
                const formattedErrors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    // Konversi key path ke string untuk menghindari masalah tipe 'symbol' di TypeScript
                    const path = err.path.slice(1).map(p => String(p)).join('.'); 
                    const firstKey = err.path[0] !== undefined ? String(err.path[0]) : 'unknown';
                    
                    formattedErrors[path || firstKey] = err.message;
                });

                res.status(400).json({
                    status: 'error',
                    message: 'Validasi input gagal!',
                    errors: formattedErrors
                });
                return;
            }

            console.error('❌ Validation middleware exception:', error);

            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan internal server saat validasi: ' + (error as any).message || String(error)
            });
        }
    };
};
