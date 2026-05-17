import React from 'react';
import { CandidateCard } from './CandidateCard';
import type { Candidates } from '../types';
import { FiEye } from 'react-icons/fi';

interface CandidatePreviewPanelProps {
    previewCandidate: Candidates;
    index: number;
}

export const CandidatePreviewPanel: React.FC<CandidatePreviewPanelProps> = ({
    previewCandidate,
    index
}) => {
    return (
        <div className="lg:sticky lg:top-24 space-y-4 w-full">
            <div className="bg-emerald-50 text-text-green border border-emerald-100 px-4 py-3 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                <FiEye className="size-4 stroke-[2.5px] animate-pulse" />
                Live Preview Kartu Kandidat
            </div>

            {/* Preview Candidate Card Wrapper */}
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CandidateCard 
                    candidate={previewCandidate} 
                    index={index} 
                />
            </div>

            {/* Interactive Help/TIPS Box */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-left shadow-xs">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">💡 Tips & Panduan</h4>
                <ul className="text-[10px] text-gray-500 space-y-1.5 leading-relaxed">
                    <li>• <strong>Visi & Misi:</strong> Gunakan tombol Bullet List atau Ordered List pada toolbar editor di sebelah kiri untuk menyusun butir visi-misi Anda secara otomatis.</li>
                    <li>• <strong>Tab Visi/Misi Card:</strong> Klik tombol tab "Visi" dan "Misi" pada kartu di atas untuk menguji tampilannya secara langsung.</li>
                    <li>• <strong>Upload Foto:</strong> Klik area upload gambar di sebelah kiri untuk mengunggah pas foto asli kandidat dari komputer Anda secara instan.</li>
                </ul>
            </div>
        </div>
    );
};
