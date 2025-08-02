// src/middleware/auth.js
import JWT from './jwt_handle.js';

export function authMiddleware (req, res, next) {
    let token = req.cookies?.accessToken;
    console.log('token recibido: ', token);

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('token bearer: ', token);
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
