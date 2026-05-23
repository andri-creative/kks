import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import type { User } from '@/types/Users';
import { fetchAdmins, createAdmin, updateAdminApi, deleteUser } from '@/features/users/api/userApi';
import { AdminModal } from '@/features/users/components/AdminModal';
import {
    FiUserPlus,
    FiEdit,
    FiTrash2,
    FiShield,
    FiCheckCircle,
    FiAlertCircle,
    FiEye,
    FiEyeOff,
    FiUserCheck
} from 'react-icons/fi';

export default function Profile() {
    const currentUser = authService.getCurrentUser();

    // Admins List State
    const [admins, setAdmins] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<User | null>(null);

    // UI Feedback State
    const [showPinMap, setShowPinMap] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Fetch admins from backend API
    const loadAdminsFromApi = async () => {
        setLoading(true);
        try {
            const data = await fetchAdmins();
            setAdmins(data);
        } catch (err: any) {
            showToast('error', err.message || 'Gagal memuat data admin.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminsFromApi();
    }, []);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
    };

    const togglePinVisibility = (usernameKey: string) => {
        setShowPinMap(prev => ({
            ...prev,
            [usernameKey]: !prev[usernameKey]
        }));
    };

    const openCreateModal = () => {
        setEditingAdmin(null);
        setIsModalOpen(true);
    };

    const openEditModal = (admin: User) => {
        setEditingAdmin(admin);
        setIsModalOpen(true);
    };

    const handleDelete = async (adminToDelete: User) => {
        // Security check: cannot delete oneself
        if (adminToDelete.username === currentUser.username) {
            showToast('error', 'Anda tidak dapat menghapus akun Anda sendiri!');
            return;
        }

        if (window.confirm(`Apakah Anda yakin ingin menghapus admin "${adminToDelete.name}"?`)) {
            setLoading(true);
            try {
                if (adminToDelete.id) {
                    await deleteUser(adminToDelete.id);
                    await loadAdminsFromApi();
                    showToast('success', 'Admin berhasil dihapus!');
                }
            } catch (err: any) {
                showToast('error', err.message || 'Gagal menghapus admin.');
                setLoading(false);
            }
        }
    };

    const handleSave = async (adminData: { name: string; username: string; code: string }) => {
        const { name, username, code } = adminData;

        // Validate username uniqueness
        const isDuplicateUsername = admins.some(a =>
            a.username.toLowerCase() === username.toLowerCase() &&
            (!editingAdmin || a.username.toLowerCase() !== editingAdmin.username.toLowerCase())
        );

        if (isDuplicateUsername) {
            throw new Error('Username sudah digunakan oleh admin lain!');
        }

        const isSelfEditing = editingAdmin && editingAdmin.username === currentUser.username;

        if (editingAdmin) {
            // Edit mode
            if (editingAdmin.id) {
                await updateAdminApi(editingAdmin.id, { name, username, code });
            }

            // If the logged-in admin edited their own name, update the local auth state as well
            if (isSelfEditing) {
                localStorage.setItem('user_name', name);
                localStorage.setItem('user_username', username);
            }

            showToast('success', 'Data admin berhasil diperbarui!');
        } else {
            // Create mode
            await createAdmin({ name, username, code });
            showToast('success', 'Admin baru berhasil ditambahkan!');
        }

        await loadAdminsFromApi();

        // Force refresh location so navigation layouts (like header names) are updated instantly
        if (isSelfEditing) {
            window.location.reload();
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Memuat Data Keamanan...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/30 overflow-y-auto pb-10">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${toast.type === 'success'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    : 'bg-rose-50 border-rose-100 text-rose-800'
                    }`}>
                    {toast.type === 'success' ? <FiCheckCircle className="size-4 text-emerald-600" /> : <FiAlertCircle className="size-4 text-rose-600" />}
                    <span className="text-xs font-black tracking-tight">{toast.message}</span>
                </div>
            )}

            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-1 pb-4 border-b border-gray-100 px-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl text-text-green font-black tracking-tight flex items-center gap-2">
                            <FiShield className="size-6 text-emerald-600" />
                            Manajemen Profil Admin
                        </h1>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Konfigurasi akun dan hak istimewa sistem dengan role Administrator
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                    >
                        <FiUserPlus className="size-4" />
                        Tambah Admin
                    </button>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="px-6 pt-6">
                {/* Security Advice Notice Banner */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                        <FiShield className="size-4" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">Kebijakan Kredensial & Autentikasi</h3>
                        <p className="text-[10px] text-emerald-700 leading-relaxed mt-1">
                            Akun-akun di bawah ini memiliki hak akses penuh terhadap konfigurasi sistem kependudukan, cetak kartu, dan kandidat. Pastikan kombinasi username dan PIN/Passcode tetap aman dan rahasia.
                        </p>
                    </div>
                </div>

                {/* Admins Table Grid */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider w-12">#</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Nama Admin</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">PIN / Passcode</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Hak Akses</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {admins.map((admin, index) => {
                                    const isSelf = admin.username === currentUser.username;
                                    return (
                                        <tr key={admin.username} className={`hover:bg-slate-50/50 transition-colors ${isSelf ? 'bg-emerald-50/10' : ''}`}>
                                            <td className="px-6 py-4.5 text-[10px] font-mono font-bold text-gray-400">
                                                {String(index + 1).padStart(2, '0')}
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-gray-800">{admin.name}</span>
                                                    {isSelf && (
                                                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[8px] font-black px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                                                            <FiUserCheck className="size-2.5" />
                                                            Anda
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded border border-gray-100">@{admin.username}</span>
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono font-bold text-gray-700 w-12 tracking-wider">
                                                        {showPinMap[admin.username] ? admin.code : '•••••'}
                                                    </span>
                                                    <button
                                                        onClick={() => togglePinVisibility(admin.username)}
                                                        className="text-gray-400 hover:text-emerald-600 transition-colors p-1 cursor-pointer"
                                                        title={showPinMap[admin.username] ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                                                    >
                                                        {showPinMap[admin.username] ? <FiEyeOff className="size-3.5" /> : <FiEye className="size-3.5" />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4.5">
                                                <span className="inline-flex items-center gap-1 text-[9px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                                                    <FiShield className="size-3" />
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(admin)}
                                                        className="p-1.5 rounded-lg border border-gray-150 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all cursor-pointer"
                                                        title="Edit Data Admin"
                                                    >
                                                        <FiEdit className="size-3.5" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(admin)}
                                                        disabled={isSelf}
                                                        className={`p-1.5 rounded-lg border transition-all ${isSelf
                                                            ? 'border-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                                                            : 'border-gray-150 text-gray-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 cursor-pointer'
                                                            }`}
                                                        title={isSelf ? 'Anda tidak dapat menghapus akun Anda sendiri' : 'Hapus Akun Admin'}
                                                    >
                                                        <FiTrash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Dialog Form */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSave}
                editingAdmin={editingAdmin}
                currentUser={currentUser}
            />
        </div>
    );
}