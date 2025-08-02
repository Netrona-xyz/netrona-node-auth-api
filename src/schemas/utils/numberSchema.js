import { z } from 'zod';

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
