import { FiActivity, FiTrendingUp, FiClock, FiCheck } from 'react-icons/fi';

interface LeaderCandidate {
    id: number;
    no: number;
    name: string;
    image: string;
    kelas: string;
    votesCount: number;
    percentage: number;
}

interface VoteStatsCardsProps {
    turnoutRate: string;
    votesCount: number;
    totalVotersCount: number;
    leader?: LeaderCandidate;
}

export const VoteStatsCards = ({
    turnoutRate,
    votesCount,
    totalVotersCount,
    leader
}: VoteStatsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat card 1: Turnout Rate */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between text-left">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Partisipasi Pemilih</span>
                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                        <FiActivity className="size-4 text-emerald-600" />
                    </div>
                </div>
                <div className="mt-2.5">
                    <span className="text-3xl font-black text-slate-800 tracking-tight">{turnoutRate}%</span>
                    <span className="text-[10px] text-gray-400 ml-1.5">tingkat kehadiran</span>
                </div>
                <div className="mt-3">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${turnoutRate}%` }}></div>
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1.5 font-medium">
                        Sudah Memilih: <strong className="text-slate-700">{votesCount} siswa</strong> dari {totalVotersCount} daftar pemilih tetap (DPT)
                    </p>
                </div>
            </div>

            {/* Stat card 2: Frontrunner */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between text-left">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Kandidat Terunggul</span>
                    <div className="p-1.5 bg-amber-50 rounded-lg">
                        <FiTrendingUp className="size-4 text-amber-500" />
                    </div>
                </div>
                {leader ? (
                    <>
                        <div className="mt-2.5 flex items-center gap-3">
                            <img
                                src={leader.image || 'https://placehold.co/100'}
                                alt={leader.name}
                                className="w-10 h-10 rounded-full object-cover border border-amber-100 shadow-xs bg-slate-50"
                            />
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base font-black text-slate-800 leading-tight truncate">{leader.name}</h3>
                                <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold truncate">NO. URUT {leader.no} - {leader.kelas}</p>
                            </div>
                        </div>
                        <div className="mt-3 border-t border-gray-50 pt-2 flex items-center justify-between">
                            <span className="text-[10px] font-black text-emerald-600">{leader.votesCount} Suara</span>
                            <span className="text-[10px] text-gray-400 font-bold">{leader.percentage.toFixed(1)}% dari suara masuk</span>
                        </div>
                    </>
                ) : (
                    <div className="py-4 text-xs text-gray-400 font-medium">Belum ada suara masuk</div>
                )}
            </div>

            {/* Stat card 3: Ballot Integrity Verification */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between text-left">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Integritas Log Suara</span>
                    <div className="p-1.5 bg-sky-50 rounded-lg">
                        <FiClock className="size-4 text-sky-600" />
                    </div>
                </div>
                <div className="mt-2.5">
                    <span className="text-3xl font-black text-slate-800 tracking-tight">100%</span>
                    <span className="text-[10px] text-emerald-600 font-black ml-1.5 uppercase tracking-wide">Terhubung</span>
                </div>
                <div className="mt-3 bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 flex items-start gap-2">
                    <FiCheck className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-[9px] text-emerald-800 leading-normal font-medium">
                        Database aman. Setiap surat suara memiliki data waktu tersisa bilik suara yang transparan untuk mendeteksi anomali.
                    </p>
                </div>
            </div>
        </div>
    );
};
