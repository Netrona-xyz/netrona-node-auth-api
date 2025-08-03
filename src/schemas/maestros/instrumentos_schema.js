import { z } from 'zod';

export const instrumentosCreateSchema = z.object({
    tipoInstrumentoId: z.number().int().positive(),
    emisorId: z.number().int().positive(),
    ticker: z.string().max(10, 'máximo: 10 caracteres'),
    notas: z.string().max(150, 'máximo: 150 caracteres')
});

export const instrumentosUpdateSchema = instrumentosCreateSchema.partial();
