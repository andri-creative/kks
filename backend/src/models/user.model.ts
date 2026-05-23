import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// 1. Definisikan semua kolom (Attributes) yang ada di tabel users
export interface UserAttributes {
    id: number;
    name: string;
    nisn?: string | null;
    kelas?: string | null;
    code?: string | null;
    status: 'Active' | 'Inactive';
    roles: 'Admin' | 'Siswa';
    voting_status: 'belum_memilih' | 'sudah_memilih' | 'waktu_habis';
    created_at?: Date;
    updated_at?: Date;
}

// 2. Tentukan atribut yang bersifat opsional saat membuat data baru (seperti ID, status default, dll)
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'status' | 'roles' | 'voting_status' | 'created_at' | 'updated_at'> { }

// 3. Buat Class Model Sequelize
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public nisn!: string | null;
    public kelas!: string | null;
    public code!: string | null;
    public status!: 'Active' | 'Inactive';
    public roles!: 'Admin' | 'Siswa';
    public voting_status!: 'belum_memilih' | 'sudah_memilih' | 'waktu_habis';

    // Timestamps otomatis
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

// 4. Inisialisasi Skema Tabel Sequelize
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        nisn: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true
        },
        kelas: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive'),
            defaultValue: 'Active',
            allowNull: false
        },
        roles: {
            type: DataTypes.ENUM('Admin', 'Siswa'),
            defaultValue: 'Siswa',
            allowNull: false
        },
        voting_status: {
            type: DataTypes.ENUM('belum_memilih', 'sudah_memilih', 'waktu_habis'),
            defaultValue: 'belum_memilih',
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',
        underscored: true,
        timestamps: true
    }
);
