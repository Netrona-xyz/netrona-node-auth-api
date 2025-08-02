import { showError } from '../../middleware/controllerErrors.js';
import UsuariosService from '../../services/sistema/usuarios_service.js';
import { usuarioRegisterSchema, usuarioLoginSchema } from '../../schemas/sistema/usuarios_schema.js';
import { bodyValidations, throwValidationError } from '../validations.js';

// TODO: agregar validador de datos (zod)
export default class UsuariosController {
    /**
     * Utiliza a UsuariosService para grabar un nuevo usuario
     * @param {Request} req
     * @param {req.body.nombre} - nombre de usuario
     * @param {req.body.mail} - mail del usuario
     * @param {req.body.password} - password sin encriptar
     * @param {Response} res
     * @returns {Response} - status: 200 + json con los datos del usuario ingresado (sin password)
     *                     - status: errorstatus + message: string (si falló)
     */
    static async userRegister (req, res, next) {
        try {
            const [errores, registerData] = bodyValidations(req.body, usuarioRegisterSchema);
            if (errores.length !== 0) throwValidationError(errores);
            const usuario = await UsuariosService.userRegister(registerData);
            res.status(200).send(usuario.toJson());
        } catch (error) {
            showError(req, res, error);
        }
    }

    /**
     * Utiliza a UsuariosService para realizar el login de un usuario
     * @param {Request} req
     * @param {Request.body.mail} mail- mail del usuario
     * @param {Request.body.password} password - password sin encriptar
     * @param {Response} res
     * @returns {Response} - token: string (con id, mail, nombre) (si login ok)
     *                     - status: 401 + message (si fallo)
     */
    static async userLogin (req, res) {
        try {
            const [errores, loginData] = bodyValidations(req.body, usuarioLoginSchema);
            if (errores.length !== 0) throwValidationError(errores);

            const token = await UsuariosService.userLogin(loginData.mail, loginData.password);

            res
                .cookie('accessToken', token, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    secure: false, // ⚠️ pasar a true si es HTTPS
                    maxAge: 1000 * 60 * 60 * 2 // 2 horas
                })
                .status(200)
                .json({ ok: true });
        } catch (error) {
            showError(req, res, error);
        }
    }

    static async apiTokenLogin (req, res) {
        try {
            const [errores, loginData] = bodyValidations(req.body, usuarioLoginSchema);
            if (errores.length !== 0) throwValidationError(errores);
            const token = await UsuariosService.userLogin(loginData.mail, loginData.password);
            res.status(200).json({ token });
        } catch (err) {
            showError(req, res, err);
        }
    }

    static async getMe (req, res) {
        try {
            const userId = req.user.id;
            const data = await UsuariosService.getRolesYDerechos(userId);
            res.status(200).json(data);
        } catch (error) {
            showError(req, res, error);
        }
    }
}
