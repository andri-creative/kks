import { FiTrendingUp } from 'react-icons/fi';

interface CandidateStanding {
    id: number;
    no: number;
    name: string;
    image: string;
    kelas: string;
    votesCount: number;
    percentage: number;
}

interface CandidateStandingsProps {
    standings: CandidateStanding[];
}

export const CandidateStandings = ({ standings }: CandidateStandingsProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-5 text-left">
            <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-2.5 mb-4 flex items-center gap-1.5">
                <FiTrendingUp className="size-4 text-emerald-600 animate-pulse" />
                Perolehan Suara Kandidat Secara Real-Time
            </h2>

            {standings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                    {standings.map((c, index) => (
                        <div key={c.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                            <span className="text-xs font-black text-gray-400 w-5">#{index + 1}</span>
                            <img
                                src={c.image || 'https://placehold.co/100'}
                                alt={c.name}
                                className="w-9 h-9 rounded-full object-cover border border-gray-200 p-0.5 shadow-xs bg-white"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-xs font-black text-slate-800 truncate">[{c.no}] {c.name}</h4>
                                    <span className="text-xs font-black text-slate-700">{c.votesCount} Suara ({c.percentage.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-emerald-400' : 'bg-emerald-300'
                                        }`}
                                        style={{ width: `${c.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-gray-400 font-medium py-3">Tidak ada data kandidat aktif ditemukan.</p>
            )}
        </div>
    );
};
