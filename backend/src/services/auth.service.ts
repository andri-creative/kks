import { User } from '../models';
import { generateToken } from '../helpers/jwt.helper';

export class AuthService {
    // Login menggunakan kode unik (passcode)
    static async login(code: string) {
        if (!code) {
            throw new Error('Kode pemilih wajib diisi!');
        }

        // Cari user berdasarkan kode unik
        const user = await User.findOne({ where: { code } });
        if (!user) {
            throw new Error('Kode pemilih salah atau tidak terdaftar!');
        }

        if (user.status !== 'Active') {
            throw new Error('Akun Anda dinonaktifkan! Silakan hubungi admin.');
        }

        // Enforce voting status checks for Siswa role
        if (user.roles === 'Siswa') {
            if (user.voting_status === 'sudah_memilih') {
                throw new Error('Akses ditolak! Anda sudah menyalurkan hak pilih Anda.');
            }
            if (user.voting_status === 'waktu_habis') {
                throw new Error('Akses ditolak! Batas waktu sesi memilih Anda (5 menit) telah habis.');
            }
        }

        // Generate JWT Token
        const token = generateToken({
            id: user.id,
            roles: user.roles
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                nisn: user.nisn,
                kelas: user.kelas,
                roles: user.roles,
                status: user.status
            },
            token
        };
    }
}
