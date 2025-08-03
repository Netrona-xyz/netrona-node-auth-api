import { Router } from 'express';
import InstrumentosController from '../../controllers/maestros/instrumentos_controller.js';
import { createParseDevExtremeQuery } from '../../middleware/parseDevExtremeQuery.js';

export const instrumentosRouter = Router();

const parseQuery = createParseDevExtremeQuery();

instrumentosRouter.get('/', InstrumentosController.getAllowedFields, parseQuery, InstrumentosController.getAll);
instrumentosRouter.get('/:id', InstrumentosController.getById);
instrumentosRouter.post('/', InstrumentosController.create);
instrumentosRouter.put('/:id', InstrumentosController.update);
instrumentosRouter.delete('/:id', InstrumentosController.delete);
