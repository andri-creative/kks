import React, { useState, useEffect } from 'react';
import { useSettings } from '../../features/settings/hooks/useSettings';
import { SchoolProfileTab } from '../../features/settings/components/SchoolProfileTab';
import { ElectionRulesTab } from '../../features/settings/components/ElectionRulesTab';
import {
    FiSave,
    FiSettings,
    FiCheckCircle,
    FiInfo,
    FiBookOpen,
    FiShield
} from 'react-icons/fi';

export default function Settings() {
    const { settings, isLoading, updateSettings } = useSettings();

    // Tab State
    const [activeTab, setActiveTab] = useState<'profile' | 'election'>('profile');

    // Form fields state (cloned from settings hook for atomic saving)
    const [formData, setFormData] = useState(settings);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Sync form data only when settings initial loading completes
    useEffect(() => {
        if (!isLoading) {
            setFormData(settings);
        }
    }, [isLoading, settings]);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleFieldChange = (fields: Partial<typeof settings>) => {
        setFormData(prev => ({
            ...prev,
            ...fields
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        // Save using our custom settings hook which handles localStorage and events
        updateSettings(formData);

        setToast({
            type: 'success',
            message: 'Seluruh konfigurasi branding & sistem berhasil disimpan!'
        });
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/30 overflow-y-auto pb-10">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${toast.type === 'success'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    : 'bg-rose-50 border-rose-100 text-rose-800'
                    }`}>
                    <FiCheckCircle className="size-4 text-emerald-600" />
                    <span className="text-xs font-black tracking-tight">{toast.message}</span>
                </div>
            )}

            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-1 pb-4 border-b border-gray-100 px-6">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl text-text-green font-black tracking-tight flex items-center gap-2">
                            <FiSettings className="size-6 text-emerald-600 animate-spin-slow" />
                            Konfigurasi Branding & Sistem
                        </h1>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Atur identitas resmi sekolah, logo OSIS, dan parameter bilik suara
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Layout - Centered for clean focus */}
            <div className="px-6 pt-6 max-w-[1600px] mx-auto w-full">
                <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 shadow-md p-6 space-y-6 w-full text-left">

                    {/* Tab Navigation Menu */}
                    <div className="flex border-b border-gray-100 pb-3 gap-6 overflow-x-auto custom-scrollbar">
                        {/* Tab 1: Profile & Branding */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={`pb-2 text-xs font-black uppercase tracking-wider outline-none transition-all duration-300 relative cursor-pointer flex items-center gap-2 ${activeTab === 'profile'
                                ? 'text-text-green'
                                : 'text-gray-300 hover:text-text-green/60'
                                }`}
                        >
                            <FiBookOpen className="size-3.5" />
                            Profil & Branding Sekolah
                            {activeTab === 'profile' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-green rounded-full animate-in fade-in duration-300" />
                            )}
                        </button>

                        {/* Tab 2: Election Rules */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('election')}
                            className={`pb-2 text-xs font-black uppercase tracking-wider outline-none transition-all duration-300 relative cursor-pointer flex items-center gap-2 ${activeTab === 'election'
                                ? 'text-text-green'
                                : 'text-gray-300 hover:text-text-green/60'
                                }`}
                        >
                            <FiShield className="size-3.5" />
                            Parameter E-Voting
                            {activeTab === 'election' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-green rounded-full animate-in fade-in duration-300" />
                            )}
                        </button>
                    </div>

                    {/* Tab Contents */}
                    <div className="pt-2">
                        {isLoading ? (
                            <div className="space-y-6 animate-pulse py-4 text-left">
                                <div className="h-4 bg-slate-200 rounded-md w-1/4 mb-4"></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <div className="h-3 bg-slate-200 rounded-md w-1/4"></div>
                                        <div className="h-10 bg-slate-100 rounded-lg"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                                        <div className="h-10 bg-slate-100 rounded-lg"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                                        <div className="h-10 bg-slate-100 rounded-lg"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                                        <div className="h-10 bg-slate-100 rounded-lg"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                                        <div className="h-10 bg-slate-100 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'profile' && (
                                    <SchoolProfileTab
                                        settings={formData}
                                        onChange={handleFieldChange}
                                    />
                                )}

                                {activeTab === 'election' && (
                                    <ElectionRulesTab
                                        settings={formData}
                                        onChange={handleFieldChange}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Save Action Footer */}
                    <div className="pt-4 border-t border-gray-150 flex items-center justify-end gap-3">
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-xs font-black bg-text-green hover:bg-text-green/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider inline-flex items-center gap-2 active:scale-95"
                        >
                            <FiSave className="size-3.5" />
                            Simpan Perubahan
                        </button>
                    </div>
                </form>

                {/* Security Info Tips Box */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 text-left shadow-xs mt-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <FiInfo className="size-3.5 text-amber-500" />
                        💡 Petunjuk Pengoperasian Pemilu
                    </h4>
                    <ul className="text-[10px] text-gray-500 space-y-1.5 leading-relaxed">
                        <li>• <strong>Identitas Sekolah & OSIS:</strong> Logo dan nama sekolah Anda digunakan sebagai identitas utama pemilih untuk memastikan keaslian pemilu.</li>
                        <li>• <strong>Logo Organisasi:</strong> Anda dapat mengunggah file Logo OSIS atau Logo MPK yang akan ditampilkan di portal bilik suara siswa dan pratinjau kartu.</li>
                        <li>• <strong>Status Pemilihan:</strong> Pastikan untuk mengaktifkan status menjadi <em>"Sedang Berjalan"</em> saat waktu pemilihan tiba agar portal bilik suara dibuka.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}