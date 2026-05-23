import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string()
        .min(3, 'Nama harus minimal 3 karakter!')
        .max(100, 'Nama maksimal 100 karakter!'),
    nisn: z.string()
        .length(10, 'NISN harus tepat 10 digit!'),
    kelas: z.string()
        .min(1, 'Kelas wajib diisi!')
        .max(50, 'Nama kelas terlalu panjang!'),
});

export type CreateUserFormInput = z.infer<typeof createUserSchema>;
