import React from 'react';
import type { SchoolSettings } from '../types';
import { FiPhone, FiMapPin, FiAward } from 'react-icons/fi';

interface MiniCardPreviewProps {
    settings: SchoolSettings;
}

export const MiniCardPreview: React.FC<MiniCardPreviewProps> = ({ settings }) => {
    const themeColor = settings.cardThemeColor || '#059669';

    return (
        <div className="bg-slate-50 border border-gray-150 rounded-xl p-4 sticky top-24 w-full">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FiAward className="size-3.5 text-emerald-600 animate-pulse" />
                Live Preview Kartu Akses Pemilih
            </h3>

            {/* Front Card Design Container */}
            <div 
                className="relative w-full aspect-[1.586/1] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden text-left flex flex-col justify-between"
                style={{ borderTop: `6px solid ${themeColor}` }}
            >
                {/* Accent Watermark Circle */}
                <div 
                    className="absolute -right-16 -top-16 w-36 h-36 rounded-full opacity-5 pointer-events-none"
                    style={{ backgroundColor: themeColor }}
                />

                {/* Card Header */}
                <div className="p-3 border-b border-gray-50 flex items-center gap-2">
                    {settings.schoolLogo ? (
                        <img 
                            src={settings.schoolLogo} 
                            alt="Logo Sekolah" 
                            className="w-8 h-8 object-contain rounded"
                        />
                    ) : (
                        <div 
                            className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-black uppercase"
                            style={{ backgroundColor: themeColor }}
                        >
                            {settings.schoolAcronym ? settings.schoolAcronym.substring(0, 3) : 'SCH'}
                        </div>
                    )}
                    <div className="min-w-0">
                        <h4 className="text-[9px] font-black text-gray-800 uppercase tracking-tight truncate leading-tight">
                            KARTU AKSES PEMILIH
                        </h4>
                        <p className="text-[7px] text-emerald-600 font-black uppercase truncate leading-none mt-0.5">
                            PEMILU {settings.organizationName || 'OSIS'} - {settings.schoolAcronym || 'SEKOLAH'}
                        </p>
                    </div>
                </div>

                {/* Card Body */}
                <div className="px-3 flex-1 flex gap-3 items-center py-1">
                    {/* Dummy Photo Portrait Placeholder */}
                    <div className="w-14 h-18 rounded border border-gray-150 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mt-2" />
                        <div className="w-10 h-6 bg-gray-200 rounded-t-lg mt-1" />
                        <div className="absolute inset-x-0 bottom-0 bg-emerald-50 text-[6px] text-emerald-700 font-black text-center py-0.5 border-t border-gray-150">
                            FOTO PEMILIH
                        </div>
                    </div>

                    {/* Student Info Dummy Fields */}
                    <div className="flex-1 min-w-0 space-y-1">
                        <div>
                            <span className="block text-[5px] text-gray-400 font-black uppercase tracking-wider leading-none">NAMA PEMILIH</span>
                            <span className="text-[9px] font-black text-gray-700 leading-tight">MOHAMMAD RIZKY</span>
                        </div>
                        <div>
                            <span className="block text-[5px] text-gray-400 font-black uppercase tracking-wider leading-none">KELAS / USERNAME (NISN)</span>
                            <span className="text-[8px] font-bold text-gray-600 leading-none">XII RPL 1 / 0076543210</span>
                        </div>
                        <div>
                            <span className="block text-[5px] text-gray-400 font-black uppercase tracking-wider leading-none">KODE PIN AKSES (PASSWORD)</span>
                            <span className="text-[8px] font-mono font-bold text-emerald-600 leading-none tracking-widest">•••••• (12345)</span>
                        </div>
                    </div>
                </div>

                {/* Card Footer / Signature Area */}
                <div className="px-3 py-1.5 bg-slate-50 border-t border-gray-50 flex items-center justify-between relative overflow-hidden">
                    <div className="text-[5px] text-gray-400 font-semibold space-y-0.5 leading-none">
                        <div className="flex items-center gap-1"><FiMapPin className="size-1.5" /> NPSN: {settings.npsn || '20103284'}</div>
                        <div className="flex items-center gap-1"><FiPhone className="size-1.5" /> {settings.phone || '(021) 3813635'}</div>
                    </div>

                    {/* Headmaster Signature & Stamp Container */}
                    <div className="text-right relative min-w-[70px] leading-none pr-1">
                        <span className="block text-[5px] text-gray-400 font-black uppercase">Kepala Sekolah</span>
                        
                        {/* Stamp & Signature Overlapping Area */}
                        <div className="h-6 w-16 relative mx-auto my-0.5 flex items-center justify-center">
                            {/* Stamp Background */}
                            {settings.stampImage && (
                                <img 
                                    src={settings.stampImage} 
                                    alt="Stempel" 
                                    className="absolute left-0 w-6 h-6 object-contain opacity-70 z-10 pointer-events-none transform rotate-3"
                                />
                            )}
                            
                            {/* Signature Foreground */}
                            {settings.signatureImage && (
                                <img 
                                    src={settings.signatureImage} 
                                    alt="Tanda Tangan" 
                                    className="absolute w-12 h-6 object-contain z-20 pointer-events-none"
                                />
                            )}
                        </div>

                        <span className="block text-[6px] font-black text-gray-800 underline truncate">
                            {settings.headmasterName || 'NAMA KEPALA SEKOLAH'}
                        </span>
                        <span className="block text-[5px] text-gray-400 mt-0.5">
                            NIP: {settings.headmasterNip || '-'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Back Card Preview */}
            <div className="mt-4 border-t border-gray-150 pt-3">
                <div 
                    className="w-full aspect-[1.586/1] bg-white rounded-xl shadow border border-gray-100 p-3 overflow-hidden text-left flex flex-col justify-between"
                    style={{ borderBottom: `6px solid ${themeColor}` }}
                >
                    <div className="border-b border-gray-50 pb-1.5 text-center">
                        <h4 className="text-[8px] font-black text-gray-800 uppercase tracking-tight">TATA TERTIB E-VOTING PEMILU</h4>
                    </div>
                    <ol className="text-[6px] text-gray-500 space-y-0.5 list-decimal pl-3 font-semibold leading-relaxed">
                        <li>Kartu Akses ini bersifat rahasia dan pribadi.</li>
                        <li>Gunakan Username (NISN) & PIN tertera untuk login ke bilik suara.</li>
                        <li>Satu Akun Hak Suara hanya dapat digunakan 1 (satu) kali.</li>
                        <li>Jagalah kerahasiaan Kode PIN Akses demi kelancaran Pemilu {settings.organizationName || 'OSIS'}.</li>
                    </ol>
                    <div className="text-center pt-1 text-[5px] text-gray-400 font-bold border-t border-gray-50">
                        {settings.schoolName || 'Nama Sekolah Lengkap'}
                    </div>
                </div>
            </div>
        </div>
    );
};
