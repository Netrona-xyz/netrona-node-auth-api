// scaffold/generateController.js
import fs from 'fs';
import path from 'path';

export async function generateController (config, output) {
    const { grupo, plural } = config;
    // const entidadLower = entidad.toLowerCase();
    const pluralLower = plural[0].toLowerCase() + plural.slice(1);

    const controllerCode = `import { showError } from '../../middleware/controllerErrors.js';
import { bodyValidations, throwValidationError, throwParamsError } from '../validations.js';
import { ${pluralLower}CreateSchema, ${pluralLower}UpdateSchema } from '../../schemas/${grupo}/${pluralLower}_schema.js';
import ${plural}Service from '../../services/${grupo}/${pluralLower}_service.js';

export default class ${plural}Controller {
    static getAllowedFields (req, res, next) {
        req.allowedFields = ${plural}Service.getAllowedFields();
        next();
    }

    static async getAll (req, res) {
        try {
            const data = await ${plural}Service.getAll(req.devExtremeQuery);
            res.status(200).json(data);
        } catch (error) {
            showError(req, res, error);
        }
    }

    static async getById (req, res) {
        try {
            const { id } = req.params;
            if (isNaN(id)) throwParamsError('El id debe ser numérico.');
            const recurso = await ${plural}Service.getById(id);
            res.status(200).json(recurso.toJson());
        } catch (error) {
            showError(req, res, error);
        }
    }

    static async create (req, res) {
        try {
            const [errores, data] = bodyValidations(req.body, ${pluralLower}CreateSchema);
            if (errores.length) throwValidationError(errores);
            const creado = await ${plural}Service.create(data, req.user?.id);
            res.status(201).json(creado.toJson());
        } catch (error) {
            showError(req, res, error);
        }
    }

    static async update (req, res) {
        try {
            const { id } = req.params;
            const [errores, data] = bodyValidations(req.body, ${pluralLower}UpdateSchema, req.user?.id);
            if (errores.length) throwValidationError(errores);
            const actualizado = await ${plural}Service.update(id, data);
            res.status(200).json(actualizado.toJson());
        } catch (error) {
            showError(req, res, error);
        }
    }

    static async delete (req, res) {
        try {
            const { id } = req.params;
            if (isNaN(id)) throwParamsError('El id debe ser numérico.');
            await ${plural}Service.delete(id);
            res.status(204).send();
        } catch (error) {
            showError(req, res, error);
        }
    }
}
`;

    const outputDir = path.resolve(output);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    const outPath = path.join(outputDir, `${pluralLower}_controller.js`);
    fs.writeFileSync(outPath, controllerCode);
    console.log(`✅ Controller generado en: ${outPath}`);
}
