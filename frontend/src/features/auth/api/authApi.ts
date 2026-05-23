import { api } from "@/config/api";
import { authService } from "@/services/authService";

/**
 * Ini adalah tempat untuk semua request ke backend terkait autentikasi.
 * Menghubungkan frontend ke API backend menggunakan Axios.
 */
export const authApi = {
    login: async (username: string, code: string | number) => {
        try {
            // Panggil API Login Backend
            const response = await api.post("/v1/api/auth/login", {
                nisn: username,
                code: String(code),
            });

            if (response.data && response.data.status === "success") {
                const { user, token } = response.data.data;

                // Simpan token JWT ke localStorage
                localStorage.setItem("user_token", token);

                // Simpan data user ke localStorage (kompatibilitas dengan authService mock)
                localStorage.setItem("user_role", user.roles.toLowerCase());
                localStorage.setItem("user_name", user.name);
                localStorage.setItem("user_username", user.nisn || user.name);

                return {
                    name: user.name,
                    username: user.nisn || user.name,
                    code: Number(code),
                    role: user.roles.toLowerCase(),
                };
            }
            return null;
        } catch (error: any) {
            console.error("Login error:", error);
            // Ambil pesan error detail dari response API jika ada
            const message = error.response?.data?.message || "Kombinasi NISN / Kode salah atau tidak aktif.";
            throw new Error(message);
        }
    },

    logout: async () => {
        // Hapus token JWT
        localStorage.removeItem("user_token");
        // Hapus data sesi lama di authService
        authService.logout();
    }
};

