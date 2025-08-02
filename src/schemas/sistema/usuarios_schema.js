import { z } from 'zod';

export const usuarioRegisterSchema = z.object({
    nombre: z.string().max(30),
    mail: z.string().max(60).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Mail inválido' }),
    password: z.string().max(64)
});

export const usuarioLoginSchema = z.object({
    mail: z.string().max(60).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Mail inválido' }),
    password: z.string().max(64)
});
