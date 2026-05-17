import { users } from "@/data/User";
import type { User } from "@/types/Users";

export const authService = {
    login: (username: string, code: number): User | null => {
        const found = users.find(
            (u) => u.username === username && u.code === code
        );

        if (found) {
            localStorage.setItem("user_role", found.role);
            localStorage.setItem("user_name", found.name);
            localStorage.setItem("user_username", found.username);
            return found;
        }

        return null;
    },

    logout: () => {
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_username");
    },

    getCurrentUser: () => {
        return {
            name: localStorage.getItem("user_name"),
            role: localStorage.getItem("user_role"),
            username: localStorage.getItem("user_username"),
        };
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("user_role");
    }
};
