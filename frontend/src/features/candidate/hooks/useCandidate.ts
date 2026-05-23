import { useState, useEffect, useCallback } from 'react';
import type { Candidates } from '../types';
import { fetchCandidates, createCandidate, updateCandidateApi, deleteCandidateApi } from '../api/candidateApi';

export function useCandidate() {
    const [candidateList, setCandidateList] = useState<Candidates[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const loadCandidates = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const data = await fetchCandidates();
            const mapped = data.map((c: any) => ({
                ...c,
                created_at: c.createdAt || c.created_at,
                updated_at: c.updatedAt || c.updated_at
            }));
            // Urutkan berdasarkan nomor urut kandidat 'no' secara menaik (ascending)
            mapped.sort((a: any, b: any) => (a.no || 0) - (b.no || 0));
            setCandidateList(mapped);
        } catch (err: any) {
            console.error('Failed to load candidates:', err);
            setError(err.message || 'Gagal mengambil data kandidat.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCandidates();
    }, [loadCandidates]);

    /**
     * Menambahkan kandidat baru ke backend
     */
    const addCandidate = async (formData: Omit<Candidates, 'id' | 'code' | 'role' | 'created_at' | 'updated_at'>) => {
        setIsLoading(true);
        setError("");
        try {
            // Kalkulasi otomatis nomor urut kandidat selanjutnya
            const nextNo = candidateList.length > 0 
                ? Math.max(...candidateList.map(c => c.no || 0)) + 1 
                : 1;

            const payload = {
                ...formData,
                no: nextNo,
                status: formData.status === 'active' || formData.status === 'Active' ? 'Active' : 'Inactive',
            };

            const data = await createCandidate(payload as any);
            await loadCandidates();
            return data;
        } catch (err: any) {
            console.error('Failed to add candidate:', err);
            const errMsg = err.message || 'Gagal menambahkan kandidat.';
            setError(errMsg);
            throw new Error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Memperbarui kandidat yang ada berdasarkan ID
     */
    const updateCandidate = async (id: number, formData: Omit<Candidates, 'id' | 'code' | 'role' | 'created_at' | 'updated_at'>) => {
        setIsLoading(true);
        setError("");
        try {
            // Ambil data kandidat lama untuk mempertahankan nomor urut 'no'
            const existing = candidateList.find(c => c.id === id);
            const currentNo = existing ? existing.no : 1;

            const payload = {
                ...formData,
                no: currentNo,
                status: formData.status === 'active' || formData.status === 'Active' ? 'Active' : 'Inactive',
            };

            await updateCandidateApi(id, payload as any);
            await loadCandidates();
        } catch (err: any) {
            console.error('Failed to update candidate:', err);
            const errMsg = err.message || 'Gagal memperbarui data kandidat.';
            setError(errMsg);
            throw new Error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Menghapus kandidat berdasarkan ID
     */
    const deleteCandidate = async (id: number) => {
        setIsLoading(true);
        setError("");
        try {
            await deleteCandidateApi(id);
            await loadCandidates();
        } catch (err: any) {
            console.error('Failed to delete candidate:', err);
            const errMsg = err.message || 'Gagal menghapus kandidat.';
            setError(errMsg);
            throw new Error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        candidateList,
        isLoading,
        error,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        refresh: loadCandidates
    };
}
