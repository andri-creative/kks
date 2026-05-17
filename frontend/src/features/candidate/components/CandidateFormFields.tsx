import React from 'react';
import { Link } from '@tanstack/react-router';
import { TiptapEditor } from './TiptapEditor';
import { isPlaceholderImage } from '../utils/candidateUtils';
import { FiSave } from 'react-icons/fi';

interface CandidateFormFieldsProps {
    name: string;
    setName: (v: string) => void;
    kelas: string;
    setKelas: (v: string) => void;
    nisn: string;
    setNisn: (v: string) => void;
    image: string;
    setImage: (v: string) => void;
    status: 'active' | 'inactive';
    setStatus: (v: 'active' | 'inactive') => void;
    visi: string;
    setVisi: (v: string) => void;
    misi: string;
    setMisi: (v: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveImage: () => void;
}

export const CandidateFormFields: React.FC<CandidateFormFieldsProps> = ({
    name,
    setName,
    kelas,
    setKelas,
    nisn,
    setNisn,
    image,
    status,
    setStatus,
    visi,
    setVisi,
    misi,
    setMisi,
    handleSubmit,
    handleImageChange,
    handleRemoveImage
}) => {
    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-md p-6 space-y-5 text-left w-full">
            <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                Informasi Utama Kandidat
            </h2>

            {/* Grid Name & Class */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                    <input 
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                        placeholder="Contoh: Jamet Santoso"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Kelas</label>
                    <input 
                        type="text"
                        required
                        value={kelas}
                        onChange={e => setKelas(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all"
                        placeholder="Contoh: XI RPL 1"
                    />
                </div>
            </div>

            {/* Grid NISN & Status */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">NISN / Nomor Induk</label>
                    <input 
                        type="text"
                        required
                        value={nisn}
                        onChange={e => setNisn(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all font-mono"
                        placeholder="Contoh: 0987654321"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Status Keaktifan</label>
                    <select 
                        value={status}
                        onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-gray-250 bg-white text-gray-700 focus:outline-none focus:border-text-green focus:ring-1 focus:ring-text-green transition-all cursor-pointer font-bold"
                    >
                        <option value="active">AKTIF</option>
                        <option value="inactive">NONAKTIF</option>
                    </select>
                </div>
            </div>

            {/* Upload Foto Kandidat */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Upload Foto Kandidat</span>
                    <span className="text-[8px] font-medium text-emerald-600 tracking-normal lowercase">PNG, JPG, JPEG (Maks 2.5MB)</span>
                </label>
                
                {image && !isPlaceholderImage(image) ? (
                    // Image Selected State
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-gray-200 rounded-lg">
                        <img 
                            src={image} 
                            alt="Preview Terpilih" 
                            className="w-12 h-16 object-cover rounded border border-gray-200 shadow-xs bg-gray-100"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black text-gray-700 truncate">Foto Kandidat Terunggah</p>
                            <p className="text-[8px] text-emerald-600 font-medium lowercase mt-0.5">Tersimpan secara lokal & siap pakai</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="px-3 py-1.5 text-[9px] font-black text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-md transition-all cursor-pointer uppercase tracking-wider"
                        >
                            Hapus
                        </button>
                    </div>
                ) : (
                    // Click-to-Upload Empty State
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-250 hover:border-text-green rounded-lg p-5 bg-slate-50/50 hover:bg-emerald-50/10 cursor-pointer transition-all group">
                        <svg className="w-8 h-8 text-gray-400 group-hover:text-text-green mb-1.5 transition-colors stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <span className="text-[10px] font-black text-gray-600 group-hover:text-text-green transition-colors">
                            Pilih / Upload Foto Kandidat
                        </span>
                        <span className="text-[8px] text-gray-400 mt-1 uppercase tracking-wider">
                            Klik untuk menelusuri file komputer Anda
                        </span>
                        <input 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={handleImageChange}
                        />
                    </label>
                )}
            </div>

            <h2 className="text-xs font-black text-text-green uppercase tracking-wider border-b border-gray-100 pb-2 pt-2 mb-4">
                Visi & Misi (Format WYSIWYG Tiptap)
            </h2>

            {/* Visi */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Visi</span>
                    <span className="text-[8px] font-medium text-emerald-600 tracking-normal lowercase">Blok teks lalu klik format untuk membuat daftar/list</span>
                </label>
                <TiptapEditor 
                    value={visi}
                    onChange={setVisi}
                    placeholder="Tulis visi kandidat..."
                />
            </div>

            {/* Misi */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Misi</span>
                    <span className="text-[8px] font-medium text-emerald-600 tracking-normal lowercase">Blok teks lalu klik format untuk membuat daftar/list</span>
                </label>
                <TiptapEditor 
                    value={misi}
                    onChange={setMisi}
                    placeholder="Tulis misi kandidat..."
                />
            </div>

            {/* Save & Cancel Actions */}
            <div className="pt-4 border-t border-gray-150 flex items-center justify-end gap-3">
                <Link 
                    to="/candidate"
                    className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                >
                    Batal
                </Link>
                <button 
                    type="submit"
                    className="px-6 py-2.5 text-xs font-black bg-text-green hover:bg-text-green/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider inline-flex items-center gap-2"
                >
                    <FiSave className="size-3.5" />
                    Simpan Kandidat
                </button>
            </div>
        </form>
    );
};
