import React from 'react';
import type { SchoolSettings } from '../types';
import { FiMonitor, FiRefreshCcw } from 'react-icons/fi';

interface UiColorTabProps {
    settings: SchoolSettings;
    onChange: (fields: Partial<SchoolSettings>) => void;
}

const colorFields = [
    { key: '--color-bg', label: 'Background Color', default: '#F0F0F0' },
    { key: '--color-bg2', label: 'Secondary Background', default: '#e3f1f4' },
    { key: '--color-dask', label: 'Dask Color', default: '#0096c7' },
    { key: '--color-primary', label: 'Primary Color', default: '#4F709C' },
    { key: '--color-button', label: 'Button Color', default: '#0766AD' },
    { key: '--color-secondary', label: 'Secondary Color', default: '#19A7CE' },
    { key: '--color-dark', label: 'Dark Color', default: '#212A3E' },
    { key: '--color-success', label: 'Success Color', default: '#12CC94' },
    { key: '--color-danger', label: 'Danger Color', default: '#FA6781' },
    { key: '--color-text-green', label: 'Text Highlight Color', default: '#03045e' },
];

export const UiColorTab: React.FC<UiColorTabProps> = ({ settings, onChange }) => {
    const uiColors = settings.uiColors || {};

    const handleColorChange = (key: string, value: string) => {
        document.documentElement.style.setProperty(key, value);
        onChange({
            uiColors: {
                ...uiColors,
                [key]: value
            }
        });
    };

    const handleResetDefaults = () => {
        const defaultColors: Record<string, string> = {};
        colorFields.forEach(field => {
            defaultColors[field.key] = field.default;
            document.documentElement.style.setProperty(field.key, field.default);
        });

        onChange({
            uiColors: defaultColors
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <FiMonitor className="text-indigo-600 size-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800">Tema Warna UI (UI Colors)</h3>
                        <p className="text-[11px] text-gray-500 font-medium">Ubah kode warna elemen antarmuka aplikasi secara dinamis (live preview).</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                >
                    <FiRefreshCcw className="size-3" />
                    Reset ke Default
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colorFields.map((field) => (
                    <div key={field.key} className="space-y-1.5 p-3 rounded-lg border border-gray-100 bg-slate-50">
                        <label className="text-xs font-bold text-gray-700 block">{field.label}</label>
                        <p className="text-[10px] text-gray-400 font-mono mb-2">{field.key}</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={uiColors[field.key] || field.default}
                                onChange={(e) => handleColorChange(field.key, e.target.value)}
                                className="w-10 h-10 rounded border border-gray-200 cursor-pointer p-0.5 bg-white"
                            />
                            <input
                                type="text"
                                value={uiColors[field.key] || field.default}
                                onChange={(e) => handleColorChange(field.key, e.target.value)}
                                className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-gray-200 rounded-lg outline-none focus:border-text-green transition-all"
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-700 font-medium">
                    <strong>Penting:</strong> Warna akan langsung terlihat perubahannya pada aplikasi Anda, namun ingat untuk menekan tombol "Simpan Perubahan" agar warna tersimpan permanen di sistem.
                </p>
            </div>
        </div>
    );
};
