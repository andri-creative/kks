import { Votes, Candidates, User } from '../models';

export class VoteService {
    // 1. Melakukan Voting (Pilih Kandidat)
    static async castVote(userId: number, candidateId: number) {
        // Cek apakah kandidat yang dipilih benar-benar ada
        const candidate = await Candidates.findByPk(candidateId);
        if (!candidate) {
            throw new Error('Kandidat pilihan Anda tidak ditemukan!');
        }
        if (candidate.status !== 'Active') {
            throw new Error('Kandidat pilihan Anda sedang berstatus tidak aktif!');
        }

        // Cek apakah siswa ini sudah pernah melakukan voting sebelumnya
        const existingVote = await Votes.findOne({ where: { user_id: userId } });
        if (existingVote) {
            throw new Error('Akses ditolak! Anda hanya diperbolehkan melakukan voting sebanyak 1 kali.');
        }

        // Simpan suara pemilih
        const vote = await Votes.create({
            user_id: userId,
            candidate_id: candidateId
        });

        // 🔒 UPDATE STATUS PEMILIH: Ubah status menjadi 'Inactive' agar tidak bisa login lagi setelah memilih
        const user = await User.findByPk(userId);
        if (user) {
            await user.update({ status: 'Inactive' });
            console.log(`🔒 Sesi ditutup. Status user '${user.name}' (ID: ${userId}) diubah menjadi Inactive.`);
        }

        return vote;
    }

    // 2. Mengambil Statistik Hasil Voting Real-Time
    static async getStatistics() {
        // Hitung total suara masuk
        const totalVotesCast = await Votes.count();
        
        // Hitung total siswa (pemilih terdaftar)
        const totalRegisteredSiswa = await User.count({ where: { roles: 'Siswa' } });
        
        // Ambil semua kandidat lengkap dengan relasi votes mereka untuk dihitung jumlah suaranya
        const candidates = await Candidates.findAll({
            include: [{ 
                model: Votes, 
                as: 'votes',
                attributes: ['id'] // Hanya ambil ID untuk performa memori
            }],
            order: [['no', 'ASC']]
        });

        // Map data statistik setiap kandidat
        const candidatesStats = candidates.map((candidate: any) => {
            const votesCount = candidate.votes ? candidate.votes.length : 0;
            const percentage = totalVotesCast > 0 ? (votesCount / totalVotesCast) * 100 : 0;

            return {
                id: candidate.id,
                no: candidate.no,
                name: candidate.name,
                image: candidate.image,
                kelas: candidate.kelas,
                votesCount,
                percentage: parseFloat(percentage.toFixed(2)) // Format desimal: 2 digit
            };
        });

        return {
            summary: {
                totalRegisteredSiswa,
                totalVotesCast,
                participationPercentage: totalRegisteredSiswa > 0 
                    ? parseFloat(((totalVotesCast / totalRegisteredSiswa) * 100).toFixed(2)) 
                    : 0,
                abstainCount: Math.max(0, totalRegisteredSiswa - totalVotesCast)
            },
            candidates: candidatesStats
        };
    }
}
