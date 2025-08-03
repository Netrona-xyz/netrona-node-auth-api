import { z } from 'zod';
/**
 * Esquema Zod que valida fechas en formato "YYYY-MM-DD" o ISO completo,
 * y se asegura de que sea una fecha real.
 *
 * @type {ZodType<string>}
 */
export const dateSchema = z.preprocess(
    parseDate,
    z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD o ISO 8601 completo')
        .refine((val) => {
            const parsed = new Date(val);
            return !isNaN(parsed.getTime()) && parsed.toISOString().startsWith(val);
        }, {
            message: 'La fecha proporcionada no es válida'
        })
);

/**
 * Preprocesa una entrada de fecha en string. Acepta:
 * - "YYYY-MM-DD" (formato correcto)
 * - ISO 8601 completo (lo trunca a "YYYY-MM-DD")
 *
 * Cualquier otro valor se deja sin tocar (y fallará en la validación posterior).
 *
 * @param {*} val - Valor a procesar.
 * @returns {*} String "YYYY-MM-DD" si es válido o el valor original si no cumple formato esperado.
 */
function parseDate (val) {
    if (typeof val === 'string') {
        if (/^\d{4}-\d{2}-\d{2}T/.test(val)) {
            return val.slice(0, 10); // truncar ISO largo
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            return val; // ya está en formato esperado
        }
    }
    return val; // se devolverá sin tocar y fallará en la validación de Zod
}
