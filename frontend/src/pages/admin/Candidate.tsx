import { useCandidate } from '../../features/candidate/hooks/useCandidate';
import { CandidateCard } from '../../features/candidate/components/CandidateCard';
import { FiPlus } from 'react-icons/fi';
import { Link } from '@tanstack/react-router';

export default function AdminCandidate() {
    const { candidateList, deleteCandidate, isLoading, error } = useCandidate();

    const handleDeleteClick = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kandidat ini?')) {
            try {
                await deleteCandidate(id);
            } catch (err: any) {
                alert(err.message || 'Gagal menghapus kandidat.');
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/30 overflow-y-auto pb-8">
            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-1 pb-4 border-b border-gray-100 px-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl text-text-green font-black tracking-tight">Manajemen Kandidat</h1>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                            Daftar Kandidat Ketua & Visi Misi Aktif
                        </p>
                    </div>

                    {/* Tambah Kandidat Button */}
                    <Link 
                        to="/candidate/form"
                        className="inline-flex items-center gap-2 bg-text-green hover:bg-text-green/90 text-white font-black text-xs px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer self-start md:self-auto uppercase tracking-wider"
                    >
                        <FiPlus className="size-4 stroke-[3px]" />
                        Tambah Kandidat
                    </Link>
                </div>
            </div>

            {/* Grid Cards Container */}
            <div className="px-6 pt-6">
                {isLoading && candidateList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-text-green"></div>
                        <p className="text-[11px] text-gray-450 mt-3 font-semibold uppercase tracking-wider animate-pulse">Memuat kandidat...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-150 rounded-xl p-5 text-left max-w-2xl mx-auto shadow-sm">
                        <p className="text-xs text-red-650 font-bold uppercase tracking-wider">Gagal Sinkronisasi API</p>
                        <p className="text-[11px] text-red-500 mt-1">{error}</p>
                    </div>
                ) : candidateList.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-xs max-w-2xl mx-auto">
                        <div className="w-12 h-12 bg-slate-50 border border-gray-150 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiPlus className="size-5 text-gray-400" />
                        </div>
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Belum ada kandidat terdaftar</p>
                        <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">Data API kosong. Silakan tambahkan kandidat ketua OSIS/MPK baru dengan menekan tombol Tambah Kandidat.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {candidateList.map((candidate, index) => (
                            <CandidateCard
                                key={candidate.id}
                                candidate={candidate}
                                index={index}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}