import { Sequelize } from 'sequelize';
import dbConfig from './db.json';

export const sequelize = new Sequelize(
    dbConfig.db.database,
    dbConfig.db.user,
    dbConfig.db.password,
    {
        host: dbConfig.db.host,
        port: dbConfig.db.port,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true
        }
    }
);