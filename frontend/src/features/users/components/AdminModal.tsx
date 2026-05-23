import React, { useState, useEffect } from 'react';
import type { User } from '@/types/Users';
import { FiShield, FiX, FiAlertCircle, FiLock } from 'react-icons/fi';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (adminData: { name: string; username: string; code: string }) => Promise<void>;
    editingAdmin: User | null;
    currentUser: { name: string | null; username: string | null };
}

export function AdminModal({ isOpen, onClose, onSubmit, editingAdmin, currentUser }: AdminModalProps) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(editingAdmin ? editingAdmin.name : '');
            setUsername(editingAdmin ? editingAdmin.username : '');
            setCode(editingAdmin ? editingAdmin.code.toString() : '');
            setErrorMsg('');
            setIsSubmitting(false);
        }
    }, [isOpen, editingAdmin]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name.trim() || !username.trim() || !code.trim()) {
            setErrorMsg('Semua kolom wajib diisi!');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({ name, username, code });
            onClose();
        } catch (err: any) {
            setErrorMsg(err.message || 'Gagal menyimpan data admin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSelfEditing = editingAdmin && editingAdmin.username === currentUser.username;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 text-left font-sans">
                {/* Modal Header */}
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                        <FiShield className="size-4 text-emerald-600" />
                        {editingAdmin ? 'Edit Data Admin' : 'Tambah Admin Baru'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 transition-colors cursor-pointer"
                    >
                        <FiX className="size-4" />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errorMsg && (
                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 text-[10px] font-bold flex items-center gap-2">
                            <FiAlertCircle className="size-4 text-rose-600 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Info Banner when Self-editing */}
                    {isSelfEditing && (
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-amber-800 text-[10px] font-bold leading-normal flex items-start gap-2">
                            <FiLock className="size-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>Anda sedang mengedit akun Anda sendiri. Anda tidak diperkenankan mengubah role atau status keamanan agar tidak terkunci dari panel admin.</span>
                        </div>
                    )}

                    {/* Full Name */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all animate-none"
                            placeholder="Contoh: Ahmad Subardjo"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Username</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-gray-400 font-mono">@</span>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())}
                                className="w-full text-xs pl-8 pr-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-mono"
                                placeholder="username"
                            />
                        </div>
                    </div>

                    {/* PIN Code */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">PIN / Passcode Keamanan (Angka)</label>
                        <input
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required
                            value={code}
                            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-mono tracking-widest"
                            placeholder="Masukkan PIN Angka (Contoh: 12345)"
                            maxLength={8}
                        />
                    </div>

                    {/* Role Select Field */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Hak Akses / Role</label>
                        <select
                            disabled={true}
                            value="admin"
                            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-gray-400 cursor-not-allowed font-bold"
                        >
                            <option value="admin">ADMINISTRATOR (Full Access)</option>
                        </select>
                    </div>

                    {/* Modal Actions */}
                    <div className="pt-4 border-t border-gray-150 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <span>Simpan Admin</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
