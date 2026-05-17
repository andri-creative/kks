import type { SchoolSettings } from '../types';

const SETTINGS_KEY = 'school_settings_data';

const defaultSettings: SchoolSettings = {
    schoolName: "SMK Negeri 1 Jakarta",
    schoolAcronym: "SMKN 1 JKT",
    schoolLogo: "",
    npsn: "20103284",
    address: "Jl. Budi Utomo No.7, Jakarta Pusat, DKI Jakarta",
    phone: "(021) 3813635",
    email: "info@smkn1jakarta.sch.id",
    headmasterName: "Drs. H. Mulyanto, M.Pd",
    headmasterNip: "196805121993031005",
    signatureImage: "",
    stampImage: "",
    cardThemeColor: "#059669",
    academicYear: "2026/2027",
    organizationName: "OSIS",
    organizationLogo: "",
    electionStatus: "ongoing",
    authMethod: "nisn_pin"
};

export const settingsService = {
    getSettings: (): SchoolSettings => {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch (e) {
                console.error(e);
            }
        }
        return defaultSettings;
    },

    saveSettings: (settings: SchoolSettings): void => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

        // Also dispatch custom event so other active windows/components are notified of changes in real-time
        window.dispatchEvent(new Event('school_settings_changed'));
    }
};
