import React from 'react';
import type { Candidates } from '@/features/candidate/types';
import { FiAlertTriangle, FiCheck } from 'react-icons/fi';

interface VoteConfirmModalProps {
    candidate: Candidates | null;
    onClose: () => void;
    onConfirm: () => void;
    isVoting: boolean;
    apiError: string;
}

export const VoteConfirmModal: React.FC<VoteConfirmModalProps> = ({
    candidate,
    onClose,
    onConfirm,
    isVoting,
    apiError
}) => {
    if (!candidate) return null;

    const formattedNo = String(candidate.no || 1).padStart(2, '0');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
                onClick={() => !isVoting && onClose()}
            />

            {/* Modal Box */}
            <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 text-left">
                {/* Body content */}
                <div className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                            <FiAlertTriangle className="size-5" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-sm font-black text-text-green uppercase tracking-widest">Konfirmasi Pilihan Suara</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pastikan pilihan Anda sudah benar</p>
                    </div>

                    {apiError && (
                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-bold text-center">
                            {apiError}
                        </div>
                    )}

                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-0.5">
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest block">Kandidat Pilihan Anda</span>
                        <span className="text-xs text-text-green font-black uppercase tracking-tight block">
                            (#{formattedNo}) {candidate.name}
                        </span>
                    </div>

                    <p className="text-[10px] text-amber-800 leading-relaxed bg-amber-50 p-3 rounded-lg border border-amber-100 font-medium">
                        Pilihan Anda bersifat <strong>FINAL</strong>. Anda tidak dapat masuk kembali ke sistem untuk mengganti suara setelah mengonfirmasi tindakan ini.
                    </p>
                </div>

                {/* Actions */}
                <div className="bg-slate-50 border-t border-gray-150 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                        disabled={isVoting}
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-500 text-xs font-bold rounded-xl transition-all cursor-pointer border border-gray-200 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        disabled={isVoting}
                        onClick={onConfirm}
                        className="px-6 py-2.5 bg-text-green hover:bg-text-green/90 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider flex items-center gap-2 border-none disabled:opacity-50"
                    >
                        {isVoting ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Mengirim...</span>
                            </>
                        ) : (
                            <>
                                <FiCheck className="size-4" />
                                <span>Ya, Konfirmasi</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
