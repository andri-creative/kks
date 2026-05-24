import { useState, useEffect } from 'react';
import type { SchoolSettings } from '../types';
import { fetchSchoolSettings, saveSchoolSettings } from '../api/settingsApi';

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
    timerDuration: 300,
    uiColors: {}
};

const applyUiColors = (colors?: Record<string, string>) => {
    if (!colors) return;
    Object.entries(colors).forEach(([key, value]) => {
        if (value) {
            document.documentElement.style.setProperty(key, value);
        }
    });
};

const applyDocumentHead = (settings: Partial<SchoolSettings>) => {
    if (settings.schoolName) {
        document.title = settings.schoolName;
    }
    
    if (settings.schoolLogo) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = settings.schoolLogo;
    }
};

export const useSettings = () => {
    const [settings, setSettingsState] = useState<SchoolSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch fresh settings from MySQL Database upon mounting
    useEffect(() => {
        const loadFreshSettings = async () => {
            try {
                setIsLoading(true);
                const fresh = await fetchSchoolSettings();
                if (fresh) {
                    setSettingsState(fresh);
                    applyUiColors(fresh.uiColors);
                    applyDocumentHead(fresh);
                }
            } catch (err) {
                console.error("Failed to load settings from DB:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadFreshSettings();
    }, []);

    // Update settings in MySQL Database and React state
    const updateSettings = async (updatedFields: Partial<SchoolSettings>) => {
        const newSettings = { ...settings, ...updatedFields };
        
        // Optimistic UI Update: update state instantly
        setSettingsState(newSettings);
        applyUiColors(newSettings.uiColors);
        applyDocumentHead(newSettings);

        try {
            // Save securely to MySQL backend database
            await saveSchoolSettings(newSettings);
            
            // Dispatch custom event to sync other active views
            window.dispatchEvent(new Event('school_settings_changed'));
        } catch (err) {
            console.error("Failed to persist settings to DB:", err);
        }
    };

    // Synchronize settings changes across tabs/windows
    useEffect(() => {
        const handleSettingsChange = async () => {
            try {
                const fresh = await fetchSchoolSettings();
                if (fresh) {
                    setSettingsState(fresh);
                    applyUiColors(fresh.uiColors);
                    applyDocumentHead(fresh);
                }
            } catch (err) {
                console.error("Failed to sync settings:", err);
            }
        };
        
        window.addEventListener('school_settings_changed', handleSettingsChange);
        return () => {
            window.removeEventListener('school_settings_changed', handleSettingsChange);
        };
    }, []);

    return {
        settings,
        isLoading,
        updateSettings
    };
};
