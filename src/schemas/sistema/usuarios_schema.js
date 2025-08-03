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

export const usuarioPasswordChangeSchema = z.object({
    actual: z.string().min(4, 'La contraseña actual es requerida'),
    nueva: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres').max(64)
});
