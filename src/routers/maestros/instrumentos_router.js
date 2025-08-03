import { Router } from 'express';
import InstrumentosController from '../../controllers/maestros/instrumentos_controller.js';
import { createParseDevExtremeQuery } from '../../middleware/parseDevExtremeQuery.js';
import { authMiddleware } from '../../middleware/auth.js';

export const instrumentosRouter = Router();

const parseQuery = createParseDevExtremeQuery();

instrumentosRouter.get('/', authMiddleware, InstrumentosController.getAllowedFields, parseQuery, InstrumentosController.getAll);
instrumentosRouter.get('/:id', authMiddleware, InstrumentosController.getById);
instrumentosRouter.post('/', authMiddleware, InstrumentosController.create);
instrumentosRouter.put('/:id', authMiddleware, InstrumentosController.update);
instrumentosRouter.delete('/:id', authMiddleware, InstrumentosController.delete);
