import { z } from 'zod';

export const parseDate = (val) => {
    if (typeof val === 'string') {
        // Si es formato largo, truncamos a "YYYY-MM-DD"
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(val)) {
            return val.slice(0, 10);
        }
        // Si ya está en "YYYY-MM-DD", lo devolvemos como está
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            return val;
        }
    }
    return val; // Devolver el valor original si no es un string
};

export const dateSchema = z.preprocess(
    parseDate,
    z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD o ISO 8601 completo')
        .refine((val) => !isNaN(Date.parse(val)), {
            message: 'La fecha proporcionada no es válida'
        })
);
