import { useState } from 'react';
import type { Candidates } from '../types';
import { candidateService } from '../services/candidateService';

export function useCandidate() {
    const [candidateList, setCandidateList] = useState<Candidates[]>(() => {
        return candidateService.getAll();
    });

    /**
     * Add a new candidate with generated meta properties
     */
    const addCandidate = (formData: Omit<Candidates, 'id' | 'code' | 'role' | 'created_at' | 'updated_at'>) => {
        const newCandidate: Candidates = {
            ...formData,
            id: Date.now(),
            code: Math.floor(10000 + Math.random() * 90000).toString(),
            role: 'siswa',
            created_at: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString().split('T')[0]
        };
        const updated = [newCandidate, ...candidateList];
        setCandidateList(updated);
        candidateService.saveAll(updated);
        return newCandidate;
    };

    /**
     * Update an existing candidate by id
     */
    const updateCandidate = (id: number, formData: Omit<Candidates, 'id' | 'code' | 'role' | 'created_at' | 'updated_at'>) => {
        const updated = candidateList.map(c => 
            c.id === id 
                ? { ...c, ...formData, updated_at: new Date().toISOString().split('T')[0] }
                : c
        );
        setCandidateList(updated);
        candidateService.saveAll(updated);
    };

    /**
     * Delete a candidate by id
     */
    const deleteCandidate = (id: number) => {
        const updated = candidateList.filter(c => c.id !== id);
        setCandidateList(updated);
        candidateService.saveAll(updated);
    };

    return {
        candidateList,
        addCandidate,
        updateCandidate,
        deleteCandidate
    };
}
