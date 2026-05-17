import { useCandidate } from '../../features/candidate/hooks/useCandidate';
import { CandidateCard } from '../../features/candidate/components/CandidateCard';
import { FiPlus } from 'react-icons/fi';
import { Link } from '@tanstack/react-router';

export default function AdminCandidate() {
    const { candidateList, deleteCandidate } = useCandidate();

    const handleDeleteClick = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kandidat ini?')) {
            deleteCandidate(id);
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
            </div>
        </div>
    );
}