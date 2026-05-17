import { FiClock, FiArrowRight } from 'react-icons/fi';
import { Link } from '@tanstack/react-router';

interface VoteRecord {
    id: string;
    voterName: string;
    voterNisn: string;
    voterKelas: string;
    candidateName: string;
    candidateImage: string;
    timestamp: string;
}

interface RecentVotesTableProps {
    recentVotes: VoteRecord[];
}

export default function RecentVotesTable({ recentVotes }: RecentVotesTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 text-left">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <h2 className="text-xs font-black text-text-green uppercase tracking-wider flex items-center gap-1.5">
                    <FiClock className="size-4 text-emerald-600" />
                    Coblosan Terbaru Masuk
                </h2>
                
                <Link
                    to="/votes"
                    className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 uppercase tracking-wider"
                >
                    Lihat Semua Log
                    <FiArrowRight className="size-3" />
                </Link>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-gray-100">
                            <th className="px-4 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-wider">Ballot ID</th>
                            <th className="px-4 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-wider">Pemilih</th>
                            <th className="px-4 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-wider">Kelas</th>
                            <th className="px-4 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-wider">Pilihan</th>
                            <th className="px-4 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-wider">Waktu Coblos</th>
                            <th className="px-4 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-wider text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                        {recentVotes.map(v => (
                            <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-2.5 font-mono text-[9px] text-gray-500 font-bold">{v.id}</td>
                                <td className="px-4 py-2.5 font-black text-slate-800">{v.voterName}</td>
                                <td className="px-4 py-2.5 text-gray-500 font-semibold">{v.voterKelas}</td>
                                <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <img 
                                            src={v.candidateImage} 
                                            alt={v.candidateName} 
                                            className="w-5 h-5 rounded-full object-cover border border-gray-200"
                                        />
                                        <span className="font-black text-slate-700">{v.candidateName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 text-gray-400 font-medium">{v.timestamp}</td>
                                <td className="px-4 py-2.5 text-center">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Sah
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
