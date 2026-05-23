import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface SchoolSettingsAttributes {
    id: number;
    school_name: string;
    school_acronym: string;
    school_logo: string;
    npsn: string;
    address: string;
    phone: string;
    email: string;
    headmaster_name: string;
    headmaster_nip: string;
    signature_image: string;
    stamp_image: string;
    card_theme_color: string;
    academic_year: string;
    organization_name: string;
    organization_logo: string;
    election_status: 'not_started' | 'ongoing' | 'closed';
    auth_method: 'nisn' | 'nisn_pin';
    timer_duration: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface SchoolSettingsCreationAttributes extends Optional<SchoolSettingsAttributes, 'id' | 'created_at' | 'updated_at'> { }

export class SchoolSettings extends Model<SchoolSettingsAttributes, SchoolSettingsCreationAttributes> implements SchoolSettingsAttributes {
    public id!: number;
    public school_name!: string;
    public school_acronym!: string;
    public school_logo!: string;
    public npsn!: string;
    public address!: string;
    public phone!: string;
    public email!: string;
    public headmaster_name!: string;
    public headmaster_nip!: string;
    public signature_image!: string;
    public stamp_image!: string;
    public card_theme_color!: string;
    public academic_year!: string;
    public organization_name!: string;
    public organization_logo!: string;
    public election_status!: 'not_started' | 'ongoing' | 'closed';
    public auth_method!: 'nisn' | 'nisn_pin';
    public timer_duration!: number;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

SchoolSettings.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        school_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        school_acronym: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        school_logo: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        npsn: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        headmaster_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        headmaster_nip: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        signature_image: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        stamp_image: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        card_theme_color: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: '#059669'
        },
        academic_year: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        organization_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        organization_logo: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        election_status: {
            type: DataTypes.ENUM('not_started', 'ongoing', 'closed'),
            allowNull: false,
            defaultValue: 'not_started'
        },
        auth_method: {
            type: DataTypes.ENUM('nisn', 'nisn_pin'),
            allowNull: false,
            defaultValue: 'nisn'
        },
        timer_duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 300
        }
    },
    {
        sequelize,
        tableName: 'school_settings',
        modelName: 'SchoolSettings',
        underscored: true,
        timestamps: true
    }
);
