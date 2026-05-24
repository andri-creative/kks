import { Tab } from '@headlessui/react'
import { useUsers } from '@/features/users/hooks/useUsers'
import { UserTable } from '@/features/users/components/UserTable'
import { UserFilter } from '@/features/users/components/UserFilter'
import { Pagination } from '@/features/users/components/Pagination'
import { UserModal } from '@/features/users/components/UserModal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Link } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx'
import { FiCheckCircle, FiAlertCircle, FiDownload, FiUpload } from 'react-icons/fi'

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function AdminUsers() {
    const {
        usersByClass,
        totalItemsByClass,
        isLoading,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        clearFilters,
        addUser,
        importUsers,
        editUser,
        removeUser,
        removeMultipleUsers
    } = useUsers();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState(Object.keys(usersByClass)[0] || '');

    // State untuk mengontrol visibilitas modal
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void }>({
        isOpen: false, title: "", message: "", onConfirm: () => { }
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (type: 'success' | 'error', message: string) => setToast({ type, message });

    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([{ name: 'Budi Santoso', nisn: '1234567890', kelas: 'XII RPL 1' }]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "Template_Import_Pemilih.xlsx");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target?.result;
            try {
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                const usersData = data.map((row: any) => ({
                    name: String(row.name || row.Nama || row.NAMA || ''),
                    nisn: String(row.nisn || row.NISN || ''),
                    kelas: String(row.kelas || row.Kelas || row.KELAS || '')
                })).filter(u => u.name && u.nisn && u.kelas);

                if (usersData.length === 0) {
                    showToast('error', "Format tidak valid atau data kosong! Pastikan kolom name, nisn, kelas terisi.");
                    return;
                }

                if (usersData.length > 100) {
                    showToast('error', "Data ditolak! Maksimal 100 data yang bisa diimpor dalam satu waktu.");
                    return;
                }

                await importUsers(usersData);
                showToast('success', `Berhasil mengimpor data!`);
            } catch (error: any) {
                showToast('error', error.message || "Gagal mengimpor data!");
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsBinaryString(file);
    };

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setIsAddOpen(true);
    };

    const handleBulkDelete = () => {
        setConfirmConfig({
            isOpen: true,
            title: "Hapus Massal",
            message: `Yakin ingin menghapus ${selectedIds.length} data terpilih? Aksi ini tidak dapat dibatalkan.`,
            onConfirm: async () => {
                try {
                    await removeMultipleUsers(selectedIds);
                    setSelectedIds([]);
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    // Sinkronisasi activeTab saat data pertama kali dimuat
    useEffect(() => {
        if (!activeTab && Object.keys(usersByClass).length > 0) {
            setActiveTab(Object.keys(usersByClass)[0]);
        }
    }, [usersByClass]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-x-hidden relative">
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

            {/* Title Section (Hanya ini yang Sticky) */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-1 pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl text-text-green font-black tracking-tight">Manajemen User</h1>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                            Sistem Database Siswa Aktif
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".xlsx, .xls"
                            className="hidden"
                        />
                        <button
                            onClick={handleDownloadTemplate}
                            className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                            <FiDownload className="size-4" />
                            Template
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
                        >
                            <FiUpload className="size-4" />
                            Import
                        </button>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="bg-button hover:bg-button/90 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-button/20 flex items-center gap-2 active:scale-95 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            Tambah
                        </button>
                    </div>
                </div>
            </div>

            <Tab.Group onChange={(index) => {
                const category = Object.keys(usersByClass)[index];
                setActiveTab(category);
                setCurrentPage(1);
                setSelectedIds([]);
            }}>
                {/* Bagian ini akan ikut ter-scroll ke atas */}
                <div className="pt-4">
                    {/* Tab untuk Select Kelas */}
                    <Tab.List className="flex justify-between gap-3 space-x-10 border-b border-gray-100 mb-6 px-1">
                        {Object.keys(usersByClass).map((category) => (
                            <Tab
                                key={category}
                                className={({ selected }) =>
                                    classNames(
                                        'pb-4 text-xs font-bold uppercase tracking-widest outline-none transition-all duration-300 relative cursor-pointer',
                                        selected
                                            ? 'text-text-green'
                                            : 'text-gray-300 hover:text-text-green/60'
                                    )
                                }
                            >
                                {({ selected }) => (
                                    <div className="flex items-center gap-2">
                                        <span>{category.split(' ')[0]}</span>
                                        <span className={classNames(
                                            'px-1.5 py-0.5 rounded-md text-[9px] font-black transition-all duration-300',
                                            selected
                                                ? 'bg-text-green/10 text-text-green'
                                                : 'bg-gray-100 text-gray-400'
                                        )}>
                                            {totalItemsByClass[category].length}
                                        </span>
                                        {selected && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-green rounded-full animate-in fade-in zoom-in duration-300" />
                                        )}
                                    </div>
                                )}
                            </Tab>
                        ))}

                        <div className='w-full flex items-center justify-end pb-4'>
                            {selectedIds.length > 0 ? (
                                <>
                                    <Link
                                        to="/users/cetak"
                                        search={{
                                            kelas: (() => {
                                                const allUsers = totalItemsByClass['Semua'] || [];
                                                const selectedUsers = allUsers.filter(u => selectedIds.includes(u.id.toString()));
                                                const classes = [...new Set(selectedUsers.map(u => u.kelas?.trim()))];

                                                if (classes.length === 0) return 'Pilih Siswa';
                                                if (classes.length === 1) return classes[0];

                                                const levels = [...new Set(classes.map(c => c.split(' ')[0]))];
                                                if (levels.length === 1) return levels[0];

                                            })()
                                        }}
                                        onClick={() => {
                                            const allUsers = totalItemsByClass['Semua'] || [];
                                            const selectedUsers = allUsers.filter(u => selectedIds.includes(u.id.toString()));
                                            localStorage.setItem('cetakUsers', JSON.stringify(selectedUsers));
                                        }}
                                        className='flex items-center bg-button text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer active:scale-95 transition-all shadow-sm'
                                    >
                                        <span className='w-5 h-5 flex items-center justify-center bg-white text-text-green rounded-full text-[10px] font-black mr-2 tracking-tighter'>
                                            {selectedIds.length}
                                        </span>
                                        Cetak Kartu
                                    </Link>
                                    <button
                                        onClick={handleBulkDelete}
                                        className='ml-2 flex items-center bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer active:scale-95 transition-all shadow-sm'
                                    >
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        Hapus
                                    </button>
                                </>
                            ) : (
                                <div
                                    className='flex items-center bg-gray-200 text-gray-400 px-4 py-2 rounded-lg text-sm font-bold cursor-not-allowed opacity-60 shadow-sm select-none'
                                >
                                    <span className='w-5 h-5 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full text-[10px] font-black mr-2 tracking-tighter'>
                                        0
                                    </span>
                                    Cetak Kartu
                                </div>
                            )}
                        </div>
                    </Tab.List>

                    {/* Filter Section (Ikut ter-scroll) */}
                    <UserFilter
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        sortOrder={sortOrder}
                        onSortOrderToggle={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        onClear={clearFilters}
                    />
                </div>

                {/* Table Section */}
                <div className='flex-1 flex flex-col min-h-0 px-1'>
                    <Tab.Panels className="flex-1 custom-scrollbar pt-2">
                        {Object.entries(usersByClass).map(([category, users], idx) => (
                            <Tab.Panel
                                key={idx}
                                className="outline-none animate-in fade-in slide-in-from-bottom-3 duration-500"
                            >
                                <UserTable
                                    users={users}
                                    selectedIds={selectedIds}
                                    isAllSelected={totalItemsByClass[category].length > 0 && totalItemsByClass[category].every(u => selectedIds.includes(u.id.toString()))}
                                    onToggleSelect={(id) => {
                                        const idStr = id.toString();
                                        setSelectedIds(prev =>
                                            prev.includes(idStr) ? prev.filter(i => i !== idStr) : [...prev, idStr]
                                        )
                                    }}
                                    onToggleAll={() => {
                                        const allIdsInClass = totalItemsByClass[category].map(u => u.id.toString());
                                        const isAllSelected = allIdsInClass.every(id => selectedIds.includes(id));

                                        if (isAllSelected) {
                                            setSelectedIds(prev => prev.filter(id => !allIdsInClass.includes(id)));
                                        } else {
                                            setSelectedIds(prev => [...new Set([...prev, ...allIdsInClass])]);
                                        }
                                    }}
                                    onEdit={handleEditClick}
                                    onDelete={(id, name) => {
                                        setConfirmConfig({
                                            isOpen: true,
                                            title: "Hapus Pemilih",
                                            message: `Yakin ingin menghapus pemilih "${name}"? Aksi ini tidak dapat dibatalkan.`,
                                            onConfirm: async () => {
                                                try {
                                                    await removeUser(id);
                                                } catch (error) {
                                                    console.error(error);
                                                }
                                            }
                                        });
                                    }}
                                />

                                <Pagination
                                    totalItems={totalItemsByClass[category].length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    onPageChange={setCurrentPage}
                                />
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </div>
            </Tab.Group>

            {/* Modal Dialog Komponen Terpisah untuk Tambah/Edit User */}
            <UserModal
                isOpen={isAddOpen}
                onClose={() => {
                    setIsAddOpen(false);
                    setEditingUser(null);
                }}
                onSubmit={async (userData) => {
                    if (editingUser) {
                        await editUser(editingUser.id, userData);
                    } else {
                        await addUser(userData);
                    }
                }}
                initialData={editingUser}
            />

            {/* Custom Confirm Modal */}
            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmConfig.onConfirm}
                isDestructive={true}
            />
        </div>
    );
}
