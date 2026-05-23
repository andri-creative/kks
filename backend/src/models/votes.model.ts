import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";


// 1. Definisikan semua kolom (Attributes)
export interface VotesAttributes {
    id: number;
    user_id: number;
    candidate_id: number;
    time_remaining: number; // Sisa waktu dalam detik saat mencoblos
    created_at?: Date;
    updated_at?: Date;
}

// 2. Tentukan atribut yang bersifat opsional saat membuat data baru
export interface VotesCreationAttributes extends Optional<VotesAttributes, 'id' | 'time_remaining' | 'created_at' | 'updated_at'> { }

// 3. Buat Class Model Sequelize
export class Votes extends Model<VotesAttributes, VotesCreationAttributes> implements VotesAttributes {
    public id!: number;
    public user_id!: number;
    public candidate_id!: number;
    public time_remaining!: number;

    // Timestamps otomatis
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

// 4. Inisialisasi Skema Tabel Sequelize
Votes.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        candidate_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        time_remaining: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        tableName: 'votes',
        modelName: 'Votes',
        underscored: true,
        timestamps: true
    }
);