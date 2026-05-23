import React, { useState } from 'react';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: { name: string; nisn: string; kelas: string }) => Promise<void>;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState("");
    const [nisn, setNisn] = useState("");
    const [kelas, setKelas] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({ name, nisn, kelas });
            // Reset form fields
            setName("");
            setNisn("");
            setKelas("");
            onClose();
        } catch (err: any) {
            alert(err.message || "Gagal menyimpan data user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl border border-gray-100 shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 text-left">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-sm font-black text-text-green uppercase tracking-wider">
                            Tambah Pemilih Baru
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            Silakan isi data nama, NISN, dan kelas pemilih.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg border border-gray-150 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer animate-none"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                            placeholder="Contoh: Budi Santoso"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">NISN / Nomor Induk</label>
                        <input
                            type="text"
                            required
                            maxLength={10}
                            pattern="\d{10}"
                            value={nisn}
                            onChange={(e) => setNisn(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all font-mono"
                            placeholder="Contoh: 1234567890 (10 digit)"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Kelas</label>
                        <input
                            type="text"
                            required
                            value={kelas}
                            onChange={(e) => setKelas(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                            placeholder="Contoh: XI RPL 1"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 text-xs font-black bg-text-green hover:bg-text-green/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                            ) : (
                                <svg className="w-3.5 h-3.5 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                            )}
                            Simpan User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
