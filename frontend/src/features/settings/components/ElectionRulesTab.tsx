import React from 'react';
import type { SchoolSettings } from '../types';
import { FiPlay, FiStopCircle, FiInfo, FiClock } from 'react-icons/fi';

interface ElectionRulesTabProps {
    settings: SchoolSettings;
    onChange: (fields: Partial<SchoolSettings>) => void;
}

export const ElectionRulesTab: React.FC<ElectionRulesTabProps> = ({ settings, onChange }) => {
    const presets = [60, 120, 180, 300];
    const [isCustomMode, setIsCustomMode] = React.useState(() => {
        const currentDuration = settings.timerDuration || 300;
        return !presets.includes(currentDuration);
    });

    return (
        <div className="space-y-5 text-left">
            <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                Parameter & Regulasi E-Voting
            </h2>

            {/* Grid Org name & Academic Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Nama Organisasi Pemilihan</label>
                    <input 
                        type="text"
                        required
                        value={settings.organizationName}
                        onChange={e => onChange({ organizationName: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                        placeholder="Contoh: OSIS, MPK, Pramuka"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Tahun Ajaran / Periode</label>
                    <input 
                        type="text"
                        required
                        value={settings.academicYear}
                        onChange={e => onChange({ academicYear: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all font-mono"
                        placeholder="Contoh: 2026/2027"
                    />
                </div>
            </div>

            {/* Election Status Pills */}
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5">Status Pemilihan Berjalan</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Not started */}
                    <button
                        type="button"
                        onClick={() => onChange({ electionStatus: 'not_started' })}
                        className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            settings.electionStatus === 'not_started'
                                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                                : 'bg-white border-gray-150 text-gray-500 hover:bg-slate-50'
                        }`}
                    >
                        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
                            <FiInfo className={`size-3.5 ${settings.electionStatus === 'not_started' ? 'text-amber-600' : 'text-gray-400'}`} />
                            Belum Dimulai
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold mt-1 leading-normal">
                            Portal e-voting ditutup, halaman info visi-misi kandidat tetap terbuka.
                        </span>
                    </button>

                    {/* Ongoing */}
                    <button
                        type="button"
                        onClick={() => onChange({ electionStatus: 'ongoing' })}
                        className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            settings.electionStatus === 'ongoing'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                                : 'bg-white border-gray-150 text-gray-500 hover:bg-slate-50'
                        }`}
                    >
                        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
                            <FiPlay className={`size-3.5 animate-pulse ${settings.electionStatus === 'ongoing' ? 'text-emerald-600' : 'text-gray-400'}`} />
                            Sedang Berjalan
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold mt-1 leading-normal">
                            Portal e-voting aktif dibuka, pemilih dapat masuk dan menyalurkan hak suara.
                        </span>
                    </button>

                    {/* Closed */}
                    <button
                        type="button"
                        onClick={() => onChange({ electionStatus: 'closed' })}
                        className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            settings.electionStatus === 'closed'
                                ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                                : 'bg-white border-gray-150 text-gray-500 hover:bg-slate-50'
                        }`}
                    >
                        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
                            <FiStopCircle className={`size-3.5 ${settings.electionStatus === 'closed' ? 'text-rose-600' : 'text-gray-400'}`} />
                            Telah Ditutup
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold mt-1 leading-normal">
                            Pemilihan resmi diakhiri, perolehan hasil rekap suara dikalkulasi & dikunci.
                        </span>
                    </button>
                </div>
            </div>

            {/* Countdown Session Timer Configuration */}
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Batas Waktu Sesi Bilik Suara (Siswa)</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
                    {/* 1 Menit */}
                    <button
                        type="button"
                        onClick={() => {
                            setIsCustomMode(false);
                            onChange({ timerDuration: 60 });
                        }}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                            !isCustomMode && settings.timerDuration === 60
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                                : 'bg-white border-gray-150 text-gray-500 hover:bg-slate-50'
                        }`}
                    >
                        <span className="text-xs font-black uppercase tracking-wider">1 Menit</span>
                        <span className="text-[8px] text-gray-400 font-bold mt-0.5">(60 Detik)</span>
                    </button>

                    {/* 2 Menit */}
                    <button
                        type="button"
                        onClick={() => {
                            setIsCustomMode(false);
                            onChange({ timerDuration: 120 });
                        }}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                            !isCustomMode && settings.timerDuration === 120
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                                : 'bg-white border-gray-150 text-gray-500 hover:bg-slate-50'
                        }`}
                    >
                        <span className="text-xs font-black uppercase tracking-wider">2 Menit</span>
                        <span className="text-[8px] text-gray-400 font-bold mt-0.5">(120 Detik)</span>
                    </button>

                    {/* 3 Menit */}
                    <button
                        type="button"
                        onClick={() => {
                            setIsCustomMode(false);
                            onChange({ timerDuration: 180 });
                        }}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                            !isCustomMode && settings.timerDuration === 180
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                                : 'bg-white border-gray-150 text-gray-500 hover:bg-slate-50'
                        }`}
                    >
                        <span className="text-xs font-black uppercase tracking-wider">3 Menit</span>
                        <span className="text-[8px] text-gray-400 font-bold mt-0.5">(180 Detik)</span>
                    </button>

                    {/* 5 Menit (Default) */}
                    <button
                        type="button"
                        onClick={() => {
                            setIsCustomMode(false);
                            onChange({ timerDuration: 300 });
                        }}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                            !isCustomMode && (settings.timerDuration === 300 || !settings.timerDuration)
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                                : 'bg-white border-gray-150 text-gray-500 hover:bg-slate-50'
                        }`}
                    >
                        <span className="text-xs font-black uppercase tracking-wider">5 Menit</span>
                        <span className="text-[8px] text-gray-400 font-bold mt-0.5">(300 Detik - Bawaan)</span>
                    </button>

                    {/* Custom Option */}
                    <button
                        type="button"
                        onClick={() => {
                            setIsCustomMode(true);
                            if (!settings.timerDuration) {
                                onChange({ timerDuration: 300 });
                            }
                        }}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isCustomMode
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                                : 'bg-white border-gray-150 text-gray-500 hover:bg-slate-50'
                        }`}
                    >
                        <span className="text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
                            Kustom...
                        </span>
                        <span className="text-[8px] text-gray-400 font-bold mt-0.5">(Atur Sendiri)</span>
                    </button>
                </div>

                {/* Custom Time Input Field */}
                {isCustomMode && (
                    <div className="bg-slate-50/50 border border-gray-150 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200 mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <FiClock className="size-3.5 text-emerald-600" />
                            </div>
                            <div>
                                <span className="block text-[11px] font-black text-gray-700 uppercase tracking-wider">Durasi Kustom Aktif</span>
                                <span className="block text-[8px] text-gray-400 font-bold uppercase mt-0.5">Sesi diatur dalam menit secara dinamis</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={Math.round((settings.timerDuration || 300) / 60)}
                                onChange={e => {
                                    const mins = Math.max(1, parseInt(e.target.value) || 1);
                                    onChange({ timerDuration: mins * 60 });
                                }}
                                className="w-24 text-xs font-bold font-mono px-3 py-2 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green text-center"
                            />
                            <span className="text-xs font-bold text-gray-500">Menit</span>
                            <span className="text-[10px] text-gray-400 font-bold font-mono ml-2">
                                ({settings.timerDuration || 300} Detik)
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Authentication Method */}
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Metode Autentikasi Pemilih</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* NISN only */}
                    <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        settings.authMethod === 'nisn'
                            ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                            : 'bg-white border-gray-150 hover:bg-slate-50/50'
                    }`}>
                        <input 
                            type="radio"
                            name="authMethod"
                            checked={settings.authMethod === 'nisn'}
                            onChange={() => onChange({ authMethod: 'nisn' })}
                            className="mt-1.5 size-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                        />
                        <div className="text-left">
                            <span className="block text-xs font-black text-gray-800 uppercase tracking-wider">Hanya Nomor Induk / NISN</span>
                            <span className="block text-[9px] text-gray-400 font-bold mt-1 leading-relaxed">
                                Autentikasi cepat. Pemilih cukup memasukkan NISN terdaftar untuk masuk bilik suara. Sangat praktis untuk pemilihan cepat.
                            </span>
                        </div>
                    </label>

                    {/* NISN + PIN */}
                    <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        settings.authMethod === 'nisn_pin'
                            ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                            : 'bg-white border-gray-150 hover:bg-slate-50/50'
                    }`}>
                        <input 
                            type="radio"
                            name="authMethod"
                            checked={settings.authMethod === 'nisn_pin'}
                            onChange={() => onChange({ authMethod: 'nisn_pin' })}
                            className="mt-1.5 size-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                        />
                        <div className="text-left">
                            <span className="block text-xs font-black text-gray-800 uppercase tracking-wider">Nomor Induk (NISN) + PIN Keamanan</span>
                            <span className="block text-[9px] text-gray-400 font-bold mt-1 leading-relaxed">
                                Keamanan tinggi. Pemilih wajib memasukkan NISN beserta PIN passcode unik milik pribadi. Mencegah manipulasi login akun suara lain.
                            </span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};
