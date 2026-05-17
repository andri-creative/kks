import { Candidates } from '../models';
import { CreateCandidateDTO, UpdateCandidateDTO } from '../validators';

export class CandidateService {
    static async getAll() {
        return await Candidates.findAll({
            order: [['no', 'ASC']]
        });
    }

    // 2. Ambil detail kandidat berdasarkan ID
    static async getById(id: number) {
        const candidate = await Candidates.findByPk(id);
        if (!candidate) {
            throw new Error('Kandidat tidak ditemukan!');
        }
        return candidate;
    }

    // 3. Tambah kandidat baru
    static async create(data: CreateCandidateDTO) {
        // Cek apakah nomor urut sudah digunakan
        const checkNo = await Candidates.findOne({ where: { no: data.no } });
        if (checkNo) {
            throw new Error(`Nomor urut ${data.no} sudah digunakan oleh kandidat lain!`);
        }

        // Cek apakah NISN sudah digunakan
        const checkNisn = await Candidates.findOne({ where: { nisn: data.nisn } });
        if (checkNisn) {
            throw new Error(`Kandidat dengan NISN ${data.nisn} sudah terdaftar!`);
        }

        return await Candidates.create(data);
    }

    // 4. Update data kandidat
    static async update(id: number, data: UpdateCandidateDTO) {
        const candidate = await Candidates.findByPk(id);
        if (!candidate) {
            throw new Error('Kandidat tidak ditemukan!');
        }

        // Jika nomor urut diubah, cek duplikat
        if (data.no !== undefined && data.no !== candidate.no) {
            const checkNo = await Candidates.findOne({ where: { no: data.no } });
            if (checkNo) {
                throw new Error(`Nomor urut ${data.no} sudah digunakan oleh kandidat lain!`);
            }
        }

        // Jika NISN diubah, cek duplikat
        if (data.nisn !== undefined && data.nisn !== candidate.nisn) {
            const checkNisn = await Candidates.findOne({ where: { nisn: data.nisn } });
            if (checkNisn) {
                throw new Error(`Kandidat dengan NISN ${data.nisn} sudah terdaftar!`);
            }
        }

        await candidate.update(data);
        return candidate;
    }

    // 5. Hapus kandidat
    static async delete(id: number) {
        const candidate = await Candidates.findByPk(id);
        if (!candidate) {
            throw new Error('Kandidat tidak ditemukan!');
        }
        await candidate.destroy();
        return true;
    }
}
