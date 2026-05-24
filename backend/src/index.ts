import 'dotenv/config';
import app from './app';
import { sequelize } from './config/database';
import { seedDefaultAdmin } from './config/seeder';

const PORT = process.env.PORT || 37900;

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL connected successfully via Sequelize!');

        await sequelize.sync({ alter: false });
        console.log('✅ Database synchronized successfully (Tables created/updated)!');

        await seedDefaultAdmin();

        return true;
    } catch (error) {
        console.error('❌ MySQL connection failed:', error);
        return false;
    }
};

const startServer = async () => {
    const isDBConnected = await connectDB();

    if (isDBConnected) {
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    } else {
        console.error('Server not started due to database connection issue.');
        process.exit(1);
    }
};

startServer();