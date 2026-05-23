import React from 'react';
import type { Candidates } from '@/features/candidate/types';
import { FiX } from 'react-icons/fi';

interface VisiMisiModalProps {
    candidate: Candidates | null;
    onClose: () => void;
}

export const VisiMisiModal: React.FC<VisiMisiModalProps> = ({ candidate, onClose }) => {
    if (!candidate) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 text-left flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="bg-slate-50 border-b border-gray-150 px-6 py-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-50 border border-emerald-150 text-text-green text-sm font-black px-2.5 py-1 rounded-lg font-mono">
                            #{String(candidate.no || 1).padStart(2, '0')}
                        </span>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-text-green uppercase tracking-wider leading-none">{candidate.name}</h3>
                            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Kelas: {candidate.kelas}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
                    >
                        <FiX className="size-4" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1 text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {/* Visi */}
                    <div className="space-y-1.5">
                        <h4 className="text-xs font-black text-text-green uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-text-green rounded-full"></span>
                            Visi Utama
                        </h4>
                        <div 
                            className="p-4 bg-slate-50 border border-gray-150 rounded-xl leading-relaxed whitespace-pre-line font-medium text-gray-700 candidate-visi-misi-content [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5 text-xs sm:text-sm"
                            dangerouslySetInnerHTML={{ __html: candidate.visi || 'Visi belum dicantumkan.' }}
                        />
                    </div>

                    {/* Misi */}
                    <div className="space-y-1.5">
                        <h4 className="text-xs font-black text-text-green uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-text-green rounded-full"></span>
                            Misi & Program Kerja
                        </h4>
                        <div 
                            className="p-4 bg-slate-50 border border-gray-150 rounded-xl leading-relaxed whitespace-pre-line font-medium text-gray-700 candidate-visi-misi-content [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5 text-xs sm:text-sm"
                            dangerouslySetInnerHTML={{ __html: candidate.misi || 'Misi belum dicantumkan.' }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 border-t border-gray-150 px-6 py-4 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-white hover:bg-gray-100 text-gray-500 text-sm font-bold rounded-xl transition-all cursor-pointer border border-gray-200"
                    >
                        Tutup Detail
                    </button>
                </div>
            </div>
        </div>
    );
};
