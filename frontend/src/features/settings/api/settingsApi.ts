import { api } from "@/config/api";
import { handleApiResponse, handleApiError } from "@/helpers/responseHelper";
import type { SchoolSettings } from "../types";

export const fetchSchoolSettings = async (): Promise<SchoolSettings> => {
    try {
        const response = await api.get('/v1/api/school-settings');
        return handleApiResponse<SchoolSettings>(response, 'Gagal mengambil pengaturan sekolah');
    } catch (error) {
        return handleApiError(error, 'Gagal mengambil pengaturan sekolah');
    }
};

export const saveSchoolSettings = async (settingsData: SchoolSettings): Promise<SchoolSettings> => {
    try {
        const response = await api.put('/v1/api/school-settings', settingsData);
        return handleApiResponse<SchoolSettings>(response, 'Gagal menyimpan pengaturan sekolah');
    } catch (error) {
        return handleApiError(error, 'Gagal menyimpan pengaturan sekolah');
    }
};
