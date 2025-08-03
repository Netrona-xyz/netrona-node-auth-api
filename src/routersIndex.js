//* routersIndex.js

// ─── Sistema ───────────────────────────────────────
import { usuariosRouter } from './routers/sistema/usuarios_router.js';

// ─── Tablas maestras────────────────────────────────
import { instrumentosRouter } from './routers/maestros/instrumentos_router.js';

export const routers = [
    // ─── Sistema ───────────────────────────────────────
    { path: '/api/usuarios', router: usuariosRouter },
    { path: '/api/instrumentos', router: instrumentosRouter }
];
