import request from 'supertest';
import app from '../src/app.js';
import { describe, it, expect, beforeAll } from 'vitest';

process.loadEnvFile();

const USE_AUTHENTICATION = process.env.USE_AUTHENTICATION === 'true';
const USE_AUTHORIZATION = process.env.USE_AUTHORIZATION === 'true';

console.info(`
🔐 Configuración de seguridad para los tests:
   🔑 Autenticación (USE_AUTHENTICATION): ${USE_AUTHENTICATION}
   🛡️ Autorización   (USE_AUTHORIZATION):  ${USE_AUTHORIZATION}

ℹ️ Este bloque de tests verifica la funcionalidad del sistema.
   Se recomienda ejecutarlo con USE_AUTHORIZATION=false para evitar errores por permisos.
`);

let token = null;
let headers = () => ({});
let createdId = null;
const basePath = '/api/instrumentos';

beforeAll(async () => {
    if (USE_AUTHENTICATION) {
        const loginRes = await request(app)
            .post('/api/usuarios/login')
            .send({ mail: 'test@fake.com', password: '1234' });

        if (loginRes.statusCode !== 200 || !loginRes.body.accessToken) {
            throw new Error(`
                ❌ Falló el login del usuario de test.
                No se encontró el usuario test@fake.com con password 1234.
                El sistema requiere autenticación para correr los tests.
            `);
        }

        token = loginRes.body.accessToken;
        headers = () => ({ Authorization: `Bearer ${token}` });
    }

    // 🧽 LIMPIEZA PREVIA: eliminar si ya existe 'TEST001'
    const encodedFilter = encodeURIComponent(JSON.stringify(['ticker', '=', 'TEST001']));
    const getRes = await request(app)
        .get(`${basePath}?$filter=${encodedFilter}`)
        .set(headers());

    if (getRes.statusCode === 200 && Array.isArray(getRes.body.data)) {
        const found = getRes.body.data.find(i => i.ticker === 'TEST001');
        if (found) {
            console.info('🧪 Eliminando instrumento previo con ticker TEST001');
            const delRes = await request(app)
                .delete(`${basePath}/${found.id}`)
                .set(headers());

            if (![204, 200].includes(delRes.statusCode)) {
                console.warn(`⚠️ No se pudo eliminar el instrumento TEST001 (status: ${delRes.statusCode})`);
            }
        }
    }
});

describe('CRUD de Instrumentos', () => {
    it('Debe crear un nuevo instrumento', async () => {
        const res = await request(app)
            .post(basePath)
            .set(headers())
            .send({
                ticker: 'TEST001',
                tipoInstrumentoId: 1,
                emisorId: 1,
                notas: 'Test de integración'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.ticker).toBe('TEST001');
        createdId = res.body.id;
    });

    it('Debe obtener la lista de instrumentos', async () => {
        const res = await request(app)
            .get(basePath)
            .set(headers());

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.some(item => item.id === createdId)).toBe(true);
    });

    it('Debe obtener un instrumento por ID', async () => {
        const res = await request(app)
            .get(`${basePath}/${createdId}`)
            .set(headers());

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(createdId);
        expect(res.body.ticker).toBe('TEST001');
    });

    it('Debe actualizar el instrumento', async () => {
        const res = await request(app)
            .put(`${basePath}/${createdId}`)
            .set(headers())
            .send({ notas: 'Modificado por test' });

        expect(res.statusCode).toBe(200);
        expect(res.body.notas).toBe('Modificado por test');
    });

    it('Debe eliminar el instrumento', async () => {
        const res = await request(app)
            .delete(`${basePath}/${createdId}`)
            .set(headers());

        expect(res.statusCode).toBe(204);
    });
});
