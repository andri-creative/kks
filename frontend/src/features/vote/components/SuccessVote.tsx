import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

export const SuccessVote: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-slate-50 z-50 flex items-center justify-center p-6 text-center font-sans">
            <div className="max-w-md w-full bg-white border border-gray-150 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center animate-pulse">
                        <FiCheckCircle className="size-10 text-emerald-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-black text-emerald-800 uppercase tracking-wider mb-2">Pilihan Berhasil Dikirim</h2>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    Terima kasih atas partisipasi Anda dalam pemilihan ketua kelas ini! Hak suara Anda telah dicatat oleh sistem dengan aman.
                </p>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6">
                    <span className="text-[10px] text-emerald-700 font-black uppercase tracking-widest block mb-1">Status Sesi Keamanan</span>
                    <span className="text-[11px] text-slate-500">Sesi ditutup secara otomatis. Mengarahkan kembali ke halaman masuk...</span>
                </div>
                <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
};
