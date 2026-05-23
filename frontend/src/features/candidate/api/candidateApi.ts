import { api } from "@/config/api";
import { handleApiResponse, handleApiError } from "@/helpers/responseHelper";
import type { Candidates } from "../types";

export const fetchCandidates = async (): Promise<Candidates[]> => {
    try {
        const response = await api.get('/v1/api/candidates');
        return handleApiResponse<Candidates[]>(response, 'Gagal mengambil daftar kandidat');
    } catch (error) {
        return handleApiError(error, 'Gagal mengambil daftar kandidat');
    }
};

export const createCandidate = async (candidateData: Omit<Candidates, 'id' | 'code' | 'role' | 'created_at' | 'updated_at'> & { no: number }): Promise<Candidates> => {
    try {
        const response = await api.post('/v1/api/candidates', candidateData);
        return handleApiResponse<Candidates>(response, 'Gagal mendaftarkan kandidat baru');
    } catch (error) {
        return handleApiError(error, 'Gagal mendaftarkan kandidat baru');
    }
};

export const updateCandidateApi = async (id: number, candidateData: Partial<Candidates>): Promise<Candidates> => {
    try {
        const response = await api.put(`/v1/api/candidates/${id}`, candidateData);
        return handleApiResponse<Candidates>(response, 'Gagal memperbarui data kandidat');
    } catch (error) {
        return handleApiError(error, 'Gagal memperbarui data kandidat');
    }
};

export const deleteCandidateApi = async (id: number): Promise<boolean> => {
    try {
        const response = await api.delete(`/v1/api/candidates/${id}`);
        return handleApiResponse<boolean>(response, 'Gagal menghapus kandidat');
    } catch (error) {
        return handleApiError(error, 'Gagal menghapus kandidat');
    }
};

export const submitVote = async (candidateId: number, timeRemaining: number): Promise<any> => {
    try {
        const response = await api.post('/v1/api/votes', { 
            candidate_id: candidateId,
            time_remaining: timeRemaining
        });
        return handleApiResponse<any>(response, 'Gagal mengirimkan pilihan Anda');
    } catch (error) {
        return handleApiError(error, 'Gagal mengirimkan pilihan Anda');
    }
};

export const expireVoteSession = async (): Promise<any> => {
    try {
        const response = await api.post('/v1/api/votes/expire');
        return handleApiResponse<any>(response, 'Gagal memproses penutupan sesi');
    } catch (error) {
        return handleApiError(error, 'Gagal memproses penutupan sesi');
    }
};
