import { Router } from 'express';
import UsuariosController from '../../controllers/sistema/usuarios_controller.js';

export const usuariosRouter = Router();

usuariosRouter.post('/register', UsuariosController.userRegister);
usuariosRouter.post('/login', UsuariosController.userLogin);
