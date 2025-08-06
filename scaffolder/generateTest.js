// scaffold/generateTest.js
import fs from 'fs';
import path from 'path';

export async function generateTest (config, outputDir) {
    const { entidad, plural, test = {} } = config;
    const pluralLower = plural[0].toLowerCase() + plural.slice(1);
    const entidadLower = entidad[0].toLowerCase() + entidad.slice(1);

    const campoUnico = test.campoUnico || 'ticker';
    const valorTest = test.valorTest || 'TEST001';
    const payloadBase = test.payloadBase || {
        tipoInstrumentoId: 1,
        emisorId: 1,
        notas: 'Test generado'
    };

    const payloadCompleto = {
        ...payloadBase,
        [campoUnico]: valorTest
    };

    const payloadString = JSON.stringify(payloadCompleto, null, 4).replace(/"([^(")"]+)":/g, '$1:');

    const code = `import request from 'supertest';
import app from '../src/app.js';
import { describe, it, expect, beforeAll } from 'vitest';

process.loadEnvFile();

const USE_AUTHENTICATION = process.env.USE_AUTHENTICATION === 'true';
const USE_AUTHORIZATION = process.env.USE_AUTHORIZATION === 'true';

console.info(\`
🔐 Configuración de seguridad para los tests:
   🔑 Autenticación (USE_AUTHENTICATION): \${USE_AUTHENTICATION}
   🛡️ Autorización   (USE_AUTHORIZATION):  \${USE_AUTHORIZATION}

ℹ️ Este bloque de tests verifica la funcionalidad del sistema.
   Se recomienda ejecutarlo con USE_AUTHORIZATION=false para evitar errores por permisos.
\`);

let token = null;
let headers = () => ({});
let createdId = null;
const basePath = '/api/${pluralLower}';

beforeAll(async () => {
    if (USE_AUTHENTICATION) {
        const loginRes = await request(app)
            .post('/api/usuarios/login')
            .send({ mail: 'test@fake.com', password: '1234' });

        if (loginRes.statusCode !== 200 || !loginRes.body.accessToken) {
            throw new Error(\`
            ❌ Falló el login del usuario de test.
            No se encontró el usuario test@fake.com con password 1234.
            El sistema requiere autenticación para correr los tests.
            \`);
        }

        token = loginRes.body.accessToken;
        headers = () => ({ Authorization: \`Bearer \${token}\` });
    }

    const encodedFilter = encodeURIComponent(JSON.stringify(['${campoUnico}', '=', '${valorTest}']));
    const getRes = await request(app)
        .get(\`\${basePath}?$filter=\${encodedFilter}\`)
        .set(headers());

    if (getRes.statusCode === 200 && Array.isArray(getRes.body.data)) {
        const found = getRes.body.data.find(i => i.${campoUnico} === '${valorTest}');
        if (found) {
            console.info('🧪 Eliminando ${entidadLower} previo con ${campoUnico} ${valorTest}');
            const delRes = await request(app)
                .delete(\`\${basePath}/\${found.id}\`)
                .set(headers());

            if (![204, 200].includes(delRes.statusCode)) {
                console.warn(\`⚠️ No se pudo eliminar el ${entidadLower} (status: \${delRes.statusCode})\`);
            }
        }
    }
});

describe('CRUD de ${plural}', () => {
    it('Debe crear un nuevo ${entidadLower}', async () => {
        const res = await request(app)
            .post(basePath)
            .set(headers())
            .send(${payloadString});

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.${campoUnico}).toBe('${valorTest}');
        createdId = res.body.id;
    });

    it('Debe obtener la lista de ${pluralLower}', async () => {
        const res = await request(app)
            .get(basePath)
            .set(headers());

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.some(item => item.id === createdId)).toBe(true);
    });

    it('Debe obtener un ${entidadLower} por ID', async () => {
        const res = await request(app)
            .get(\`\${basePath}/\${createdId}\`)
            .set(headers());

        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(createdId);
        expect(res.body.${campoUnico}).toBe('${valorTest}');
    });

    it('Debe actualizar el ${entidadLower}', async () => {
        const res = await request(app)
            .put(\`\${basePath}/\${createdId}\`)
            .set(headers())
            .send({ notas: 'Modificado por test' });

        expect(res.statusCode).toBe(200);
        expect(res.body.notas).toBe('Modificado por test');
    });

    it('Debe eliminar el ${entidadLower}', async () => {
        const res = await request(app)
            .delete(\`\${basePath}/\${createdId}\`)
            .set(headers());

        if (USE_AUTHORIZATION) {
            console.info('🛡️ Verificando que el usuario sin permisos sea rechazado (403)');
            expect(res.statusCode).toBe(403);
        } else {
            console.info('✅ Autorización desactivada: se permite eliminar (204 esperado)');
            expect(res.statusCode).toBe(204);
        }
    });
});
`;

    const outPath = path.resolve(outputDir, `${pluralLower}.test.js`);
    fs.writeFileSync(outPath, code);
    console.log(`✅ Test generado en: ${outPath}`);
}
