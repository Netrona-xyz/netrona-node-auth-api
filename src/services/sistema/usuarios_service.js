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

            return JWT.generateToken(user.toJson());
        } catch (error) {
            if (error.status === 401) throw error;
            throw dbErrorMsg(500, error?.sqlMessage);
        }
    }
}
