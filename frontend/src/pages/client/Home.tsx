import { useState } from 'react';
import { useCandidate } from '@/features/candidate/hooks/useCandidate';
import { submitVote } from '@/features/candidate/api/candidateApi';
import { authService } from '@/services/authService';
import type { Candidates } from '@/features/candidate/types';
import { FiAlertTriangle, FiInfo } from 'react-icons/fi';

// Imported modular components
import { CandidateVoteCard } from '@/features/vote/components/CandidateVoteCard';
import { VisiMisiModal } from '@/features/vote/components/VisiMisiModal';
import { VoteConfirmModal } from '@/features/vote/components/VoteConfirmModal';
import { SuccessVote } from '@/features/vote/components/SuccessVote';

export default function ClientHome() {
    const { candidateList, isLoading, error } = useCandidate();

    // Tab state for each candidate card (candidateId -> 'visi' | 'misi')
    const [cardTabs, setCardTabs] = useState<Record<number, 'visi' | 'misi'>>({});

    // Modal State
    const [selectedCandidateForMisi, setSelectedCandidateForMisi] = useState<Candidates | null>(null);
    const [selectedCandidateForVote, setSelectedCandidateForVote] = useState<Candidates | null>(null);

    // Voting state
    const [isVoting, setIsVoting] = useState(false);
    const [voteSuccess, setVoteSuccess] = useState(false);
    const [apiError, setApiError] = useState("");

    // Filter active candidates
    const activeCandidates = candidateList.filter(c => c.status === 'Active' || c.status === 'active');

    const getActiveTab = (candidateId: number) => {
        return cardTabs[candidateId] || 'visi';
    };

    const setActiveTab = (candidateId: number, tab: 'visi' | 'misi') => {
        setCardTabs(prev => ({
            ...prev,
            [candidateId]: tab
        }));
    };

    const handleCastVote = async () => {
        if (!selectedCandidateForVote) return;
        setIsVoting(true);
        setApiError("");
        try {
            const timeRemaining = (window as any).votingTimeLeft || 300;
            await submitVote(selectedCandidateForVote.id, timeRemaining);
            setVoteSuccess(true);
            setSelectedCandidateForVote(null);

            // Auto logout and redirect after 3 seconds
            setTimeout(() => {
                authService.logout();
                window.location.href = '/';
            }, 3000);
        } catch (err: any) {
            setApiError(err.message || 'Gagal mengirimkan pilihan Anda. Silakan coba kembali.');
            setIsVoting(false);
        }
    };

    if (voteSuccess) {
        return <SuccessVote />;
    }

    return (
        <div className="w-full flex flex-col justify-center animate-in fade-in duration-300">
            {/* Ballot Notice */}
            <div className="text-center mb-8 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-text-green text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                    <FiInfo className="size-3" />
                    Pemberitahuan Resmi Pemilih
                </span>
                <h2 className="text-xl md:text-2xl font-black text-text-green uppercase tracking-tight leading-tight">
                    Pilihlah Kandidat Terbaik Anda
                </h2>
                <p className="text-xs text-gray-450 mt-1.5 leading-relaxed font-medium">
                    Gunakan hak suara Anda secara bijak dan cerdas. Pilihan Anda bersifat rahasia, dijamin oleh sistem keamanan kartu suara terenkripsi. Anda hanya diperbolehkan memilih satu kali.
                </p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-8 h-8 border-2 border-text-green border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Memuat Surat Suara...</span>
                </div>
            ) : error ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold max-w-md mx-auto text-center flex items-center gap-2">
                    <FiAlertTriangle className="size-5 text-rose-600 shrink-0" />
                    <span>{error}</span>
                </div>
            ) : activeCandidates.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-150 p-16 text-center shadow-xs max-w-2xl mx-auto">
                    <div className="w-12 h-12 bg-slate-50 border border-gray-150 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiInfo className="size-5 text-gray-400" />
                    </div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Belum ada kandidat aktif</p>
                    <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">Tidak ada kandidat dengan status aktif untuk dipilih saat ini.</p>
                </div>
            ) : (
                /* Responsive Grid Layout: md:grid-cols-2 xl:grid-cols-3 and using flex-row cards! */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full items-stretch">
                    {activeCandidates.map((candidate) => (
                        <CandidateVoteCard
                            key={candidate.id}
                            candidate={candidate}
                            activeTab={getActiveTab(candidate.id)}
                            onTabChange={(tab) => setActiveTab(candidate.id, tab)}
                            onShowDetail={() => setSelectedCandidateForMisi(candidate)}
                            onVote={() => setSelectedCandidateForVote(candidate)}
                        />
                    ))}
                </div>
            )}

            {/* VISION & MISSION MODAL DIALOG */}
            <VisiMisiModal
                candidate={selectedCandidateForMisi}
                onClose={() => setSelectedCandidateForMisi(null)}
            />

            {/* CONFIRMATION VOTING MODAL */}
            <VoteConfirmModal
                candidate={selectedCandidateForVote}
                onClose={() => setSelectedCandidateForVote(null)}
                onConfirm={handleCastVote}
                isVoting={isVoting}
                apiError={apiError}
            />
        </div>
    );
}