import { api } from "@/config/api";
import { handleApiResponse, handleApiError } from "@/helpers/responseHelper";

export const fetchUsers = async (): Promise<any[]> => {
    try {
        const response = await api.get("/v1/api/users");
        const allUsers = handleApiResponse<any[]>(response, "Gagal mengambil daftar pemilih");
        return allUsers.filter((user: any) => {
            const role = (user.roles || user.role || "").toLowerCase();
            return role !== "admin";
        });
    } catch (error) {
        return handleApiError(error, "Gagal mengambil daftar pemilih");
    }
};

export const createUser = async (userData: { name: string; nisn: string; kelas: string }): Promise<any> => {
    try {
        const response = await api.post("/v1/api/users", userData);
        return handleApiResponse<any>(response, "Gagal mendaftarkan pemilih baru");
    } catch (error) {
        return handleApiError(error, "Gagal mendaftarkan pemilih baru");
    }
};

export const deleteUser = async (id: number): Promise<boolean> => {
    try {
        const response = await api.delete(`/v1/api/users/${id}`);
        return handleApiResponse<boolean>(response, "Gagal menghapus pemilih");
    } catch (error) {
        return handleApiError(error, "Gagal menghapus pemilih");
    }
};

export const fetchAdmins = async (): Promise<any[]> => {
    try {
        const response = await api.get("/v1/api/users");
        const allUsers = handleApiResponse<any[]>(response, "Gagal mengambil daftar admin");
        return allUsers
            .filter((user: any) => {
                const role = (user.roles || user.role || "").toLowerCase();
                return role === "admin";
            })
            .map((user: any) => ({
                id: user.id,
                name: user.name,
                username: user.nisn || user.name,
                code: user.code,
                role: (user.roles || user.role || "Admin").toLowerCase(),
                kelas: user.kelas || "Admin"
            }));
    } catch (error) {
        return handleApiError(error, "Gagal mengambil daftar admin");
    }
};

export const createAdmin = async (adminData: { name: string; username: string; code: string }): Promise<any> => {
    try {
        const response = await api.post("/v1/api/users", {
            name: adminData.name,
            nisn: adminData.username, // nisn acts as username
            kelas: "Admin",
            code: adminData.code,
            roles: "Admin",
            status: "Active"
        });
        return handleApiResponse<any>(response, "Gagal menambahkan admin baru");
    } catch (error) {
        return handleApiError(error, "Gagal menambahkan admin baru");
    }
};

export const updateAdminApi = async (id: number, adminData: { name: string; username: string; code: string }): Promise<any> => {
    try {
        const response = await api.put(`/v1/api/users/${id}`, {
            name: adminData.name,
            nisn: adminData.username,
            code: adminData.code,
            roles: "Admin"
        });
        return handleApiResponse<any>(response, "Gagal memperbarui data admin");
    } catch (error) {
        return handleApiError(error, "Gagal memperbarui data admin");
    }
};
