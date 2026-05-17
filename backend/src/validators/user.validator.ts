import { z } from 'zod';

// Schema untuk validasi Pembuatan User Baru
export const createUserSchema = z.object({
    body: z.object({
        name: z.string({
            message: 'Nama lengkap wajib diisi!'
        })
        .min(3, 'Nama harus minimal 3 karakter!')
        .max(100, 'Nama maksimal 100 karakter!'),
        
        nisn: z.string()
        .length(10, 'NISN harus tepat 10 digit!')
        .nullable()
        .optional(),
        
        kelas: z.string()
        .max(50, 'Nama kelas terlalu panjang (maksimal 50 karakter)!')
        .nullable()
        .optional(),
        
        code: z.string()
        .min(4, 'Kode pemilih minimal 4 karakter!')
        .max(50, 'Kode pemilih maksimal 50 karakter!')
        .nullable()
        .optional(),
        
        status: z.enum(['Active', 'Inactive']).default('Active').optional(),
        roles: z.enum(['Admin', 'Siswa']).default('Siswa').optional(),
    })
});

// Schema untuk validasi Pembaruan Data User
export const updateUserSchema = z.object({
    body: z.object({
        name: z.string()
        .min(3, 'Nama harus minimal 3 karakter!')
        .max(100)
        .optional(),
        
        nisn: z.string()
        .length(10, 'NISN harus tepat 10 digit!')
        .nullable()
        .optional(),
        
        kelas: z.string()
        .max(50)
        .nullable()
        .optional(),
        
        code: z.string()
        .min(4)
        .max(50)
        .nullable()
        .optional(),
        
        status: z.enum(['Active', 'Inactive']).optional(),
        roles: z.enum(['Admin', 'Siswa']).optional(),
    })
});

// 📦 EXPORT TYPES (Inferred DTO Types dari Zod)
export type CreateUserDTO = z.infer<typeof createUserSchema>['body'];
export type UpdateUserDTO = z.infer<typeof updateUserSchema>['body'];
