import { User } from '../models';
import { CreateUserDTO, UpdateUserDTO } from '../validators';

export class UserService {
    // 1. Ambil semua user/pemilih
    static async getAll() {
        return await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['name', 'ASC']]
        });
    }

    // 2. Ambil user berdasarkan ID
    static async getById(id: number) {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            throw new Error('User tidak ditemukan!');
        }
        return user;
    }

    // Helper untuk generate 6-digit random passcode yang unik & anti-duplikat
    private static async generateUniqueCode(): Promise<string> {
        let code = '';
        let isUnique = false;
        
        while (!isUnique) {
            // Hasilkan angka 6-digit acak antara 100000 dan 999999
            code = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Pastikan kode belum pernah terpakai di database
            const checkCode = await User.findOne({ where: { code } });
            if (!checkCode) {
                isUnique = true;
            }
        }
        
        return code;
    }

    // 3. Tambah user baru (Siswa atau Admin)
    static async create(data: CreateUserDTO) {
        // Jika kode pemilih tidak dikirim, generate secara otomatis, acak & unik
        if (!data.code) {
            data.code = await UserService.generateUniqueCode();
        } else {
            // Cek duplikasi kode pemilih jika diisi secara manual
            const checkCode = await User.findOne({ where: { code: data.code } });
            if (checkCode) {
                throw new Error(`Kode pemilih '${data.code}' sudah digunakan oleh user lain!`);
            }
        }

        // Cek duplikasi NISN jika itu siswa
        if (data.nisn) {
            const checkNisn = await User.findOne({ where: { nisn: data.nisn } });
            if (checkNisn) {
                throw new Error(`User dengan NISN ${data.nisn} sudah terdaftar!`);
            }
        }

        return await User.create(data);
    }

    // 3b. Tambah user massal (Import Excel)
    static async batchCreate(dataList: CreateUserDTO[]) {
        if (dataList.length > 100) {
            throw new Error('Maksimal 100 data pemilih yang dapat diimpor dalam satu waktu.');
        }

        // Validasi 1: Cek NISN ganda di dalam file Excel itu sendiri
        const nisnSet = new Set();
        for (let i = 0; i < dataList.length; i++) {
            const nisn = dataList[i].nisn;
            if (nisn) {
                if (nisnSet.has(nisn)) {
                    throw new Error(`Data ditolak! Terdapat NISN ganda di dalam file Excel pada baris ke-${i + 1}: ${nisn}. Silakan perbaiki file Excel Anda.`);
                }
                nisnSet.add(nisn);
            }
        }

        // Validasi 2: Cek NISN ganda dengan data di database
        const nisnArray = Array.from(nisnSet) as string[];
        if (nisnArray.length > 0) {
            const existingUsers = await User.findAll({
                where: {
                    nisn: nisnArray
                }
            });

            if (existingUsers.length > 0) {
                const duplicateNisns = existingUsers.map((u: any) => u.nisn).join(', ');
                throw new Error(`Data ditolak! Terdapat NISN yang sudah terdaftar di database: ${duplicateNisns}.`);
            }
        }

        // Jika lolos validasi, lakukan insert
        const createdUsers = [];
        const errors = [];
        for (let i = 0; i < dataList.length; i++) {
            try {
                // Gunakan fungsi create yang sudah ada (termasuk generate passcode)
                const user = await UserService.create(dataList[i]);
                createdUsers.push(user);
            } catch (err: any) {
                errors.push(`Baris ${i + 1} (${dataList[i].name || 'Tanpa Nama'}): ${err.message}`);
            }
        }
        return { createdUsers, errors };
    }

    // 4. Update data user
    static async update(id: number, data: UpdateUserDTO) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User tidak ditemukan!');
        }

        // Jika kode pemilih diubah, cek duplikat
        if (data.code !== undefined && data.code !== user.code) {
            const checkCode = await User.findOne({ where: { code: data.code } });
            if (checkCode) {
                throw new Error(`Kode pemilih '${data.code}' sudah digunakan oleh user lain!`);
            }
        }

        // Jika NISN diubah, cek duplikat
        if (data.nisn !== undefined && data.nisn !== user.nisn) {
            const checkNisn = await User.findOne({ where: { nisn: data.nisn } });
            if (checkNisn) {
                throw new Error(`User dengan NISN ${data.nisn} sudah terdaftar!`);
            }
        }

        await user.update(data);
        return user;
    }

    // 5. Hapus user
    static async delete(id: number) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User tidak ditemukan!');
        }
        await user.destroy();
        return true;
    }
}
