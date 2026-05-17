import { 
    FiUsers, 
    FiCheckCircle, 
    FiXCircle, 
    FiUserPlus 
} from 'react-icons/fi';

interface KpiStatsProps {
    totalVoters: number;
    votedCount: number;
    notVotedCount: number;
    turnoutRate: number;
    remainingRate: number;
    activeCandidatesCount: number;
}

export default function KpiStats({
    totalVoters,
    votedCount,
    notVotedCount,
    turnoutRate,
    remainingRate,
    activeCandidatesCount
}: KpiStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* KPI Card 1: Total Voters (DPT) */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between text-left">
                <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total DPT</span>
                    <h3 className="text-3xl font-black text-slate-800 mt-1">{totalVoters}</h3>
                    <p className="text-[9px] text-gray-400 mt-1.5 font-semibold">Siswa terdaftar</p>
                </div>
                <div className="p-3 bg-sky-50 rounded-xl">
                    <FiUsers className="size-6 text-sky-600" />
                </div>
            </div>

            {/* KPI Card 2: Voted Turnout */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between text-left">
                <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Sudah Memilih</span>
                    <h3 className="text-3xl font-black text-emerald-600 mt-1">{votedCount}</h3>
                    <p className="text-[9px] text-emerald-600 mt-1.5 font-bold uppercase tracking-wider">{turnoutRate.toFixed(1)}% Turnout</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                    <FiCheckCircle className="size-6 text-emerald-600" />
                </div>
            </div>

            {/* KPI Card 3: Belum Memilih */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between text-left">
                <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Belum Memilih</span>
                    <h3 className="text-3xl font-black text-amber-500 mt-1">{notVotedCount}</h3>
                    <p className="text-[9px] text-amber-500 mt-1.5 font-bold uppercase tracking-wider">{remainingRate.toFixed(1)}% Abstain</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                    <FiXCircle className="size-6 text-amber-500" />
                </div>
            </div>

            {/* KPI Card 4: Candidates Count */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between text-left">
                <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Kandidat</span>
                    <h3 className="text-3xl font-black text-indigo-600 mt-1">{activeCandidatesCount}</h3>
                    <p className="text-[9px] text-indigo-600 mt-1.5 font-semibold">Aktif di bilik suara</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl">
                    <FiUserPlus className="size-6 text-indigo-600" />
                </div>
            </div>
        </div>
    );
}
