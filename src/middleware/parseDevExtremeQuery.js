import logger from '../utils/logger.js';
/**
 * Factoria de parseDevExtremeQuery
 * @param {Array} allowedFields
 * @returns {Function} parseDevExtremeQuery() - middleware
 */
export function createParseDevExtremeQuery () {
    /**
     * Middleware para parsear los parámetros de filtro, orden y paginación
     * enviados por DevExtreme en una solicitud HTTP.
     * Transforma estos parámetros en estructuras utilizables por el backend
     * para generar consultas SQL seguras.
     *
     * Agrega al objeto `req` la propiedad `devExtremeQuery` con el siguiente formato:
     * req.devExtremeQuery = { where, values, order, limit, offset }
     *
     * @param {Request} req - Objeto de solicitud HTTP de Express.
     * @param {Response} res - Objeto de respuesta HTTP de Express.
     * @param {Function} next - Función para pasar al siguiente middleware.
     */
    return function parseDevExtremeQuery (req, res, next) {
        const allowedFields = req.allowedFields;
        const { $filter: filter, $sort: sort, $skip: skip, $take: take } = req.query;

        let where = '';
        let values = [];
        if (filter) {
            try {
                const parsedFilter = JSON.parse(filter); // DevExtreme envía filtros como JSON string
                const result = parseFilter(parsedFilter, allowedFields);
                where = result.where;
                values = result.values;
            } catch (error) {
                logger.error(error);
                return res.status(400).send({ error: 'Invalid filter format' });
            }
        }

        // Orden
        let order = [];
        if (sort) {
            try {
                const sortArray = JSON.parse(sort);
                order = sortArray
                    .map((s) => {
                        const resolvedField = resolveField(s.selector, allowedFields);
                        if (!resolvedField) {
                            console.warn(`Orden no agregado para campo no permitido: ${s.selector}`);
                            return null; // Ignorar campos no permitidos
                        }
                        return `${resolvedField} ${s.desc ? 'DESC' : 'ASC'}`;
                    });
            } catch (error) {
                logger.error(error);
                return res.status(400).send({ error: 'Invalid sort format' });
            }
        }

        // Paginación
        const limit = parseInt(take) || 999999999999;
        const offset = parseInt(skip) || 0;

        req.devExtremeQuery = { where, values, order, limit, offset };
        next();
    };
}

/**
 * Verifica si un campo acepta filter o sort (porque esta en la consulta general)
 * y en caso de que si se acepte devuelve el nombre con el que debe incluirse
 * por ejemplo si el select dice a.nombre as autoridad, resolveFieds recibe autoridad, lo da por valido y devuelve a.nombre
 * @param {string} field - campo a analizar
 * @param {Object} allowedFields - objeto con {campoPermitido: "tabla.campo"} es decir como debe quedar en el where o sort
 * @returns el campo a usar o null si no es permitido
 */
function resolveField (field, allowedFields) {
    if (allowedFields[field]) {
        return allowedFields[field];
    }
    console.warn(`Campo no permitido: ${field}`);
    return null; // Ignorar campos no permitidos
}

/**
 * Convierte el filtro enviado por DevExtreme DataGrid en un objeto que
 * contiene una cláusula SQL `WHERE` y los valores asociados.
 *
 * @param {Array} filter - Filtro enviado por DevExtreme en formato JSON.
 * @param {Array} allowedFields - Lista de campos permitidos para esta entidad.
 * @returns {{ where: string, values: Array }} Objeto con la cláusula SQL y los valores.
 */
function parseFilter (filter, allowedFields) {
    const { where, values } = parseFilterRecursive(filter, allowedFields);
    return { where, values };
}

function parseFilterRecursive (filt, allowedFields) {
    let where = '';
    const values = [];

    if (Array.isArray(filt)) {
    // Caso 1: Filtro simple de la forma ["Campo","Operador","Valor"]
        if (filt.length === 3 && typeof filt[0] === 'string') {
            const [field, operator, value] = filt;
            const resolvedField = resolveField(field, allowedFields);
            const { where: w, values: v } = processCondition(resolvedField, operator, value);
            where += w;
            values.push(...v);
            return { where, values };
        } else {
            // Caso 2: Filtro compuesto: puede tener subarrays y operadores lógicos
            where += '(';
            for (let i = 0; i < filt.length; i++) {
                const element = filt[i];
                if (Array.isArray(element)) {
                    const { where: w, values: v } = parseFilterRecursive(element, allowedFields);
                    where += w;
                    values.push(...v);
                } else if (element === 'and' || element === 'or') {
                    where += ` ${element.toUpperCase()} `;
                } else {
                    logger.error(`Unsupported filter format: ${JSON.stringify(element)}`);
                    throw new Error(`Unsupported filter format: ${JSON.stringify(element)}`);
                }
            }
            where += ')';
            return { where, values };
        }
    } else {
        logger.error(`Unsupported filter format: ${JSON.stringify(filt)}`);
        throw new Error(`Unsupported filter format: ${JSON.stringify(filt)}`);
    }
}

function processCondition (field, operator, value) {
    if (!field) {
        console.warn('Condición no procesada porque el campo no es válido.');
        return { where: '1=0', values: [] }; // No agrega nada al WHERE
    }

    let w = '';
    const v = [];
    switch (operator) {
    case 'contains':
        w = `${field} LIKE ?`;
        v.push(`%${value}%`);
        break;
    case 'startswith':
        w = `${field} LIKE ?`;
        v.push(`${value}%`);
        break;
    case 'endswith':
        w = `${field} LIKE ?`;
        v.push(`%${value}`);
        break;
    case '=':
        w = `${field} = ?`;
        v.push(value);
        break;
    case '!=':
        w = `${field} <> ?`;
        v.push(value);
        break;
    case '>':
    case '<':
    case '>=':
    case '<=':
        w = `${field} ${operator} ?`;
        v.push(value);
        break;
    default:
        logger.error(`Unsupported operator: ${operator}`);
        return { where: '1=0', values: [] };
    }
    return { where: w, values: v };
}
