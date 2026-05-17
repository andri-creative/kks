import type { Candidates } from '../types';
import { candidates as initialCandidates } from '../../../data/User';

export const candidateService = {
    /**
     * Retrieve all candidates, fallback to initial sample data
     */
    getAll(): Candidates[] {
        const saved = localStorage.getItem('candidates_data');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse candidates data', e);
            }
        }
        return initialCandidates;
    },

    /**
     * Save the entire candidate list to local storage
     */
    saveAll(candidates: Candidates[]): void {
        localStorage.setItem('candidates_data', JSON.stringify(candidates));
    }
};
