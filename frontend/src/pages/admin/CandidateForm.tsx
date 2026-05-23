import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '@tanstack/react-router';
import type { Candidates } from '../../features/candidate/types';
import { useCandidate } from '../../features/candidate/hooks/useCandidate';
import { CandidateFormFields } from '../../features/candidate/components/CandidateFormFields';
import { CandidatePreviewPanel } from '../../features/candidate/components/CandidatePreviewPanel';
import { FiArrowLeft } from 'react-icons/fi';

export default function AdminCandidateForm() {
    const router = useRouter();
    const searchParams = new URLSearchParams(router.state.location.search);
    const candidateId = searchParams.get('id');

    // Central candidate hook
    const { candidateList, addCandidate, updateCandidate } = useCandidate();

    // Form fields state
    const [name, setName] = useState('');
    const [kelas, setKelas] = useState('');
    const [nisn, setNisn] = useState('');
    const [image, setImage] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [visi, setVisi] = useState('');
    const [misi, setMisi] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate size (max 2.5MB to keep base64 localStorage storage lightweight)
            if (file.size > 2500000) {
                alert('Ukuran foto terlalu besar! Maksimal ukuran foto adalah 2.5 MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string); // base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage('');
    };

    const isEditMode = !!candidateId;

    // Load data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const current = candidateList.find(c => c.id === Number(candidateId));
            if (current) {
                setName(current.name);
                setKelas(current.kelas);
                setNisn(current.nisn);
                setImage(current.image);
                setStatus(current.status as 'active' | 'inactive');
                setVisi(current.visi);
                setMisi(current.misi);
            }
        }
    }, [candidateId, isEditMode, candidateList]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            name,
            kelas,
            nisn,
            image: image || 'https://placehold.co/400x600',
            status,
            visi: visi || '<p>-</p>',
            misi: misi || '<p>-</p>',
        };

        try {
            if (isEditMode) {
                await updateCandidate(Number(candidateId), formData);
            } else {
                await addCandidate(formData);
            }
            router.navigate({ to: '/candidate' });
        } catch (error: any) {
            console.error('Failed to submit candidate data:', error);
            alert(error.message || 'Terjadi kesalahan saat menyimpan data kandidat.');
        }
    };

    // Live preview candidate object mapping
    const previewCandidate: Candidates = {
        id: candidateId ? Number(candidateId) : 999,
        name: name || 'Nama Lengkap Kandidat',
        kelas: kelas || 'KELAS',
        nisn: nisn || '0000000000',
        code: '12345',
        role: 'siswa',
        status: status,
        image: image || 'https://placehold.co/400x600',
        visi: visi || '<ol><li>Visi pertama kandidat...</li><li>Visi kedua kandidat...</li></ol>',
        misi: misi || '<ol><li>Misi pertama kandidat...</li><li>Misi kedua kandidat...</li></ol>',
        created_at: '',
        updated_at: ''
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/30 overflow-y-auto pb-10">
            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-1 pb-4 border-b border-gray-100 px-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link 
                            to="/candidate"
                            className="w-9 h-9 rounded-lg border border-gray-150 flex items-center justify-center text-gray-400 hover:text-text-green hover:bg-gray-50 transition-colors"
                        >
                            <FiArrowLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl text-text-green font-black tracking-tight">
                                {isEditMode ? 'Edit Data Kandidat' : 'Tambah Kandidat Baru'}
                            </h1>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Formulir Pengisian & Live Preview Real-time
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="px-6 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Side: Interactive Form Fields Component */}
                <CandidateFormFields
                    name={name}
                    setName={setName}
                    kelas={kelas}
                    setKelas={setKelas}
                    nisn={nisn}
                    setNisn={setNisn}
                    image={image}
                    setImage={setImage}
                    status={status}
                    setStatus={setStatus}
                    visi={visi}
                    setVisi={setVisi}
                    misi={misi}
                    setMisi={setMisi}
                    handleSubmit={handleSubmit}
                    handleImageChange={handleImageChange}
                    handleRemoveImage={handleRemoveImage}
                />

                {/* Right Side: Sticky Live Preview Panel Component */}
                <CandidatePreviewPanel
                    previewCandidate={previewCandidate}
                    index={candidateId ? Number(candidateId) - 1 : candidateList.length}
                />
            </div>
        </div>
    );
}
