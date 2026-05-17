import React, { useState, useEffect } from 'react';
import type { Candidates } from '@/data/User';

interface CandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Candidates, 'id' | 'code' | 'role' | 'created_at' | 'updated_at'>) => void;
    candidate?: Candidates | null;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    candidate
}) => {
    const [name, setName] = useState('');
    const [kelas, setKelas] = useState('');
    const [nisn, setNisn] = useState('');
    const [image, setImage] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [visi, setVisi] = useState('');
    const [misi, setMisi] = useState('');

    useEffect(() => {
        if (candidate) {
            setName(candidate.name);
            setKelas(candidate.kelas);
            setNisn(candidate.nisn);
            setImage(candidate.image);
            setStatus(candidate.status as 'active' | 'inactive');
            setVisi(candidate.visi);
            setMisi(candidate.misi);
        } else {
            setName('');
            setKelas('');
            setNisn('');
            setImage('');
            setStatus('active');
            setVisi('');
            setMisi('');
        }
    }, [candidate, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            kelas,
            nisn,
            image: image || 'https://placehold.co/400x600',
            status,
            visi,
            misi
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h3 className="text-base font-black text-text-green uppercase tracking-wide">
                            {candidate ? 'Ubah Data Kandidat' : 'Tambah Kandidat Baru'}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            {candidate ? 'Ubah informasi visi & misi kandidat terpilih' : 'Formulir data kandidat ketua OSIS/Ketua kelas'}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left custom-scrollbar">
                    {/* Grid Name & Class */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                            <input 
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                                placeholder="Masukkan nama"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Kelas</label>
                            <input 
                                type="text"
                                required
                                value={kelas}
                                onChange={e => setKelas(e.target.value)}
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                                placeholder="Contoh: XI RPL 1"
                            />
                        </div>
                    </div>

                    {/* Grid NIS & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">NISN / Nomor Induk</label>
                            <input 
                                type="text"
                                required
                                value={nisn}
                                onChange={e => setNisn(e.target.value)}
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all font-mono"
                                placeholder="Contoh: 0987654321"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Status Keaktifan</label>
                            <select 
                                value={status}
                                onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all cursor-pointer font-bold"
                            >
                                <option value="active">AKTIF</option>
                                <option value="inactive">NONAKTIF</option>
                            </select>
                        </div>
                    </div>

                    {/* Foto URL */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Foto Portrait URL</label>
                        <input 
                            type="text"
                            value={image}
                            onChange={e => setImage(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                            placeholder="Contoh: https://domain.com/foto.jpg"
                        />
                    </div>

                    {/* Visi */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>Visi (Dukungan Tag HTML)</span>
                            <span className="text-[8px] font-medium text-emerald-600 tracking-normal lowercase">contoh: &lt;ol&gt;&lt;li&gt;visi satu&lt;/li&gt;&lt;/ol&gt;</span>
                        </label>
                        <textarea 
                            rows={3}
                            required
                            value={visi}
                            onChange={e => setVisi(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all font-mono leading-relaxed"
                            placeholder="Tulis visi kandidat..."
                        />
                    </div>

                    {/* Misi */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>Misi (Dukungan Tag HTML)</span>
                            <span className="text-[8px] font-medium text-emerald-600 tracking-normal lowercase">contoh: &lt;ol&gt;&lt;li&gt;misi satu&lt;/li&gt;&lt;/ol&gt;</span>
                        </label>
                        <textarea 
                            rows={3}
                            required
                            value={misi}
                            onChange={e => setMisi(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all font-mono leading-relaxed"
                            placeholder="Tulis misi kandidat..."
                        />
                    </div>
                </form>

                {/* Footer Buttons */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-150 flex items-center justify-end gap-3">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                    >
                        Batal
                    </button>
                    <button 
                        type="submit"
                        onClick={handleSubmit}
                        className="px-5 py-2 text-xs font-black bg-text-green hover:bg-text-green/90 text-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider"
                    >
                        {candidate ? 'Simpan Perubahan' : 'Simpan Baru'}
                    </button>
                </div>
            </div>
        </div>
    );
};
