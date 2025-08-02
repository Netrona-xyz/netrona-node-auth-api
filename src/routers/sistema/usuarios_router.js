import { Router } from 'express';
import UsuariosController from '../../controllers/sistema/usuarios_controller.js';
import { authMiddleware } from '../../middleware/auth.js';

export const usuariosRouter = Router();

usuariosRouter.post('/register', UsuariosController.userRegister);
usuariosRouter.post('/login', UsuariosController.userLogin);
usuariosRouter.post('/api-token', UsuariosController.apiTokenLogin);
usuariosRouter.get('/me', authMiddleware, UsuariosController.getMe);
