import InstrumentosService from '../../services/maestros/instrumentos_service.js';
import { showError } from '../../middleware/controllerErrors.js';
import { instrumentosCreateSchema, instrumentosUpdateSchema } from '../../schemas/maestros/instrumentos_schema.js';
import { bodyValidations, throwValidationError, throwParamsError } from '../validations.js';

export default class InstrumentosController {
    static getAllowedFields (req, res, next) {
        req.allowedFields = InstrumentosService.getAllowedFields();
        next();
    }

    static async getAll (req, res, next) {
        try {
            const devExtremeQuery = req.devExtremeQuery;
            const muestras = await InstrumentosService.getAll(devExtremeQuery);
            res.status(200).json(muestras);
        } catch (error) {
            showError(req, res, error);
        }
    }

    static async getById (req, res, next) {
        try {
            const id = req.params.id;
            if (isNaN(id)) throwParamsError('El id debe ser numérico.');

            const muestras = await InstrumentosService.getById(id);
            res.status(200).json(muestras.toJson());
        } catch (error) {
            showError(req, res, error);
        }
    }

    static async create (req, res, next) {
        try {
            const [errores, bodyData] = bodyValidations(req.body, instrumentosCreateSchema);
            if (errores.length !== 0) throwValidationError(errores);

            const insertado = await InstrumentosService.create(bodyData, req.user?.id);
            res.status(201).json(insertado.toJson());
        } catch (error) {
            showError(req, res, error);
        }
    }

    static async update (req, res, next) {
        try {
            const id = req.params.id;
            const [errores, bodyData] = bodyValidations(req.body, instrumentosUpdateSchema, req.user?.id);
            if (errores.length !== 0) throwValidationError(errores);

            const muestrasActualizado = await InstrumentosService.update(id, bodyData);
            res.status(200).json(muestrasActualizado.toJson());
        } catch (error) {
            showError(req, res, error);
        }
    }

    static async delete (req, res, next) {
        try {
            const id = req.params.id;
            if (isNaN(id)) throwParamsError('El id debe ser numérico.');

            await InstrumentosService.delete(id);
            res.status(204).send();
        } catch (error) {
            showError(req, res, error);
        }
    }
}
