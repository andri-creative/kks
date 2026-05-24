import axios from "axios";

const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:37900";

export const api = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        config.headers["X-Timestamp"] = timestamp;

        const token = localStorage.getItem("user_token");
        if (token) {
            config.headers["X-Token"] = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
