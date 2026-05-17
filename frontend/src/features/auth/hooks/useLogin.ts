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

    const handleLogin = async (username: string, code: number) => {
        setIsLoading(true);
        setError("");
        
        try {
            const user = await authApi.login(username, code);
            
            if (user) {
                if (user.role === "admin") {
                    navigate({ to: "/dashboard" });
                } else {
                    navigate({ to: "/client" });
                }
                return { success: true };
            } else {
                setError("Username atau kode salah.");
                return { success: false };
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem. Silakan coba lagi.");
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
