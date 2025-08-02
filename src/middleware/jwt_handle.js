//  https://jwt.io/
import jwt from 'jsonwebtoken';

process.loadEnvFile();
const JWT_SECRET = process.env.JWT_SECRET;

// todo: Manejar esquema de refreshToken (ojo eso impacta bastante en el front tambien)
export default class JWT {
    /**
     * Genera un token JWT incluyendo datos del usuario en su payload
     * @param {Object} user - objeto publicable del usuario (sin clave)
     * @returns {string} token JWT con user como payload
     */
    static generateToken (user) {
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '2h' });
        return token;
    }

    static verifyToken (token) {
        return jwt.verify(token, JWT_SECRET);
    }

    static verifyJWTSecret () {
        const secret = process.env.JWT_SECRET;
        if (!secret || secret.length < 32) {
            throw new Error('JWT_SECRET inválido o demasiado corto. Debe tener al menos 32 caracteres.');
        }
    }
}
