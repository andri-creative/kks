import { z } from 'zod';

// Schema untuk validasi Pembuatan Suara (Vote) Baru
export const createVoteSchema = z.object({
    body: z.object({
        user_id: z.number({
            message: 'User ID pemilih wajib diisi!'
        })
        .int('User ID harus berupa angka bulat!')
        .positive('User ID tidak valid!'),
        
        candidate_id: z.number({
            message: 'ID Kandidat pilihan wajib diisi!'
        })
        .int('ID Kandidat harus berupa angka bulat!')
        .positive('ID Kandidat tidak valid!'),
    })
});

// 📦 EXPORT TYPES (Inferred DTO Types dari Zod)
export type CreateVoteDTO = z.infer<typeof createVoteSchema>['body'];
