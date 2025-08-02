// utils/validateSchema.js
import { ZodError } from 'zod';

/**
 * Valida datos usando un schema Zod
 * @param {ZodSchema} schema - El esquema de validación Zod
 * @param {any} data - El objeto a validar (ej. req.body)
 * @returns {[errores: Object[], validData: any]} - Array con errores y datos válidos
 */
export function bodyValidations (data, schema) {
    try {
        const validData = schema.parse(data);
        return [[], validData];
    } catch (error) {
        if (error instanceof ZodError) {
            const erroresZod = error.issues ?? error.errors;
            const errores = erroresZod.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }));
            return [errores, null];
        }
        throw error;
    }
}

/**
 * Lanza un error estándar de validación con status y campos
 * @param {string} message
 * @param {Array} fields
 */
export function throwValidationError (fields = []) {
    throw Object.assign(new Error('Problemas con el req.body'), {
        status: 400,
        fields
    });
}
