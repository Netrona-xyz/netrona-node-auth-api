import { pool, dbErrorMsg } from '../../database/db.js';
import Usuarios from '../../models/sistema/usuarios_model.js';
import JWT from '../../middleware/jwt_handle.js';

export default class UsuariosService {
    /**
     * Inserta un nuevo usuario en la tabla de Usuarios
     * @param {{mail, nombre, password}} user - el usuario recibido en el body de un request
     * @returns {Usuarios} - Objeto completo de usuario (con id y la password recibida sin encriptar)
     * @throws 409 ya existe o error general de la base de datos
     */
    static async userRegister (user) {
        const userToAdd = await Usuarios.toAdd(user);
        try {
            const [rows] = await pool.query('INSERT INTO Usuarios SET ?', [userToAdd]);
            userToAdd.id = rows.insertId;
            return new Usuarios(userToAdd);
        } catch (error) {
            if (error?.code === 'ER_DUP_ENTRY') throw dbErrorMsg(409, 'El usuario ya existe');
            throw dbErrorMsg(error.status || 500, error?.sqlMessage || error.message);
        }
    }

    /**
     * Valida si un mail y password (sin encriptar) corresponden a un usuario
     * - el mail debe estar en la tabla de usuarios y
     * - la clave debe corresponderse con la clave encriptada guardada en la tabla para ese usuario.
     * @param {string} mail - eMail del usuario
     * @param {string} pass - Password del usuario (no encriptada)
     * @returns {String} token con id, mail y nombre (si esta autorizado)
     * @throws 401 si no esta habilitado o error general de base de datos
     */
    static async userLogin (mail, pass) {
        try {
            const [rows] = await pool.query('SELECT id, mail, nombre, password FROM Usuarios WHERE mail = ?', [mail]);
            if (rows.length === 0) throw dbErrorMsg(401, 'Credenciales Invalidas');

            const user = new Usuarios(rows[0]);

            const isOk = await Usuarios.validaPassword(pass, user);
            if (!isOk) throw dbErrorMsg(401, 'Credenciales Invalidas');

            const accessToken = JWT.generateToken(user.toJson());
            const refreshToken = JWT.generateRefreshToken(user.toJson());
            await pool.query('UPDATE Usuarios SET refreshToken = ? WHERE id = ?', [refreshToken, user.id]);

            return { accessToken, refreshToken };
        } catch (error) {
            if (error.status === 401) throw error;
            throw dbErrorMsg(500, error?.sqlMessage);
        }
    }

    static async getRolesYDerechos (userId) {
        try {
            const [rolesRows] = await pool.query(
                'SELECT r.id, r.nombre FROM Roles r JOIN RolesUsuarios ru ON ru.rolId = r.id WHERE ru.usuarioId = ?',
                [userId]
            );

            const [derechosRows] = await pool.query(
                'SELECT d.id, d.nombre, d.clave, d.parentId, d.esTitulo, d.orden FROM Derechos d JOIN DerechosRoles dr ON dr.derechoId = d.id JOIN RolesUsuarios ru ON ru.rolId = dr.rolId WHERE ru.usuarioId = ?',
                [userId]
            );

            return {
                roles: rolesRows,
                derechos: derechosRows
            };
        } catch (error) {
            throw dbErrorMsg(500, error?.sqlMessage || 'Error al obtener roles y derechos');
        }
    }

    static async regenerarAccessToken (refreshToken) {
        try {
            const payload = JWT.verifyRefreshToken(refreshToken);

            // Validar que el token esté registrado en la base
            const [rows] = await pool.query(
                'SELECT id, mail, nombre FROM Usuarios WHERE id = ? AND refreshToken = ?',
                [payload.id, refreshToken]
            );

            if (rows.length === 0) throw dbErrorMsg(403, 'Refresh token inválido o no registrado');

            const user = new Usuarios(rows[0]);
            return JWT.generateToken(user.toJson());
        } catch (err) {
            throw dbErrorMsg(403, 'Refresh token inválido o expirado');
        }
    }

    static async limpiarRefreshToken (userId) {
        try {
            await pool.query('UPDATE Usuarios SET refreshToken = NULL WHERE id = ?', [userId]);
        } catch (error) {
            throw dbErrorMsg(500, 'No se pudo limpiar el refresh token');
        }
    }

    static async cambiarPassword (userId, actual, nueva) {
        const [rows] = await pool.query('SELECT id, mail, nombre, password FROM Usuarios WHERE id = ?', [userId]);
        if (rows.length === 0) throw dbErrorMsg(404, 'Usuario no encontrado');

        const usuario = new Usuarios(rows[0]);

        const ok = await Usuarios.validaPassword(actual, usuario);
        if (!ok) throw dbErrorMsg(401, 'Contraseña actual incorrecta');

        const nuevaHash = await Usuarios.hashPassword(nueva);
        await pool.query('UPDATE Usuarios SET password = ? WHERE id = ?', [nuevaHash, userId]);
    }
}
