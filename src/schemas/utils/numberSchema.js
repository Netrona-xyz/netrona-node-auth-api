import { z } from 'zod';

/**
 * Crea un esquema de validación numérica usando Zod, con soporte opcional para límites mínimo y máximo.
 * También convierte automáticamente strings numéricos válidos en números antes de validar.
 *
 * @param {Object} [options] - Opciones para definir los límites del número.
 * @param {number|null} [options.desde=null] - Valor mínimo permitido (inclusive). Si es `null`, no se aplica mínimo.
 * @param {number|null} [options.hasta=null] - Valor máximo permitido (inclusive). Si es `null`, no se aplica máximo.
 * @returns {ZodType<number>} Un esquema Zod que valida y transforma el valor como número dentro del rango dado.
 *
 * @example
 * const schema = numberSchema({ desde: 10, hasta: 100 });
 * schema.parse("50"); // 50
 * schema.parse("5");  // ❌ Error: El número debe estar desde 10 hasta 100
 */

export const numberSchema = ({ desde = null, hasta = null } = {}) =>
    z.preprocess(
        (val) => {
            if (typeof val === 'string' && !isNaN(val) && val.trim() !== '') {
                return Number(val);
            }
            return val;
        },
        z.number().refine(
            (val) => {
                if (desde !== null && val < desde) return false;
                if (hasta !== null && val > hasta) return false;
                return true;
            },
            {
                message: `El número debe estar${desde !== null ? ` desde ${desde}` : ''}${hasta !== null ? ` hasta ${hasta}` : ''}`
            }
        )
    );
