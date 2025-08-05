//  https://jwt.io/
import jwt from 'jsonwebtoken';

process.loadEnvFile();
const JWT_SECRET = process.env.JWT_SECRET;

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

    static generateRefreshToken (user) {
        return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' }); // o más tiempo si preferís
    }

    static verifyRefreshToken (token) {
        return jwt.verify(token, JWT_SECRET); // Podés usar otra clave si querés separarlos
    }
}
