import jwt from 'jsonwebtoken';

const JWT_SECRET = 'kkpp_secret_key_super_secure_12345';
const JWT_EXPIRES_IN = '1d'; // Token aktif selama 1 hari

export interface TokenPayload {
    id: number;
    roles: 'Admin' | 'Siswa';
}

// 1. Generate JWT Token
export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// 2. Verifikasi JWT Token
export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};
