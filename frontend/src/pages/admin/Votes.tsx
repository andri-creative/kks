import { useState, useMemo, useEffect } from 'react';
import { useVoteLogs } from '../../features/vote/hooks/useVoteLogs';
import {
    FiCheckSquare,
    FiDownload,
    FiCheck,
    FiRefreshCw
} from 'react-icons/fi';

import { Link } from '@tanstack/react-router';
import { VoteStatsCards } from '../../features/resultVote/components/VoteStatsCards';
import { CandidateStandings } from '../../features/resultVote/components/CandidateStandings';
import { VoteAuditTable } from '../../features/resultVote/components/VoteAuditTable';

export default function Votes() {
    const { logs, stats, isLoading, refreshLogs } = useVoteLogs();

    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [candidateFilter, setCandidateFilter] = useState('');
    const [toast, setToast] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // List of unique classes present in logs data
    const classesList = useMemo(() => {
        const classes = logs.map(l => l.user?.kelas).filter(Boolean);
        return Array.from(new Set(classes)).sort();
    }, [logs]);

    // Unique list of candidates present in logs or statistics
    const candidatesList = useMemo(() => {
        if (stats?.candidates) {
            return stats.candidates.map(c => ({ id: c.id, name: c.name }));
        }
        const candidates = logs.map(l => l.candidate).filter(Boolean);
        const unique = Array.from(new Set(candidates.map(c => c.id))).map(id => {
            const match = candidates.find(c => c.id === id);
            return { id, name: match?.name || `Kandidat #${id}` };
        });
        return unique;
    }, [logs, stats]);

    // Dismiss toast helper
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Stats calculations from MySQL server
    const totalVotersCount = stats?.summary.totalRegisteredSiswa || 0;
    const votesCount = stats?.summary.totalVotesCast || 0;
    const turnoutRate = stats?.summary.participationPercentage !== undefined
        ? stats.summary.participationPercentage.toFixed(1)
        : '0.0';

    // Candidate standings
    const standings = useMemo(() => {
        if (stats?.candidates) {
            return stats.candidates;
        }
        return [];
    }, [stats]);

    // Leading candidate details
    const leader = standings[0];

    // Filter and search logic
    const filteredVotes = useMemo(() => {
        return logs.filter(v => {
            const voterName = v.user?.name || '';
            const voterNisn = v.user?.nisn || '';
            const voterKelas = v.user?.kelas || '';
            const candidateId = v.candidate_id;

            const matchesSearch = voterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voterNisn.includes(searchTerm);
            const matchesClass = classFilter === '' || voterKelas === classFilter;
            const matchesCandidate = candidateFilter === '' || candidateId === Number(candidateFilter);
            return matchesSearch && matchesClass && matchesCandidate;
        });
    }, [logs, searchTerm, classFilter, candidateFilter]);

    // Reset current page to 1 when filters or search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, classFilter, candidateFilter]);

    // Compute paginated subset of votes
    const paginatedVotes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredVotes.slice(startIndex, endIndex);
    }, [filteredVotes, currentPage, itemsPerPage]);


    return (
        <div className="flex flex-col h-full bg-slate-50/30 overflow-y-auto pb-10">
            {/* Dynamic Toast Notification */}
            {toast && (
                <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border border-emerald-100 bg-emerald-50 text-emerald-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <FiCheck className="size-4 text-emerald-600" />
                    <span className="text-xs font-black tracking-tight">{toast}</span>
                </div>
            )}

            {/* Sticky Header Section */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-1 pb-4 border-b border-gray-100 px-6">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl text-text-green font-black tracking-tight flex items-center gap-2">
                            <FiCheckSquare className="size-6 text-emerald-600 animate-pulse" />
                            Log Audit & Data Voting
                        </h1>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Buku rekapitulasi suara riil langsung dari database dengan sisa waktu pengerjaan bilik suara
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                refreshLogs();
                                setToast('Data voting berhasil diperbarui secara real-time!');
                            }}
                            className="px-3.5 py-2.5 text-xs font-black text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-gray-200 rounded-lg shadow-sm transition-all cursor-pointer uppercase tracking-wider inline-flex items-center gap-1.5 active:scale-95 mr-2"
                        >
                            <FiRefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                            Segarkan Data
                        </button>

                        <Link
                            to="/votes/laporan"
                            className="px-3.5 py-2.5 text-xs font-black text-white bg-text-green hover:bg-text-green/90 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer uppercase tracking-wider inline-flex items-center gap-1.5 active:scale-95"
                        >
                            <FiDownload className="size-3.5" />
                            Cetak Laporan
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="px-6 pt-6 max-w-[1600px] mx-auto w-full space-y-6">

                {isLoading ? (
                    /* Premium loading skeletons */
                    <div className="space-y-6 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-28 bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
                                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-8 bg-slate-100 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                        <div className="h-64 bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
                            <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-slate-100 rounded"></div>
                                <div className="h-8 bg-slate-100 rounded"></div>
                                <div className="h-8 bg-slate-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 1. Dashboard Quick Statistics Row */}
                        <VoteStatsCards
                            turnoutRate={turnoutRate}
                            votesCount={votesCount}
                            totalVotersCount={totalVotersCount}
                            leader={leader}
                        />

                        {/* 2. Candidate Live Standings Progress Panel */}
                        <CandidateStandings standings={standings} />

                        {/* 3. Ballot Trail Table & Filters */}
                        <VoteAuditTable
                            logs={logs}
                            votesCount={votesCount}
                            classesList={classesList}
                            candidatesList={candidatesList}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            classFilter={classFilter}
                            setClassFilter={setClassFilter}
                            candidateFilter={candidateFilter}
                            setCandidateFilter={setCandidateFilter}
                            paginatedVotes={paginatedVotes}
                            filteredVotes={filteredVotes}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
