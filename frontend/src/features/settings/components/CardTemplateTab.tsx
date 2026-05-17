import React from 'react';
import type { SchoolSettings } from '../types';

interface CardTemplateTabProps {
    settings: SchoolSettings;
    onChange: (fields: Partial<SchoolSettings>) => void;
}

const PRESET_COLORS = [
    { name: 'Hijau (SMK)', value: '#059669' },
    { name: 'Biru (SMA/SMP)', value: '#2563eb' },
    { name: 'Merah (SD)', value: '#dc2626' },
    { name: 'Ungu (Teknologi)', value: '#7c3aed' },
    { name: 'Oranye (Kreatif)', value: '#ea580c' },
    { name: 'Slate (Modern)', value: '#475569' }
];

export const CardTemplateTab: React.FC<CardTemplateTabProps> = ({ settings, onChange }) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'signatureImage' | 'stampImage') => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1500000) {
                alert('Ukuran file terlalu besar! Maksimal ukuran adalah 1.5 MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange({ [field]: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = (field: 'signatureImage' | 'stampImage') => {
        onChange({ [field]: '' });
    };

    return (
        <div className="space-y-5 text-left">
            <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                Konfigurasi Pejabat & Legalitas Kartu
            </h2>

            {/* Grid Headmaster details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Nama Lengkap Kepala Sekolah</label>
                    <input
                        type="text"
                        required
                        value={settings.headmasterName}
                        onChange={e => onChange({ headmasterName: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                        placeholder="Contoh: Drs. H. Mulyanto, M.Pd"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">NIP Kepala Sekolah</label>
                    <input
                        type="text"
                        required
                        value={settings.headmasterNip}
                        onChange={e => onChange({ headmasterNip: e.target.value.replace(/\D/g, '') })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all font-mono"
                        placeholder="Contoh: 196805121993031005"
                        maxLength={18}
                    />
                </div>
            </div>

            {/* Accent Card Theme Color */}
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Warna Aksen Tema Kartu</label>
                <div className="flex flex-wrap items-center gap-3">
                    {/* Custom Color Picker Input */}
                    <div className="flex items-center gap-2 border border-gray-250 rounded-lg px-3 py-1.5 bg-white shrink-0">
                        <input
                            type="color"
                            value={settings.cardThemeColor || '#059669'}
                            onChange={e => onChange({ cardThemeColor: e.target.value })}
                            className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-xs font-mono font-bold text-gray-700 uppercase">
                            {settings.cardThemeColor || '#059669'}
                        </span>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap gap-2">
                        {PRESET_COLORS.map(color => (
                            <button
                                key={color.value}
                                type="button"
                                onClick={() => onChange({ cardThemeColor: color.value })}
                                className={`px-2.5 py-1.5 rounded-md text-[9px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${(settings.cardThemeColor || '#059669').toLowerCase() === color.value.toLowerCase()
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold shadow-xs'
                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.value }} />
                                {color.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid Signature & Stamp Image Uploaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Signature Image */}
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Tanda Tangan Kepala Sekolah</span>
                        <span className="text-[8px] font-medium text-emerald-600 tracking-normal lowercase">PNG Transparan (Maks 1.5MB)</span>
                    </label>

                    {settings.signatureImage ? (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-gray-200 rounded-lg">
                            <img
                                src={settings.signatureImage}
                                alt="TTD Terunggah"
                                className="w-20 h-10 object-contain rounded bg-white p-1 border border-gray-200 shadow-xs"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-black text-gray-700">Tanda Tangan Aktif</p>
                                <p className="text-[8px] text-emerald-600 font-medium lowercase">Muncul pada kop tanda tangan</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveFile('signatureImage')}
                                className="px-2.5 py-1 text-[8px] font-black text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded transition-all cursor-pointer uppercase"
                            >
                                Hapus
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-250 hover:border-text-green rounded-lg p-4 bg-slate-50/50 hover:bg-emerald-50/10 cursor-pointer transition-all group">
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-text-green mb-1 transition-colors stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                            <span className="text-[9px] font-black text-gray-600 group-hover:text-text-green transition-colors">
                                Pilih / Upload TTD (PNG)
                            </span>
                            <input
                                type="file"
                                accept="image/png"
                                className="hidden"
                                onChange={e => handleFileChange(e, 'signatureImage')}
                            />
                        </label>
                    )}
                </div>

                {/* Stamp Image */}
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Stempel Sekolah (Cap Bulat)</span>
                        <span className="text-[8px] font-medium text-emerald-600 tracking-normal lowercase">PNG Transparan (Maks 1.5MB)</span>
                    </label>

                    {settings.stampImage ? (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-gray-200 rounded-lg">
                            <img
                                src={settings.stampImage}
                                alt="Stempel Terunggah"
                                className="w-12 h-12 object-contain rounded bg-white p-1 border border-gray-200 shadow-xs"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-black text-gray-700">Stempel Sekolah Aktif</p>
                                <p className="text-[8px] text-emerald-600 font-medium lowercase">Ditempel berdampingan dengan TTD</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveFile('stampImage')}
                                className="px-2.5 py-1 text-[8px] font-black text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded transition-all cursor-pointer uppercase"
                            >
                                Hapus
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-250 hover:border-text-green rounded-lg p-4 bg-slate-50/50 hover:bg-emerald-50/10 cursor-pointer transition-all group">
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-text-green mb-1 transition-colors stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[9px] font-black text-gray-600 group-hover:text-text-green transition-colors">
                                Pilih / Upload Stempel (PNG)
                            </span>
                            <input
                                type="file"
                                accept="image/png"
                                className="hidden"
                                onChange={e => handleFileChange(e, 'stampImage')}
                            />
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
};
