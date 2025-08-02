import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import JWT from './middleware/jwt_handle.js';
import logger from './utils/logger.js';
import { logRequest } from './middleware/logRequest.js';
import { routers } from './routersIndex.js';

process.loadEnvFile();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(logRequest(logger));

// Admitir multiples origenes, definirlos en .env como lista separada por coma (,)
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5500'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin.trim())) {
            callback(null, true);
        } else {
            callback(new Error('CORS bloqueado para origen: ' + origin));
        }
    },
    credentials: true
}));

// Carga centralizada de routers
routers.forEach(({ path, router }) => {
    app.use(path, router);
});

// Archivos estáticos y SPA
app.use(express.static(path.join(__dirname, '../public')));

// SPA fallback
app.get('/*splat', (req, res) => { // OJO: hasta la V4 de expres era '*'
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

// 404
app.use((req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.url} - IP: ${req.ip}`);
    res.status(404).json({ message: 'No existe el endpoint' });
});

try {
    JWT.verifyJWTSecret();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => logger.info(`Server running http://localhost:${PORT}`));
} catch (error) {
    console.error(error.message);
}
