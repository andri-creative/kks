import { FiCheckSquare, FiSearch, FiFilter, FiUser, FiChevronLeft, FiChevronRight, FiInfo } from 'react-icons/fi';
import { type BackendVoteLog } from '../../vote/api/voteApi';

const formatDuration = (seconds: number) => {
    if (seconds <= 0) return '0 Detik';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0 && s > 0) return `${m} Menit ${s} Detik`;
    if (m > 0) return `${m} Menit`;
    return `${s} Detik`;
};

interface CandidateListItem { id: number; name: string; }

interface VoteAuditTableProps {
    logs: BackendVoteLog[];
    votesCount: number;
    classesList: string[];
    candidatesList: CandidateListItem[];
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    classFilter: string;
    setClassFilter: (val: string) => void;
    candidateFilter: string;
    setCandidateFilter: (val: string) => void;
    paginatedVotes: BackendVoteLog[];
    filteredVotes: BackendVoteLog[];
    currentPage: number;
    setCurrentPage: (val: number | ((prev: number) => number)) => void;
    itemsPerPage: number;
    setItemsPerPage: (val: number) => void;
}

export const VoteAuditTable = ({
    votesCount,
    classesList,
    candidatesList,
    searchTerm,
    setSearchTerm,
    classFilter,
    setClassFilter,
    candidateFilter,
    setCandidateFilter,
    paginatedVotes,
    filteredVotes,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage
}: VoteAuditTableProps) => {
    const totalPages = Math.ceil(filteredVotes.length / itemsPerPage);

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 text-left">
            <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-3 mb-5 flex items-center gap-1.5">
                <FiCheckSquare className="size-4 text-emerald-600" />
                Buku Catatan Pemungutan Suara (Audit Trail)
            </h2>

            {/* Filter & Search Bar Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-2 relative">
                    <FiSearch className="absolute left-3.5 top-3 text-gray-400 size-4" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Cari nama pemilih atau NISN..."
                        className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                    />
                </div>
                <div className="relative">
                    <FiFilter className="absolute left-3.5 top-3 text-gray-400 size-4 pointer-events-none" />
                    <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
                        className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all appearance-none cursor-pointer">
                        <option value="">Semua Kelas</option>
                        {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                </div>
                <div className="relative">
                    <FiUser className="absolute left-3.5 top-3 text-gray-400 size-4 pointer-events-none" />
                    <select value={candidateFilter} onChange={e => setCandidateFilter(e.target.value)}
                        className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all appearance-none cursor-pointer">
                        <option value="">Semua Pilihan</option>
                        {candidatesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-gray-100">
                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">No</th>
                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Pemilih (Voter)</th>
                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Kelas</th>
                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Kandidat Pilihan</th>
                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Waktu Mencoblos</th>
                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                        {paginatedVotes.length > 0 ? (
                            paginatedVotes.map((v, index) => {
                                const secondsTaken = v.time_remaining ?? 0;
                                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                                return (
                                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3.5 font-mono text-[11px] text-gray-500 font-bold">{rowNumber}</td>
                                        <td className="px-4 py-3.5">
                                            <p className="font-black text-slate-800 leading-tight">{v.user?.name || 'Siswa Dihapus'}</p>
                                            <p className="text-[9px] text-gray-400 mt-0.5 font-mono">NISN: {v.user?.nisn || '-'}</p>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-500 font-semibold">{v.user?.kelas || '-'}</td>
                                        <td className="px-4 py-3.5">
                                            {v.candidate ? (
                                                <div className="flex items-center gap-2">
                                                    <img src={v.candidate.image || 'https://placehold.co/100'} alt={v.candidate.name}
                                                        className="w-6 h-6 rounded-full object-cover border border-gray-200 bg-white" />
                                                    <span className="font-black text-slate-700">[{v.candidate.no}] {v.candidate.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 font-medium italic">Kandidat Terhapus</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-700 font-mono text-[10px] font-bold">{formatDuration(secondsTaken)}</td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                                                SAH
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-400 font-medium bg-slate-50/30">
                                    Tidak ada data log pencoblosan yang sesuai dengan filter pencarian.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredVotes.length > 10 && (
                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                        <span>Tampilkan</span>
                        <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-text-green bg-white cursor-pointer font-black text-slate-700 shadow-xs">
                            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <span>data per halaman</span>
                    </div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        Menampilkan <strong className="text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong className="text-slate-700">{Math.min(currentPage * itemsPerPage, filteredVotes.length)}</strong> dari <strong className="text-slate-700">{filteredVotes.length}</strong> data
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button type="button" disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 transition-all cursor-pointer hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs">
                            <FiChevronLeft className="size-3.5" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} type="button" onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1.5 text-xs font-black rounded-lg border transition-all cursor-pointer shadow-xs ${currentPage === page ? 'bg-text-green text-white border-text-green' : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'}`}>
                                {page}
                            </button>
                        ))}
                        <button type="button" disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 transition-all cursor-pointer hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs">
                            <FiChevronRight className="size-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-gray-400 font-medium">
                <p>Total suara terdaftar di sistem: <strong className="text-slate-600">{votesCount} log surat suara</strong></p>
                <div className="flex items-center gap-1">
                    <FiInfo className="size-3.5 text-emerald-600" />
                    <span>Audit Trail ini dirancang agar data suara masuk tetap anonim secara publik namun dapat diaudit oleh admin demi integritas pemilu.</span>
                </div>
            </div>
        </div>
    );
};
