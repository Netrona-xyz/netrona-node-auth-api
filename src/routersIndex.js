//* routersIndex.js

// ─── Sistema ───────────────────────────────────────
import { usuariosRouter } from './routers/sistema/usuarios_router.js';

// ─── Tablas maestras────────────────────────────────

export const routers = [
    // ─── Sistema ───────────────────────────────────────
    { path: '/api/usuarios', router: usuariosRouter }
];
