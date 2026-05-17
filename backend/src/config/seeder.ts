import { User } from '../models';
import defaultAdmin from '../data/user.json';

export const seedDefaultAdmin = async (): Promise<void> => {
    try {
        // 🌱 Cek apakah Admin bawaan sudah ada di database
        const adminCount = await User.count({ where: { roles: 'Admin' } });
        
        if (adminCount === 0) {
            await User.create({
                name: defaultAdmin.name,
                nisn: defaultAdmin.nis,
                kelas: 'Admin',
                code: defaultAdmin.code,
                status: defaultAdmin.status as 'Active' | 'Inactive',
                roles: defaultAdmin.role as 'Admin' | 'Siswa'
            });
            console.log('👤 Default Admin seeded successfully!');
        }
    } catch (error) {
        console.error('❌ Failed to seed default admin:', error);
    }
};
