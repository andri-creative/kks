import { SchoolSettings } from '../models';
import cloudinary from '../config/cloudinary';

export class SchoolSettingsService {
    // Convert DB attributes to SchoolSettings camelCase interface
    private static toDTO(settings: any) {
        return {
            schoolName: settings.school_name,
            schoolAcronym: settings.school_acronym,
            schoolLogo: settings.school_logo,
            npsn: settings.npsn,
            address: settings.address,
            phone: settings.phone,
            email: settings.email,
            headmasterName: settings.headmaster_name,
            headmasterNip: settings.headmaster_nip,
            signatureImage: settings.signature_image,
            stampImage: settings.stamp_image,
            cardThemeColor: settings.card_theme_color,
            academicYear: settings.academic_year,
            organizationName: settings.organization_name,
            organizationLogo: settings.organization_logo,
            electionStatus: settings.election_status,
            authMethod: settings.auth_method,
            timerDuration: settings.timer_duration,
            uiColors: settings.ui_colors || null
        };
    }

    // Convert DTO camelCase to DB snake_case structure
    private static toDBFields(dto: any) {
        return {
            school_name: dto.schoolName,
            school_acronym: dto.schoolAcronym,
            school_logo: dto.schoolLogo || "",
            npsn: dto.npsn,
            address: dto.address,
            phone: dto.phone,
            email: dto.email,
            headmaster_name: dto.headmasterName,
            headmaster_nip: dto.headmasterNip,
            signature_image: dto.signatureImage || "",
            stamp_image: dto.stampImage || "",
            card_theme_color: dto.cardThemeColor || "#059669",
            academic_year: dto.academicYear,
            organization_name: dto.organizationName,
            organization_logo: dto.organizationLogo || "",
            election_status: dto.electionStatus || "not_started",
            auth_method: dto.authMethod || "nisn",
            timer_duration: Number(dto.timerDuration !== undefined ? dto.timerDuration : 300),
            ui_colors: dto.uiColors || null
        };
    }

    static async getSettings() {
        let settings = await SchoolSettings.findOne();
        if (!settings) {
            // Seed an empty one if none exists in the DB
            settings = await SchoolSettings.create({
                school_name: "",
                school_acronym: "",
                school_logo: "",
                npsn: "",
                address: "",
                phone: "",
                email: "",
                headmaster_name: "",
                headmaster_nip: "",
                signature_image: "",
                stamp_image: "",
                card_theme_color: "#059669",
                academic_year: "",
                organization_name: "",
                organization_logo: "",
                election_status: "not_started",
                auth_method: "nisn",
                timer_duration: 300,
                ui_colors: null
            });
        }
        return this.toDTO(settings);
    }

    private static async uploadBase64IfNeeded(fieldValue: string | undefined): Promise<string | undefined> {
        if (!fieldValue) return fieldValue;
        if (fieldValue.startsWith('data:image/')) {
            try {
                const timestamp = Date.now().toString();
                const result = await cloudinary.uploader.upload(fieldValue, {
                    folder: 'kks_settings',
                    public_id: timestamp,
                    format: 'webp'
                });
                return result.secure_url;
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return fieldValue;
            }
        }
        return fieldValue;
    }

    static async updateSettings(data: any) {
        if (data.schoolLogo) data.schoolLogo = await this.uploadBase64IfNeeded(data.schoolLogo);
        if (data.organizationLogo) data.organizationLogo = await this.uploadBase64IfNeeded(data.organizationLogo);
        if (data.signatureImage) data.signatureImage = await this.uploadBase64IfNeeded(data.signatureImage);
        if (data.stampImage) data.stampImage = await this.uploadBase64IfNeeded(data.stampImage);

        let settings = await SchoolSettings.findOne();
        const dbFields = this.toDBFields(data);
        if (!settings) {
            settings = await SchoolSettings.create(dbFields as any);
        } else {
            await settings.update(dbFields);
        }
        return this.toDTO(settings);
    }
}
