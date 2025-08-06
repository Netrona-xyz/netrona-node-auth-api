// server.js
import app from './app.js';
import JWT from './middleware/jwt_handle.js';
import logger from './utils/logger.js';

try {
    JWT.verifyJWTSecret();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => logger.info(`Server running http://localhost:${PORT}`));
} catch (error) {
    console.error(error.message);
}
