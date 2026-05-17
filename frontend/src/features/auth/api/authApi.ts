import { authService } from "@/services/authService";

/**
 * Ini adalah tempat untuk semua request ke backend terkait autentikasi.
 * Jika nanti sudah ada backend, Anda tinggal mengganti authService dengan axios.
 */
export const authApi = {
    login: async (username: string, code: number) => {
        // Simulasi delay network
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Untuk sekarang masih menggunakan service lokal
        return authService.login(username, code);
    },
    
    logout: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        authService.logout();
    }
};
