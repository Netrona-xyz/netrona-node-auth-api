import { showError } from '../../middleware/controllerErrors.js';
import UsuariosService from '../../services/sistema/usuarios_service.js';
import { usuarioRegisterSchema, usuarioLoginSchema, usuarioPasswordChangeSchema } from '../../schemas/sistema/usuarios_schema.js';
import { bodyValidations, throwValidationError } from '../validations.js';

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

            const { accessToken, refreshToken } = await UsuariosService.userLogin(loginData.mail, loginData.password);

            res
                .cookie('accessToken', accessToken, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    secure: false, // ⚠️ pasar a true si es HTTPS
                    maxAge: 1000 * 60 * 30 // 30 minutos
                })
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    secure: false, // ⚠️ pasar a true si es HTTPS
                    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
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

    static async refreshToken (req, res) {
        try {
            let refreshToken = req.cookies?.refreshToken;

            if (!refreshToken && req.headers.authorization?.startsWith('Bearer ')) {
                refreshToken = req.headers.authorization.split(' ')[1];
            }

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token requerido' });
            }

            const accessToken = await UsuariosService.regenerarAccessToken(refreshToken);

            // Si vino por cookie, devolvemos el nuevo access token en cookie
            if (req.cookies?.refreshToken) {
                res
                    .cookie('accessToken', accessToken, {
                        httpOnly: true,
                        sameSite: 'Strict',
                        secure: false, // ⚠️ true si HTTPS
                        maxAge: 1000 * 60 * 30
                    })
                    .status(200)
                    .json({ ok: true });
            } else {
            // Si vino por Bearer, devolvemos el token como JSON
                res.status(200).json({ accessToken });
            }
        } catch (error) {
            return res.status(error.status || 403).json({ message: error.message || 'Token inválido' });
        }
    }

    static async logout (req, res) {
        try {
            const userId = req.user?.id;
            if (userId) {
                await UsuariosService.limpiarRefreshToken(userId);
            }

            res
                .clearCookie('accessToken')
                .clearCookie('refreshToken')
                .status(200)
                .json({ ok: true });
        } catch (error) {
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
    }

    static async changePassword (req, res) {
        try {
            const [errores, datos] = bodyValidations(req.body, usuarioPasswordChangeSchema);
            if (errores.length !== 0) throwValidationError(errores);

            await UsuariosService.cambiarPassword(req.user.id, datos.actual, datos.nueva);

            res.status(200).json({ ok: true, message: 'Contraseña actualizada' });
        } catch (error) {
            showError(req, res, error);
        }
    }
}
