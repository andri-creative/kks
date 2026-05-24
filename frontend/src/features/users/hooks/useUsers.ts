import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser, batchCreateUser } from '../api/userApi';

export const useUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err: any) {
            console.error('Failed to load users:', err);
            setError(err.message || 'Gagal mengambil data user.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

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
                (user.code && user.code.toString().includes(query)) ||
                (user.kelas && user.kelas.toLowerCase().includes(query))
            );
        }

        result.sort((a, b) => {
            let comparison = 0;
            if (sortBy === "name") comparison = a.name.localeCompare(b.name);
            if (sortBy === "nisn") {
                const aNisn = a.nisn || "";
                const bNisn = b.nisn || "";
                comparison = aNisn.localeCompare(bNisn);
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

        return result;
    }, [users, searchQuery, sortBy, sortOrder]);

    // Data mentah per kelas (untuk menghitung total item)
    const rawUsersByClass = useMemo(() => {
        const groups: Record<string, any[]> = { 'Semua': filteredUsers };
        filteredUsers.forEach(user => {
            if (user.kelas) {
                const level = user.kelas.trim().split(' ')[0] || "Lainnya";
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

    const addUser = async (userData: { name: string; nisn: string; kelas: string }) => {
        setIsLoading(true);
        try {
            await createUser(userData);
            await loadUsers();
        } catch (err: any) {
            console.error('Failed to add user:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const importUsers = async (usersData: { name: string; nisn: string; kelas: string }[]) => {
        setIsLoading(true);
        try {
            const result = await batchCreateUser(usersData);
            await loadUsers();
            return result;
        } catch (err: any) {
            console.error('Failed to import users:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const editUser = async (id: number, userData: { name: string; nisn: string; kelas: string }) => {
        setIsLoading(true);
        try {
            await updateUser(id, userData);
            await loadUsers();
        } catch (err: any) {
            console.error('Failed to edit user:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const removeUser = async (id: number) => {
        setIsLoading(true);
        try {
            await deleteUser(id);
            await loadUsers();
        } catch (err: any) {
            console.error('Failed to remove user:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const removeMultipleUsers = async (ids: string[]) => {
        setIsLoading(true);
        try {
            await Promise.all(ids.map(id => deleteUser(parseInt(id))));
            await loadUsers();
        } catch (err: any) {
            console.error('Failed to remove multiple users:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        usersByClass: paginatedUsersByClass,
        totalItemsByClass: rawUsersByClass,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        clearFilters,
        addUser,
        importUsers,
        editUser,
        removeUser,
        removeMultipleUsers,
        refresh: loadUsers
    };
};
