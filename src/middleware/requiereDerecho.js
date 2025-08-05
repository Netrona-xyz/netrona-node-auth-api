// src/middleware/requiereDerecho.js
import UsuariosService from '../services/sistema/usuarios_service.js';
import { dbErrorMsg } from '../database/db.js';

const USE_AUTHORIZATION = process.env.USE_AUTHORIZATION !== 'false';

/**
 * Middleware para validar si el usuario autenticado tiene un derecho específico.
 * Se puede desactivar globalmente con USE_AUTHORIZATION=false (útil para desarrollo).
 *
 * @param {string} derechoClave - La clave del derecho requerido (ej. 'Instrumentos-Crear').
 */
export function requiereDerecho (derechoClave) {
    return async (req, res, next) => {
        if (!USE_AUTHORIZATION) return next(); // autorización desactivada globalmente

        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Usuario no autenticado' });

            const { derechos } = await UsuariosService.getRolesYDerechos(userId);
            const tienePermiso = derechos.some(d => d.clave === derechoClave);
            if (!tienePermiso) {
                return res.status(403).json({ message: `Acceso denegado: requiere derecho "${derechoClave}"` });
            }

            next();
        } catch (error) {
            next(dbErrorMsg(500, error?.message || 'Error al validar derecho'));
        }
    };
}
