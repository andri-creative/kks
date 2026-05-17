import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// 1. Definisi Atribut
export interface SettingsAttributes {
    id: number;
    user_id: number;
    language: string;
    theme: string;
    notification: boolean;
    timezone: string;
    created_at?: Date;
    updated_at?: Date;
}

// 2. Tipe untuk Pembuatan Data Baru (Opsional untuk Id/Timestamps)
interface SettingsCreationAttributes extends Optional<SettingsAttributes, 'id' | 'created_at' | 'updated_at'> { }

// 3. Kelas Model Sequelize
export class Settings extends Model<SettingsAttributes, SettingsCreationAttributes> implements SettingsAttributes {
    public id!: number;
    public user_id!: number;
    public language!: string;
    public theme!: string;
    public notification!: boolean;
    public timezone!: string;

    // Timestamps
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

// 4. Inisialisasi
Settings.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'users', // Nama tabel Users (pastikan sesuai dengan User.init Anda)
                key: 'id'
            }
        },
        language: {
            type: DataTypes.STRING(10),
            defaultValue: 'id',
            allowNull: false
        },
        theme: {
            type: DataTypes.STRING(20),
            defaultValue: 'light', // 'light' atau 'dark'
            allowNull: false
        },
        notification: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        timezone: {
            type: DataTypes.STRING(50),
            defaultValue: 'Asia/Jakarta',
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'settings',
        modelName: 'Settings',
        timestamps: true, // Mengaktifkan created_at dan updated_at
        underscored: true // Mengubah nama field DB menjadi snake_case (misal: user_id)
    }
);