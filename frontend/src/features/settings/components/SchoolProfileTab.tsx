import React from 'react';
import type { SchoolSettings } from '../types';

interface SchoolProfileTabProps {
    settings: SchoolSettings;
    onChange: (fields: Partial<SchoolSettings>) => void;
}

export const SchoolProfileTab: React.FC<SchoolProfileTabProps> = ({ settings, onChange }) => {
    
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2000000) {
                alert('Ukuran logo terlalu besar! Maksimal ukuran adalah 2 MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange({ schoolLogo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        onChange({ schoolLogo: '' });
    };

    const handleOrgLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2000000) {
                alert('Ukuran logo organisasi terlalu besar! Maksimal ukuran adalah 2 MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange({ organizationLogo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveOrgLogo = () => {
        onChange({ organizationLogo: '' });
    };

    return (
        <div className="space-y-5 text-left">
            <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                Identitas Resmi Sekolah & Organisasi
            </h2>

            {/* Grid School Name & Acronym */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Nama Lengkap Sekolah</label>
                    <input 
                        type="text"
                        required
                        value={settings.schoolName}
                        onChange={e => onChange({ schoolName: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                        placeholder="Contoh: SMK Negeri 1 Jakarta"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Akronim / Singkatan</label>
                    <input 
                        type="text"
                        required
                        value={settings.schoolAcronym}
                        onChange={e => onChange({ schoolAcronym: e.target.value.toUpperCase() })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                        placeholder="Contoh: SMKN 1 JKT"
                    />
                </div>
            </div>

            {/* Grid NPSN & Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">NPSN Sekolah</label>
                    <input 
                        type="text"
                        required
                        value={settings.npsn}
                        onChange={e => onChange({ npsn: e.target.value.replace(/\D/g, '') })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all font-mono"
                        placeholder="Contoh: 20103284"
                        maxLength={8}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 font-sans">No. Telepon Sekolah</label>
                    <input 
                        type="text"
                        required
                        value={settings.phone}
                        onChange={e => onChange({ phone: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                        placeholder="Contoh: (021) 3813635"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Email Resmi</label>
                    <input 
                        type="email"
                        required
                        value={settings.email}
                        onChange={e => onChange({ email: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                        placeholder="Contoh: info@sekolah.sch.id"
                    />
                </div>
            </div>

            {/* Logos Area: School Logo and OSIS Logo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* School Logo */}
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Logo Resmi Sekolah</span>
                        <span className="text-[8px] font-medium text-emerald-600 tracking-normal lowercase">PNG, JPG (Maks 2MB)</span>
                    </label>
                    
                    {settings.schoolLogo ? (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-gray-200 rounded-lg">
                            <img 
                                src={settings.schoolLogo} 
                                alt="Logo Terunggah" 
                                className="w-12 h-12 object-contain rounded bg-white p-1 border border-gray-200 shadow-xs"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black text-gray-700">Logo Sekolah</p>
                                <p className="text-[8px] text-emerald-600 font-medium lowercase mt-0.5">Siap digunakan di sistem</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveLogo}
                                className="px-3 py-1.5 text-[9px] font-black text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-md transition-all cursor-pointer uppercase tracking-wider"
                            >
                                Hapus
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-250 hover:border-text-green rounded-lg p-5 bg-slate-50/50 hover:bg-emerald-50/10 cursor-pointer transition-all group">
                            <svg className="w-8 h-8 text-gray-400 group-hover:text-text-green mb-1.5 transition-colors stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                            </svg>
                            <span className="text-[10px] font-black text-gray-600 group-hover:text-text-green transition-colors">
                                Upload Logo Sekolah
                            </span>
                            <input 
                                type="file" 
                                accept="image/*"
                                className="hidden" 
                                onChange={handleLogoChange}
                            />
                        </label>
                    )}
                </div>

                {/* Organization Logo */}
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Logo Organisasi (OSIS / MPK)</span>
                        <span className="text-[8px] font-medium text-emerald-600 tracking-normal lowercase">PNG, JPG (Maks 2MB)</span>
                    </label>
                    
                    {settings.organizationLogo ? (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-gray-200 rounded-lg">
                            <img 
                                src={settings.organizationLogo} 
                                alt="Logo OSIS" 
                                className="w-12 h-12 object-contain rounded bg-white p-1 border border-gray-200 shadow-xs"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black text-gray-700">Logo Organisasi</p>
                                <p className="text-[8px] text-emerald-600 font-medium lowercase mt-0.5">Siap digunakan di sistem</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveOrgLogo}
                                className="px-3 py-1.5 text-[9px] font-black text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-md transition-all cursor-pointer uppercase tracking-wider"
                            >
                                Hapus
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-250 hover:border-text-green rounded-lg p-5 bg-slate-50/50 hover:bg-emerald-50/10 cursor-pointer transition-all group">
                            <svg className="w-8 h-8 text-gray-400 group-hover:text-text-green mb-1.5 transition-colors stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                            </svg>
                            <span className="text-[10px] font-black text-gray-600 group-hover:text-text-green transition-colors">
                                Upload Logo Organisasi
                            </span>
                            <input 
                                type="file" 
                                accept="image/*"
                                className="hidden" 
                                onChange={handleOrgLogoChange}
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Address */}
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Alamat Fisik Sekolah</label>
                <textarea 
                    required
                    value={settings.address}
                    onChange={e => onChange({ address: e.target.value })}
                    rows={2}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                    placeholder="Tulis alamat lengkap sekolah beserta kota dan provinsi..."
                />
            </div>
        </div>
    );
};
