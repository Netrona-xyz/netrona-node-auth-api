import { Router } from 'express';
import InstrumentosController from '../../controllers/maestros/instrumentos_controller.js';
import { createParseDevExtremeQuery } from '../../middleware/parseDevExtremeQuery.js';
import { authMiddleware } from '../../middleware/auth.js';
import { requiereDerecho } from '../../middleware/requiereDerecho.js';

export const instrumentosRouter = Router();

const parseQuery = createParseDevExtremeQuery();

instrumentosRouter.get('/', authMiddleware, InstrumentosController.getAllowedFields, parseQuery, InstrumentosController.getAll);
instrumentosRouter.get('/:id', authMiddleware, InstrumentosController.getById);
instrumentosRouter.post('/', authMiddleware, requiereDerecho('instrumentos.crear'), InstrumentosController.create);
instrumentosRouter.put('/:id', authMiddleware, requiereDerecho('instrumentos.modificar'), InstrumentosController.update);
instrumentosRouter.delete('/:id', authMiddleware, requiereDerecho('instrumentos.borrar'), InstrumentosController.delete);
