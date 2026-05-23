import { useState } from "react";
import { authApi } from "../api/authApi";
import { useNavigate } from "@tanstack/react-router";

/**
 * Custom hook untuk menangani logika login.
 * Memisahkan state UI dari logika bisnis (loading, api call, navigation).
 */
export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (username: string, code: string | number) => {
        setIsLoading(true);
        setError("");

        try {
            const user = await authApi.login(username, code);

            if (user) {
                const userRole = user.role.toLowerCase();
                if (userRole === "admin") {
                    navigate({ to: "/dashboard" });
                } else if (userRole === "siswa") {
                    navigate({ to: "/client" });
                } else {
                    setError("Akses ditolak: role pengguna tidak dikenali.");
                    return { success: false };
                }
                return { success: true };
            } else {
                setError("Username atau kode salah.");
                return { success: false };
            }
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan sistem. Silakan coba lagi.");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handleLogin,
        isLoading,
        error,
        setError
    };
};
