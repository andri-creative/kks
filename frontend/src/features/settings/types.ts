export interface SchoolSettings {
    schoolName: string;
    schoolAcronym: string;
    schoolLogo: string;
    npsn: string;
    address: string;
    phone: string;
    email: string;
    
    // Card Settings
    headmasterName: string;
    headmasterNip: string;
    signatureImage: string;
    stampImage: string;
    cardThemeColor: string; // Hex color code
    
    // Election settings
    academicYear: string;
    organizationName: string;
    organizationLogo: string; // Base64 logo of OSIS/MPK
    electionStatus: 'not_started' | 'ongoing' | 'closed';
    authMethod: 'nisn' | 'nisn_pin';
    timerDuration?: number; // Sesi countdown timer (dalam detik) untuk logout otomatis
}
