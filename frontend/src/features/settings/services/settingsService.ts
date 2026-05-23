import type { SchoolSettings } from '../types';

const SETTINGS_KEY = 'school_settings_data';

const defaultSettings: SchoolSettings = {
    schoolName: "",
    schoolAcronym: "",
    schoolLogo: "",
    npsn: "",
    address: "",
    phone: "",
    email: "",
    headmasterName: "",
    headmasterNip: "",
    signatureImage: "",
    stampImage: "",
    cardThemeColor: "#059669",
    academicYear: "",
    organizationName: "",
    organizationLogo: "",
    electionStatus: "not_started",
    authMethod: "nisn",
    timerDuration: 300
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
