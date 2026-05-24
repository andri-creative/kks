import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onClose, onConfirm, isDestructive = true }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl border border-gray-100 shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 text-left">
                <div className="p-6">
                    <h3 className="text-lg font-black text-slate-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500">{message}</p>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-5 py-2 text-xs font-black rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider ${isDestructive ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-text-green hover:bg-text-green/90 text-white'}`}
                    >
                        Ya, Lanjutkan
                    </button>
                </div>
            </div>
        </div>
    );
};
