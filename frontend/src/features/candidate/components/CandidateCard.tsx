import React, { useState } from 'react';
import type { Candidates } from '../types';
import { isPlaceholderImage } from '../utils/candidateUtils';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FiSettings, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Link } from '@tanstack/react-router';

export interface CandidateCardProps {
    candidate: Candidates;
    index: number;
    onDelete?: (id: number) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
    candidate,
    index,
    onDelete
}) => {
    const [activeTab, setActiveTab] = useState<'visi' | 'misi'>('visi');
    const formattedNo = String(index + 1).padStart(2, '0');

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-row group hover:-translate-y-1">
            {/* Left Side: Vertical Portrait Photo (Preserves standing view & face without cropping) */}
            <div className="relative w-32 sm:w-36 shrink-0 overflow-hidden bg-gray-50 border-r border-gray-150 flex items-center justify-center">
                {candidate.image && !isPlaceholderImage(candidate.image) ? (
                    <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-emerald-500/10 via-emerald-600/15 to-teal-700/20 flex flex-col items-center justify-center p-4 text-center group-hover:scale-105 transition-transform duration-500 select-none">
                        {/* High-end SVG avatar silhouette */}
                        <svg className="w-12 h-12 text-text-green/50 mb-2 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <span className="text-[8px] font-black text-text-green/60 uppercase tracking-widest leading-none">Pas Foto</span>
                        <span className="text-[6px] text-emerald-600/50 mt-1 font-medium tracking-normal lowercase">Kandidat</span>
                    </div>
                )}

                {/* Gentle overlay for badge contrast */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Candidate Number Badge (Floating Top Left) */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-text-green text-[8px] font-black px-2 py-1 rounded shadow-xs border border-gray-100 uppercase tracking-wider">
                    #{formattedNo}
                </div>
            </div>

            {/* Right Side: Details Section */}
            <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                <div>
                    {/* Class, Name & Actions */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[8px] font-black bg-emerald-50 text-text-green px-2.5 py-0.5 rounded border border-emerald-100/50 uppercase tracking-wider">
                                    {candidate.kelas}
                                </span>
                                <span className="text-[8px] font-mono font-bold bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100 uppercase tracking-wider">
                                    NIS: {candidate.nisn}
                                </span>
                            </div>
                            <h2 className="text-sm font-black mt-1 text-text-green tracking-tight truncate uppercase leading-tight" title={candidate.name}>
                                {candidate.name}
                            </h2>
                        </div>

                        {/* Action Menu (Gear Icon Dropdown) - Only rendered if onDelete callback is provided (hides on preview card) */}
                        {onDelete && (
                            <div className="relative shrink-0">
                                <Menu>
                                    <MenuButton className="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-text-green border border-gray-150 transition-colors cursor-pointer focus:outline-none">
                                        <FiSettings className="size-3.5" />
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        anchor="bottom end"
                                        className="w-24 origin-top-right rounded-xl border border-gray-100 bg-white p-1 text-[10px] text-gray-700 shadow-xl transition duration-100 ease-out [--anchor-gap:6px] focus:outline-none data-closed:scale-95 data-closed:opacity-0 z-50"
                                    >
                                        <MenuItem>
                                            <Link 
                                                to="/candidate/form"
                                                search={{ id: candidate.id.toString() }}
                                                className="group flex w-full items-center gap-2 rounded-lg px-2 py-1 hover:bg-emerald-50 hover:text-text-green transition-colors cursor-pointer text-left font-semibold text-gray-700"
                                            >
                                                <FiEdit className="size-3 text-gray-400 group-hover:text-text-green" />
                                                Edit
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <button 
                                                onClick={() => onDelete(candidate.id)}
                                                className="group flex w-full items-center gap-2 rounded-lg px-2 py-1 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer text-left font-semibold text-gray-700"
                                            >
                                                <FiTrash2 className="size-3 text-gray-400 group-hover:text-rose-600" />
                                                Delete
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </div>
                        )}
                    </div>

                    {/* Visi & Misi Tab Controls */}
                    <div className="flex bg-gray-100 p-0.5 rounded-lg gap-0.5 mb-2.5">
                        <button
                            type="button"
                            onClick={() => setActiveTab('visi')}
                            className={`flex-1 text-center py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'visi'
                                ? 'bg-white text-text-green shadow-xs'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            Visi
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('misi')}
                            className={`flex-1 text-center py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'misi'
                                ? 'bg-white text-text-green shadow-xs'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            Misi
                        </button>
                    </div>
                </div>

                {/* HTML content rendering safely */}
                <div className="flex-1 flex flex-col bg-slate-50/50 p-2 rounded-lg border border-dashed border-gray-200 min-h-[90px] justify-start overflow-hidden">
                    <div
                        className="text-[10px] text-gray-600 leading-relaxed overflow-y-auto max-h-[105px] pr-1 scrollbar-thin candidate-visi-misi-content [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5 font-medium text-left"
                        dangerouslySetInnerHTML={{
                            __html: activeTab === 'visi' ? (candidate.visi || 'Visi belum dicantumkan.') : (candidate.misi || 'Misi belum dicantumkan.')
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
