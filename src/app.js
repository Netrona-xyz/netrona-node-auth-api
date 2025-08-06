import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import logger from './utils/logger.js';
import { logRequest } from './middleware/logRequest.js';
import { routers } from './routersIndex.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(logRequest(logger));

// CORS
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

// Rutas
routers.forEach(({ path, router }) => {
    app.use(path, router);
});

// Archivos estáticos y SPA fallback
app.use(express.static(path.join(__dirname, '../public')));
app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

// 404
app.use((req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.url} - IP: ${req.ip}`);
    res.status(404).json({ message: 'No existe el endpoint' });
});

export default app;
