import { useState, useEffect, useCallback } from 'react';
import { fetchVoteAuditLogs, fetchVoteStats, type BackendVoteLog, type VoteStatistics } from '../api/voteApi';

export const useVoteLogs = () => {
    const [logs, setLogs] = useState<BackendVoteLog[]>([]);
    const [stats, setStats] = useState<VoteStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Parallel loading of logs and statistics from MySQL
            const [fetchedLogs, fetchedStats] = await Promise.all([
                fetchVoteAuditLogs(),
                fetchVoteStats()
            ]);

            setLogs(fetchedLogs || []);
            setStats(fetchedStats || null);
        } catch (err: any) {
            console.error("Failed to fetch vote data:", err);
            setError(err.message || 'Gagal memuat data dari server');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        logs,
        stats,
        isLoading,
        error,
        refreshLogs: loadData
    };
};
