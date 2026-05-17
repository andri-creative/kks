import { useState, useEffect, useMemo } from 'react';
import { fetchUsers } from '../api/userApi';

export const useUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Jumlah data per halaman

    useEffect(() => {
        let isMounted = true;
        fetchUsers().then((data) => {
            if (isMounted) {
                setUsers(data);
                setIsLoading(false);
            }
        });
        return () => { isMounted = false; };
    }, []);

    // Reset ke halaman 1 jika mencari sesuatu
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy, sortOrder]);

    const filteredUsers = useMemo(() => {
        let result = [...users];

        if (searchQuery.length > 0) {
            const query = searchQuery.toLowerCase();
            result = result.filter(user => 
                user.name.toLowerCase().includes(query) || 
                (user.nisn && user.nisn.toString().includes(query)) ||
                (user.code && user.code.toString().includes(query))
            );
        }

        result.sort((a, b) => {
            let comparison = 0;
            if (sortBy === "name") comparison = a.name.localeCompare(b.name);
            if (sortBy === "nisn") comparison = a.nisn.localeCompare(b.nisn);
            return sortOrder === "asc" ? comparison : -comparison;
        });

        return result;
    }, [users, searchQuery, sortBy, sortOrder]);

    // Data mentah per kelas (untuk menghitung total item)
    const rawUsersByClass = useMemo(() => {
        const groups: Record<string, any[]> = { 'Semua': filteredUsers };
        filteredUsers.forEach(user => {
            if (user.kelas) {
                const level = user.kelas.split(' ')[0];
                if (!groups[level]) groups[level] = [];
                groups[level].push(user);
            }
        });
        return groups;
    }, [filteredUsers]);

    // Data yang sudah dipotong per halaman (Paginated)
    const paginatedUsersByClass = useMemo(() => {
        const groups: Record<string, any[]> = {};
        
        Object.keys(rawUsersByClass).forEach(category => {
            const allItems = rawUsersByClass[category];
            const startIndex = (currentPage - 1) * itemsPerPage;
            groups[category] = allItems.slice(startIndex, startIndex + itemsPerPage);
        });

        return groups;
    }, [rawUsersByClass, currentPage]);

    const clearFilters = () => {
        setSearchQuery("");
        setSortBy("name");
        setSortOrder("asc");
        setCurrentPage(1);
    };

    return { 
        usersByClass: paginatedUsersByClass, // Ini data yang sudah dipotong
        totalItemsByClass: rawUsersByClass, // Ini data asli untuk hitung pagination
        isLoading, 
        searchQuery, 
        setSearchQuery,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        clearFilters
    };
};
