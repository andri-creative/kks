import { api } from "@/config/api";
import { handleApiResponse, handleApiError } from "@/helpers/responseHelper";

export interface BackendVoteLog {
    id: number;
    user_id: number;
    candidate_id: number;
    time_remaining: number;
    created_at?: string;
    updated_at?: string;
    createdAt?: string;
    updatedAt?: string;
    user: {
        id: number;
        name: string;
        nisn: string;
        kelas: string;
        voting_status: 'belum_memilih' | 'sudah_memilih' | 'waktu_habis';
    };
    candidate: {
        id: number;
        name: string;
        image: string;
        kelas: string;
        no: number;
    };
}

export interface VoteStatistics {
    summary: {
        totalRegisteredSiswa: number;
        totalVotesCast: number;
        participationPercentage: number;
        abstainCount: number;
    };
    candidates: Array<{
        id: number;
        no: number;
        name: string;
        image: string;
        kelas: string;
        votesCount: number;
        percentage: number;
    }>;
}

export const fetchVoteStats = async (): Promise<VoteStatistics> => {
    try {
        const response = await api.get('/v1/api/votes/stats');
        return handleApiResponse<VoteStatistics>(response, 'Gagal mengambil statistik voting');
    } catch (error) {
        return handleApiError(error, 'Gagal mengambil statistik voting');
    }
};

export const fetchVoteAuditLogs = async (): Promise<BackendVoteLog[]> => {
    try {
        const response = await api.get('/v1/api/votes');
        return handleApiResponse<BackendVoteLog[]>(response, 'Gagal mengambil data audit log voting');
    } catch (error) {
        return handleApiError(error, 'Gagal mengambil data audit log voting');
    }
};
