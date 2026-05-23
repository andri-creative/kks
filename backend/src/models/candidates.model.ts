import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";


// 1. Definisikan semua kolom (Attributes)
export interface CandidatesAttributes {
    id: number;
    no: number;
    image: string;
    name: string;
    nisn: string;
    kelas: string;
    status: 'Active' | 'Inactive';
    misi: string;
    visi: string;
    created_at?: Date;
    updated_at?: Date;
}

// 2. Tentukan atribut yang bersifat opsional saat membuat data baru
export interface CandidatesCreationAttributes extends Optional<CandidatesAttributes, 'id' | 'status' | 'created_at' | 'updated_at'> { }

// 3. Buat Class Model Sequelize
export class Candidates extends Model<CandidatesAttributes, CandidatesCreationAttributes> implements CandidatesAttributes {
    public id!: number;
    public no!: number;
    public image!: string;
    public name!: string;
    public nisn!: string;
    public kelas!: string;
    public status!: 'Active' | 'Inactive';
    public misi!: string;
    public visi!: string;

    // Timestamps otomatis
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

// 4. Inisialisasi Skema Tabel Sequelize
Candidates.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        no: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        nisn: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        kelas: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive'),
            defaultValue: 'Active',
            allowNull: false
        },
        misi: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        visi: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'candidates',
        modelName: 'Candidates',
        underscored: true,
        timestamps: true
    }
);