import { countUsers } from "@/data/User";

export const fetchUsers = async () => {
    // Simulasi delay API
    await new Promise((resolve) => setTimeout(resolve, 500));
    return countUsers;
};
