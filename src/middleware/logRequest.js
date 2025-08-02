export function logRequest (logger) {
    return (req, res, next) => {
        const startTime = Date.now();
        const clientIP = req.ip || 'unknown';
        const endpoint = decodeURIComponent(req.originalUrl || req.url);

        res.on('finish', () => {
            const now = new Date();
            const formattedDate = now.toISOString();
            const duration = Date.now() - startTime;

            if (!req.url.startsWith('/js/')) {
                logger.info(`Received ${req.method} for ${endpoint} - Status: ${res.statusCode} - Time: ${duration}ms - At: ${formattedDate} - from clientIP: ${clientIP}`);
            }
        });

        next();
    };
}
