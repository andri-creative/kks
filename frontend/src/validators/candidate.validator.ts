import { z } from 'zod';

export const candidateSchema = z.object({
    name: z.string()
        .min(3, 'Nama harus minimal 3 karakter!')
        .max(100, 'Nama maksimal 100 karakter!'),
    nisn: z.string()
        .length(10, 'NISN harus tepat 10 digit!'),
    kelas: z.string()
        .min(1, 'Kelas wajib diisi!')
        .max(50, 'Nama kelas terlalu panjang!'),
    visi: z.string()
        .min(5, 'Visi minimal 5 karakter!'),
    misi: z.string()
        .min(5, 'Misi minimal 5 karakter!'),
    image: z.string()
        .min(1, 'Foto kandidat wajib diunggah!'),
});

export type CandidateFormInput = z.infer<typeof candidateSchema>;
