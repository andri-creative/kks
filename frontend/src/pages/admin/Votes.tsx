import { useState, useMemo, useEffect } from 'react';
import { candidates, countUsers } from '../../data/User';
import { 
    FiCheckSquare, 
    FiSearch, 
    FiFilter, 
    FiDownload, 
    FiTrendingUp, 
    FiClock, 
    FiCheck,
    FiUser,
    FiInfo,
    FiChevronLeft,
    FiChevronRight,
    FiActivity
} from 'react-icons/fi';

// Structure of Vote Record
interface VoteRecord {
    id: string;
    voterId: number;
    voterName: string;
    voterNisn: string;
    voterKelas: string;
    candidateId: number;
    candidateName: string;
    candidateImage: string;
    timestamp: string;
    ipAddress: string;
    token: string;
    status: 'valid' | 'invalid';
}

export default function Votes() {
    // Generate initial dummy votes dynamically using countUsers and candidates data
    const [votes, setVotes] = useState<VoteRecord[]>(() => {
        const initialVotes: VoteRecord[] = [];
        
        // Seed first 35 students with deterministic votes for realistic distribution
        // Candidate IDs in User.ts range from 1 to 6
        const activeCandidates = candidates.filter(c => c.status === 'active');
        
        for (let i = 0; i < 38; i++) {
            const student = countUsers[i];
            if (!student || student.role === 'admin') continue;
            
            // Map index to a candidate deterministically
            const candidateIndex = i % activeCandidates.length;
            const chosenCandidate = activeCandidates[candidateIndex];
            
            // Generate timestamp (between 08:00 AM and 11:30 AM today)
            const hour = 8 + Math.floor(i / 12);
            const minute = (i * 7) % 60;
            const second = (i * 13) % 60;
            const timestampString = `17 Mei 2026, ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
            
            // Bilik suara simulated IPs
            const bilikId = (i % 3) + 1;
            const ipAddress = `192.168.10.10${bilikId}`;
            
            // Simulated cryptographic signature token
            const token = `SHA256:VOTE_${student.nisn}_${chosenCandidate.id}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

            initialVotes.push({
                id: `BALLOT-2026-${String(1000 + i).substring(1)}`,
                voterId: student.id,
                voterName: student.name,
                voterNisn: student.nisn,
                voterKelas: student.kelas,
                candidateId: chosenCandidate.id,
                candidateName: chosenCandidate.name,
                candidateImage: chosenCandidate.image,
                timestamp: timestampString,
                ipAddress,
                token,
                status: 'valid'
            });
        }
        return initialVotes;
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [candidateFilter, setCandidateFilter] = useState('');
    const [toast, setToast] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // List of unique classes present in students data
    const classesList = useMemo(() => {
        const classes = countUsers
            .filter(u => u.role === 'siswa')
            .map(u => u.kelas);
        return Array.from(new Set(classes)).sort();
    }, []);

    // Dismiss toast helper
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Turnout and stats computation
    const totalVotersCount = countUsers.filter(u => u.role === 'siswa').length;
    const votesCount = votes.length;
    const turnoutRate = totalVotersCount > 0 ? ((votesCount / totalVotersCount) * 100).toFixed(1) : '0';

    // Candidate standings computation
    const standings = useMemo(() => {
        const counts: Record<number, number> = {};
        
        // Initialize active candidates
        candidates.forEach(c => {
            counts[c.id] = 0;
        });

        // Count votes
        votes.forEach(v => {
            if (counts[v.candidateId] !== undefined) {
                counts[v.candidateId]++;
            }
        });

        return candidates
            .map(c => ({
                id: c.id,
                name: c.name,
                image: c.image,
                kelas: c.kelas,
                votes: counts[c.id] || 0,
                percent: votesCount > 0 ? (((counts[c.id] || 0) / votesCount) * 100).toFixed(1) : '0'
            }))
            .sort((a, b) => b.votes - a.votes);
    }, [votes, votesCount]);

    // Leading candidate details
    const leader = standings[0];

    // Filter and search logic
    const filteredVotes = useMemo(() => {
        return votes.filter(v => {
            const matchesSearch = v.voterName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  v.voterNisn.includes(searchTerm);
            const matchesClass = classFilter === '' || v.voterKelas === classFilter;
            const matchesCandidate = candidateFilter === '' || v.candidateId === Number(candidateFilter);
            return matchesSearch && matchesClass && matchesCandidate;
        });
    }, [votes, searchTerm, classFilter, candidateFilter]);

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

    // Download mock audit report
    const handleDownloadReport = () => {
        setToast('Laporan audit rekapitulasi suara PDF berhasil diunduh ke komputer Anda!');
    };

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
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl text-text-green font-black tracking-tight flex items-center gap-2">
                            <FiCheckSquare className="size-6 text-emerald-600" />
                            Log Audit & Data Voting
                        </h1>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Buku rekapitulasi suara masuk (Relasi Pemilih & Kandidat) untuk transparansi tinggi
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleDownloadReport}
                            className="px-3.5 py-2.5 text-xs font-black text-white bg-text-green hover:bg-text-green/90 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer uppercase tracking-wider inline-flex items-center gap-1.5 active:scale-95"
                        >
                            <FiDownload className="size-3.5" />
                            Unduh Laporan
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="px-6 pt-6 max-w-7xl mx-auto w-full space-y-6">
                
                {/* 1. Dashboard Quick Statistics Row */}
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
                        <div className="mt-2.5 flex items-center gap-3">
                            <img 
                                src={leader?.image || 'https://placehold.co/100'} 
                                alt={leader?.name} 
                                className="w-10 h-10 rounded-full object-cover border border-amber-100 shadow-xs"
                            />
                            <div>
                                <h3 className="text-lg font-black text-slate-800 leading-tight">{leader?.name}</h3>
                                <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">{leader?.kelas}</p>
                            </div>
                        </div>
                        <div className="mt-3 border-t border-gray-50 pt-2 flex items-center justify-between">
                            <span className="text-[10px] font-black text-emerald-600">{leader?.votes} Suara</span>
                            <span className="text-[10px] text-gray-400 font-bold">{leader?.percent}% dari suara masuk</span>
                        </div>
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
                            <span className="text-[10px] text-emerald-600 font-black ml-1.5 uppercase tracking-wide">Terverifikasi</span>
                        </div>
                        <div className="mt-3 bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 flex items-start gap-2">
                            <FiCheck className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <p className="text-[9px] text-emerald-800 leading-normal font-medium">
                                Seluruh surat suara yang masuk ditandatangani secara kriptografis menggunakan kode token unik siswa agar tidak dapat dimanipulasi.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Candidate Live Standings Progress Panel */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-md p-5 text-left">
                    <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-2.5 mb-4 flex items-center gap-1.5">
                        <FiTrendingUp className="size-4 text-emerald-600" />
                        Perolehan Suara Kandidat Secara Real-Time
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                        {standings.map((c, index) => (
                            <div key={c.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                                {/* Rank */}
                                <span className="text-xs font-black text-gray-400 w-5">#{index + 1}</span>
                                
                                {/* Image */}
                                <img 
                                    src={c.image} 
                                    alt={c.name} 
                                    className="w-9 h-9 rounded-full object-cover border border-gray-200 p-0.5 shadow-xs bg-white"
                                />

                                {/* Name & Progress bar */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-xs font-black text-slate-800 truncate">{c.name}</h4>
                                        <span className="text-xs font-black text-slate-700">{c.votes} Suara ({c.percent}%)</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                index === 0 
                                                    ? 'bg-emerald-500' 
                                                    : index === 1 
                                                        ? 'bg-emerald-400' 
                                                        : 'bg-emerald-300'
                                            }`} 
                                            style={{ width: `${c.percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Ballot Trail Table & Filters */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 text-left">
                    <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-3 mb-5 flex items-center gap-1.5">
                        <FiCheckSquare className="size-4 text-emerald-600" />
                        Buku Catatan Pemungutan Suara (Audit Trail)
                    </h2>

                    {/* Filter & Search Bar Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* Search Input */}
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

                        {/* Filter Class */}
                        <div className="relative">
                            <FiFilter className="absolute left-3.5 top-3 text-gray-400 size-4 pointer-events-none" />
                            <select
                                value={classFilter}
                                onChange={e => setClassFilter(e.target.value)}
                                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Semua Kelas</option>
                                {classesList.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Selected Candidate */}
                        <div className="relative">
                            <FiUser className="absolute left-3.5 top-3 text-gray-400 size-4 pointer-events-none" />
                            <select
                                value={candidateFilter}
                                onChange={e => setCandidateFilter(e.target.value)}
                                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Semua Pilihan</option>
                                {candidates.filter(c => c.status === 'active').map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table Render */}
                    <div className="overflow-x-auto border border-gray-100 rounded-lg">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-100">
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Ballot ID</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Pemilih (Voter)</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Kelas</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Kandidat Pilihan</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Waktu Mencoblos</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Terminal IP</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-xs">
                                {paginatedVotes.length > 0 ? (
                                    paginatedVotes.map(v => (
                                        <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                                            {/* Ballot ID */}
                                            <td className="px-4 py-3.5 font-mono text-[10px] text-gray-500 font-bold">
                                                {v.id}
                                            </td>
                                            
                                            {/* Voter details */}
                                            <td className="px-4 py-3.5">
                                                <div>
                                                    <p className="font-black text-slate-800 leading-tight">{v.voterName}</p>
                                                    <p className="text-[9px] text-gray-400 mt-0.5 font-mono">NISN: {v.voterNisn}</p>
                                                </div>
                                            </td>
                                            
                                            {/* Voter Class */}
                                            <td className="px-4 py-3.5 text-gray-500 font-semibold">
                                                {v.voterKelas}
                                            </td>
                                            
                                            {/* Selected Candidate */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <img 
                                                        src={v.candidateImage} 
                                                        alt={v.candidateName} 
                                                        className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                                    />
                                                    <span className="font-black text-slate-700">{v.candidateName}</span>
                                                </div>
                                            </td>
                                            
                                            {/* Timestamp */}
                                            <td className="px-4 py-3.5 text-gray-500 font-medium">
                                                {v.timestamp}
                                            </td>
                                            
                                            {/* IP Address */}
                                            <td className="px-4 py-3.5 text-gray-400 font-mono text-[10px]">
                                                {v.ipAddress}
                                            </td>
                                            
                                            {/* Status Badge */}
                                            <td className="px-4 py-3.5 text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                                                    SAH
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-gray-400 font-medium bg-slate-50/30">
                                            Tidak ada data log pencoblosan yang sesuai dengan filter pencarian.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Premium Pagination Panel Controls */}
                    {filteredVotes.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            {/* Left Side: Items Per Page Dropdown */}
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                                <span>Tampilkan</span>
                                <select 
                                    value={itemsPerPage} 
                                    onChange={e => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-text-green focus:ring-1 focus:ring-text-green bg-white cursor-pointer font-black text-slate-700 transition-all shadow-xs"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span>data per halaman</span>
                            </div>

                            {/* Center Info: Showing X to Y of Z entries */}
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                Menampilkan <strong className="text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong className="text-slate-700">{Math.min(currentPage * itemsPerPage, filteredVotes.length)}</strong> dari <strong className="text-slate-700">{filteredVotes.length}</strong> data
                            </span>

                            {/* Right Side: Prev / Pages Numbers / Next */}
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 transition-all cursor-pointer hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed shadow-xs"
                                    title="Halaman Sebelumnya"
                                >
                                    <FiChevronLeft className="size-3.5" />
                                </button>
                                
                                {Array.from({ length: Math.ceil(filteredVotes.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1.5 text-xs font-black rounded-lg border transition-all cursor-pointer shadow-xs ${
                                            currentPage === page
                                                ? 'bg-text-green text-white border-text-green'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    disabled={currentPage === Math.ceil(filteredVotes.length / itemsPerPage)}
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredVotes.length / itemsPerPage)))}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 transition-all cursor-pointer hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed shadow-xs"
                                    title="Halaman Selanjutnya"
                                >
                                    <FiChevronRight className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Table Footer with Summary Info */}
                    <div className="mt-5 pt-4 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-gray-400 font-medium">
                        <p>Total keseluruhan suara masuk di sistem: <strong className="text-slate-600">{votesCount} log surat suara</strong></p>
                        <div className="flex items-center gap-1">
                            <FiInfo className="size-3.5 text-emerald-600" />
                            <span>Audit Trail ini dirancang agar data suara masuk tetap anonim secara publik namun dapat diaudit oleh admin demi integritas pemilu.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
