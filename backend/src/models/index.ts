import { User } from './user.model';
import { Candidates } from './candidates.model';
import { Votes } from './votes.model';
import { SchoolSettings } from './schoolSettings.model';

// ==========================================
// 🛠️ DEFINISI RELASI / ASOSIASI SEQUELIZE
// ==========================================

// 1. Relasi User dengan Votes (Satu User bisa melakukan voting)
User.hasMany(Votes, {
    foreignKey: 'user_id',
    as: 'votes'
});
Votes.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// 2. Relasi Candidates dengan Votes (Satu Kandidat bisa menerima banyak vote/suara)
Candidates.hasMany(Votes, {
    foreignKey: 'candidate_id',
    as: 'votes'
});
Votes.belongsTo(Candidates, {
    foreignKey: 'candidate_id',
    as: 'candidate'
});

// ==========================================
// 📦 EKSPOR SEMUA MODEL TERPUSAT
// ==========================================
export { User, Candidates, Votes, SchoolSettings };