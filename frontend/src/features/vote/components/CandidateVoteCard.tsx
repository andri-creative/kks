import React from 'react';
import type { Candidates } from '@/features/candidate/types';
import { isPlaceholderImage } from '@/features/candidate/utils/candidateUtils';
import { FiEye, FiCheck } from 'react-icons/fi';

interface CandidateVoteCardProps {
    candidate: Candidates;
    activeTab: 'visi' | 'misi';
    onTabChange: (tab: 'visi' | 'misi') => void;
    onShowDetail: () => void;
    onVote: () => void;
}

export const CandidateVoteCard: React.FC<CandidateVoteCardProps> = ({
    candidate,
    activeTab,
    onTabChange,
    onShowDetail,
    onVote
}) => {
    const formattedNo = String(candidate.no || 1).padStart(2, '0');

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-row group hover:-translate-y-1 text-slate-700">
            {/* Left Side: Vertical Portrait Photo */}
            <div className="relative w-36 sm:w-44 shrink-0 overflow-hidden bg-gray-50 border-r border-gray-150 flex items-center justify-center">
                {candidate.image && !isPlaceholderImage(candidate.image) ? (
                    <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-emerald-500/10 via-emerald-600/15 to-teal-700/20 flex flex-col items-center justify-center p-4 text-center group-hover:scale-105 transition-transform duration-500 select-none">
                        <svg className="w-12 h-12 text-text-green/50 mb-2 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <span className="text-[10px] font-black text-text-green/60 uppercase tracking-widest leading-none">Pas Foto</span>
                        <span className="text-[9px] text-emerald-600/50 mt-1 font-medium tracking-normal lowercase">Kandidat</span>
                    </div>
                )}

                {/* Gentle overlay for badge contrast */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Candidate Number Badge */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-text-green text-[10px] font-black px-2.5 py-1 rounded shadow-xs border border-gray-100 uppercase tracking-wider font-mono">
                    #{formattedNo}
                </div>
            </div>

            {/* Right Side: Details Section */}
            <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                <div>
                    {/* Class, Name & NISN badges */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-black bg-emerald-50 text-text-green px-2.5 py-0.5 rounded border border-emerald-100/50 uppercase tracking-wider">
                                    {candidate.kelas}
                                </span>
                                <span className="text-[10px] font-mono font-bold bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100 uppercase tracking-wider">
                                    NIS: {candidate.nisn}
                                </span>
                            </div>
                            <h2 className="text-base sm:text-lg font-black mt-1 text-text-green tracking-tight truncate uppercase leading-tight" title={candidate.name}>
                                {candidate.name}
                            </h2>
                        </div>
                    </div>

                    {/* Visi & Misi Tab Controls */}
                    <div className="flex bg-gray-100 p-0.5 rounded-lg gap-0.5 mb-2.5">
                        <button
                            type="button"
                            onClick={() => onTabChange('visi')}
                            className={`flex-1 text-center py-1 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'visi'
                                ? 'bg-white text-text-green shadow-xs'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Visi
                        </button>
                        <button
                            type="button"
                            onClick={() => onTabChange('misi')}
                            className={`flex-1 text-center py-1 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'misi'
                                ? 'bg-white text-text-green shadow-xs'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Misi
                        </button>
                    </div>
                </div>

                {/* HTML content rendering safely */}
                <div className="flex-1 flex flex-col bg-slate-50/50 p-2.5 rounded-lg border border-dashed border-gray-200 min-h-[120px] justify-start overflow-hidden">
                    <div
                        className="text-xs text-gray-600 leading-relaxed overflow-y-auto max-h-[125px] pr-1 scrollbar-thin candidate-visi-misi-content [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5 font-medium text-left"
                        dangerouslySetInnerHTML={{
                            __html: activeTab === 'visi' ? (candidate.visi || 'Visi belum dicantumkan.') : (candidate.misi || 'Misi belum dicantumkan.')
                        }}
                    />
                </div>

                {/* Action Buttons Pinned at the Bottom - Side by Side */}
                <div className="mt-4 flex gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={onShowDetail}
                        className="flex-1 py-2 px-2 rounded-lg border border-gray-200 text-gray-600 hover:text-text-green hover:bg-slate-50 hover:border-gray-300 text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer uppercase tracking-wider bg-white min-w-0 truncate"
                        title="Detail Visi & Misi"
                    >
                        <FiEye className="size-3.5 text-gray-450 shrink-0" />
                        <span>Detail</span>
                    </button>
                    <button
                        type="button"
                        onClick={onVote}
                        className="flex-1 py-2 px-2 rounded-lg bg-text-green hover:bg-text-green/90 text-white text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 cursor-pointer uppercase tracking-wider border-none min-w-0"
                    >
                        <FiCheck className="size-3.5 stroke-[3px] shrink-0" />
                        <span>Pilih</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
