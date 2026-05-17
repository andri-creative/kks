import { z } from 'zod';

// Schema untuk validasi Pembuatan Kandidat Baru
export const createCandidateSchema = z.object({
    body: z.object({
        no: z.number({
            message: 'Nomor urut kandidat wajib diisi!'
        })
        .int('Nomor urut harus berupa angka bulat!')
        .positive('Nomor urut harus bernilai positif (lebih besar dari 0)!'),
        
        image: z.string({
            message: 'URL Foto kandidat wajib diisi!'
        })
        .url('Format URL foto kandidat tidak valid!'),
        
        name: z.string({
            message: 'Nama kandidat wajib diisi!'
        })
        .min(3, 'Nama kandidat minimal 3 karakter!')
        .max(100, 'Nama kandidat maksimal 100 karakter!'),
        
        nisn: z.string({
            message: 'NISN kandidat wajib diisi!'
        })
        .length(10, 'NISN harus tepat 10 digit!'),
        
        kelas: z.string({
            message: 'Kelas kandidat wajib diisi!'
        })
        .max(50, 'Nama kelas terlalu panjang!'),
        
        status: z.enum(['Active', 'Inactive']).default('Active').optional(),
        
        misi: z.string({
            message: 'Misi kandidat wajib diisi!'
        })
        .min(5, 'Misi kandidat terlalu pendek!'),
        
        visi: z.string({
            message: 'Visi kandidat wajib diisi!'
        })
        .min(5, 'Visi kandidat terlalu pendek!'),
    })
});

// Schema untuk validasi Pembaruan Data Kandidat
export const updateCandidateSchema = z.object({
    body: z.object({
        no: z.number().int().positive().optional(),
        image: z.string().url().optional(),
        name: z.string().min(3).max(100).optional(),
        nisn: z.string().length(10).optional(),
        kelas: z.string().max(50).optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
        misi: z.string().optional(),
        visi: z.string().optional(),
    })
});

// 📦 EXPORT TYPES (Inferred DTO Types dari Zod)
export type CreateCandidateDTO = z.infer<typeof createCandidateSchema>['body'];
export type UpdateCandidateDTO = z.infer<typeof updateCandidateSchema>['body'];
