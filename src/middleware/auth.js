// src/middleware/auth.js
import JWT from './jwt_handle.js';

export function authMiddleware (req, res, next) {
    if (process.env.USE_AUTHENTICATION === 'false') {
        req.user = { id: 1000, nombre: 'test', mail: 'test@fake.com' };
        return next();
    }
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({ message: 'Token requerido' });

    try {
        const decoded = JWT.verifyToken(token);
        req.user = decoded; // id, mail, nombre, etc.
        next();
    } catch (err) {
        res.status(403).json({ message: 'Token inválido o expirado' });
    }
}
