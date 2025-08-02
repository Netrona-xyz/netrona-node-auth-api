import logger from '../utils/logger.js';
import JWT from './jwt_handle.js';

/**
 * Middleware que valida que en el Header -> Authorization -> Bearer "token"
 * venga un token valido
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function checkJwt (req, res, next) {
    try {
        const jwtByUser = req.headers.authorization || '';
        const jwt = jwtByUser.split(' ').pop(); // separar "bearer token" y quedarnos con el token

        const jwtContent = JWT.verifyToken(jwt);
        logger.debug(`Token recibido: ${JSON.stringify(jwtContent)}`);
        req.userId = jwtContent.id;

        // todo: ver que devuelve JWT.verifyToken si no es valido
        // todo: implementar que el id y la fecha/hora se sumen en el req y que las grabaciones los utilicen
        // Devuelve : { mail: 'p.berdasco@gmail.com', iat: 1682194139, exp: 1682201339 }
        // incluso se le puede agregar al req algo de info para que le llegue al proximo paso (middleware o final)
        // por ejemplo req.user = {mail: jwtContent.mail}
        // si se le pasa al proximo middleware que es un logger, puede logear al usuario
        // si se le pasa en la cadena a un middleware que es un contador de accesos, puede contar por usuario
        // si le llega a final con un array de autorizaciones puede ver si devuelve o no devuelve datos / realiza la operacion

        // eventualmente aqui tambien se puede hacer alguna valiacion generica
        // if (jwtContent.id != habilitado)
        //     res.status(401).send("Session invalida. JWT invalido")
        // else
        next();
    } catch (error) {
        res.status(400).send('Session invalida. ' + error);
    }
}
