import { useState, useEffect } from 'react';
import type { SchoolSettings } from '../types';
import { settingsService } from '../services/settingsService';

export const useSettings = () => {
    const [settings, setSettingsState] = useState<SchoolSettings>(() => settingsService.getSettings());

    const updateSettings = (updatedFields: Partial<SchoolSettings>) => {
        const newSettings = { ...settings, ...updatedFields };
        settingsService.saveSettings(newSettings);
        setSettingsState(newSettings);
    };

    // Synchronize settings changes across tabs/windows
    useEffect(() => {
        const handleSettingsChange = () => {
            setSettingsState(settingsService.getSettings());
        };
        
        window.addEventListener('school_settings_changed', handleSettingsChange);
        window.addEventListener('storage', handleSettingsChange);
        
        return () => {
            window.removeEventListener('school_settings_changed', handleSettingsChange);
            window.removeEventListener('storage', handleSettingsChange);
        };
    }, []);

    return {
        settings,
        updateSettings
    };
};
