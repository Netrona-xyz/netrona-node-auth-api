import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { pool, dbErrorMsg } from '../src/database/db.js';
import { fileURLToPath } from 'url';

// __dirname para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta a migraciones
const MIGRACIONES_DIR = path.resolve(__dirname, 'migraciones');

// Detectar --dry-run
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

async function aplicarMigraciones () {
    const conn = await pool.getConnection();
    try {
        // Leer scripts ya aplicados
        const [aplicadas] = await conn.query('SELECT nombreArchivo FROM MigracionesAplicadas');
        const yaAplicadas = new Set(aplicadas.map(r => r.nombreArchivo));

        // Leer archivos del directorio
        const archivos = (await readdir(MIGRACIONES_DIR))
            .filter(f => f.endsWith('.sql'))
            .sort();

        const pendientes = archivos.filter(a => !yaAplicadas.has(a));

        if (isDryRun) {
            if (pendientes.length > 0) {
                console.log('Modo dry-run activado. Las siguientes migraciones se aplicarían:');
                pendientes.forEach(a => console.log(`→ ${a}`));
            } else {
                console.log('Modo dry-run activado. No quedan migracione pendientes por aplicar');
            }
            conn.release();
            process.exit(0);
        }

        for (const archivo of pendientes) {
            const fullPath = path.join(MIGRACIONES_DIR, archivo);
            const sql = await readFile(fullPath, 'utf8');

            // Extraer comentario si está en la primera línea
            const primeraLinea = sql.split('\n')[0].trim();
            const comentario = primeraLinea.startsWith('--')
                ? primeraLinea.replace(/^--\s*/, '').slice(0, 254) // Limita a 255 caracteres
                : null;

            try {
                console.log(`→ Aplicando: ${archivo}`);
                console.log(sql);
                const statements = sql.split(/;\s*[\r\n]+/);
                for (const stmt of statements) {
                    if (stmt.trim()) {
                        await conn.query(stmt);
                    }
                }
                await conn.query(
                    'INSERT INTO MigracionesAplicadas (nombreArchivo, aplicadoPor, comentario) VALUES (?, ?, ?)',
                    [archivo, process.env.USER || 'script', comentario]
                );
                console.log(`✔ Aplicado: ${archivo}\n`);
            } catch (err) {
                console.error(`✗ Error en ${archivo}:`, err.message);
                throw dbErrorMsg(500, `Error al aplicar ${archivo}: ${err.message}`);
            }
        }

        if (pendientes.length === 0) {
            console.log(`✓ No hay migraciones pendientes en ${MIGRACIONES_DIR}`);
        }
    } catch (error) {
        console.error('✗ Error general:', error.message);
        throw dbErrorMsg(error.status || 500, error.message);
    } finally {
        conn.release();
        process.exit(0);
    }
}

// Ejecutar si se corre directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    try {
        await aplicarMigraciones();
        if (!isDryRun) console.log('✔ Migraciones completas');
    } catch (err) {
        console.error('✗ Falló la aplicación de migraciones:', err.message);
        process.exit(1);
    }
}
