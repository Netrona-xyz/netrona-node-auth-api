// baseCrudService.js
import { pool, dbErrorMsg } from '../database/db.js';

/**
 * Ejecuta una consulta SELECT paginada, filtrada y ordenada sobre una tabla con joins.
 * Utiliza parámetros generados por parseDevExtremeQuery.
 *
 * @param {Object} params
 * @param {string} params.selectBase - Fragmento SELECT con alias (ej. "SELECT i.id, t.nombre").
 * @param {string} params.fromClause - Fragmento FROM con joins (ej. "FROM tabla t LEFT JOIN ...").
 * @param {Object} params.devExtremeQuery - Objeto con where, values, order, limit y offset.
 * @param {Function} params.Model - Clase del modelo que implementa `fromRows`.
 * @returns {Promise<{ data: any[], totalCount: number }>} Resultados formateados.
 */
export async function getAllWithJoins ({ selectBase, fromClause, devExtremeQuery, Model }) {
    const { where, values, order, limit, offset } = devExtremeQuery;

    const countSql = `SELECT COUNT(*) as total ${fromClause} ${where ? `WHERE ${where}` : ''}`;
    const [countResult] = await pool.query(countSql, values);
    const totalCount = countResult[0].total;

    const sql = `${selectBase} ${fromClause}
                 ${where ? `WHERE ${where}` : ''}
                 ${order.length ? `ORDER BY ${order.join(', ')}` : ''}
                 LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const [rows] = await pool.query(sql, values);
    return { data: Model.fromRows(rows), totalCount };
}

/**
 * Obtiene un único registro por ID, con joins si es necesario.
 *
 * @param {Object} params
 * @param {number|string} params.id - ID del registro a buscar.
 * @param {string} params.selectBase - SELECT con campos y alias.
 * @param {string} params.fromClause - FROM con joins.
 * @param {Function} params.Model - Clase modelo para instanciar el resultado.
 * @param {string} params.notFoundMsg - Mensaje de error si no se encuentra el registro.
 * @returns {Promise<any>} Instancia del modelo con los datos encontrados.
 */
export async function getByIdWithJoins ({ id, selectBase, fromClause, Model, notFoundMsg }) {
    const sql = `${selectBase} ${fromClause} WHERE i.id = ?`;
    const [rows] = await pool.query(sql, [id]);
    if (rows.length === 0) throw dbErrorMsg(404, notFoundMsg);
    return new Model(rows[0]);
}

/**
 * Inserta un nuevo registro en la tabla especificada.
 *
 * @param {Object} params
 * @param {string} params.table - Nombre de la tabla.
 * @param {Object} params.record - Objeto con los datos a insertar.
 * @param {Function} params.Model - Clase modelo para devolver el objeto creado.
 * @param {string} params.conflictMsg - Mensaje de error si hay clave duplicada.
 * @param {boolean} [params.tracking=false] - Si se debe agregar automáticamente createUserId, lastUpdateUserId, createdAt y updatedAt.
 * @param {number|null} [params.userId=null] - ID del usuario autenticado para completar los campos de auditoría.
 * @returns {Promise<any>} Instancia del modelo con los datos insertados (incluye ID).
 */
export async function createRecord ({ table, record, Model, conflictMsg, tracking = false, userId = null }) {
    if (tracking && userId) {
        record.createUserId = userId;
        record.lastUpdateUserId = userId;
        record.createdAt = new Date();
        record.updatedAt = new Date();
    }
    try {
        const [rows] = await pool.query(`INSERT INTO ${table} SET ?`, [record]);
        record.id = rows.insertId;
        return new Model(record);
    } catch (error) {
        if (error?.code === 'ER_DUP_ENTRY') throw dbErrorMsg(409, conflictMsg);
        throw dbErrorMsg(error.status, error.sqlMessage || error.message);
    }
}

/**
 * Actualiza un registro existente por ID.
 *
 * @param {Object} params
 * @param {string} params.table - Nombre de la tabla.
 * @param {number|string} params.id - ID del registro a actualizar.
 * @param {Object} params.record - Datos nuevos del registro.
 * @param {Function} params.getByIdFn - Función para obtener el registro actualizado.
 * @param {string} params.notFoundMsg - Mensaje de error si no existe el registro.
 * @param {boolean} [params.tracking=false] - Si se debe agregar automáticamente lastUpdateUserId, updatedAt.
 * @param {number|null} [params.userId=null] - ID del usuario autenticado para completar los campos de auditoría.
 * @returns {Promise<any>} Registro actualizado (instancia del modelo).
 */
export async function updateRecord ({ table, id, record, getByIdFn, notFoundMsg, tracking = false, userId = null }) {
    if (tracking && userId) {
        record.lastUpdateUserId = userId;
        record.updatedAt = new Date();
    }
    const [rows] = await pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [record, id]);
    if (rows.affectedRows !== 1) throw dbErrorMsg(404, notFoundMsg);
    return await getByIdFn(id);
}

/**
 * Elimina un registro por ID, manejando restricciones de clave foránea.
 *
 * @param {Object} params
 * @param {string} params.table - Nombre de la tabla.
 * @param {number|string} params.id - ID del registro a eliminar.
 * @param {string} params.notFoundMsg - Mensaje si el registro no existe.
 * @returns {Promise<boolean>} `true` si fue eliminado exitosamente.
 */
export async function deleteRecord ({ table, id, notFoundMsg }) {
    try {
        const [rows] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
        if (rows.affectedRows !== 1) throw dbErrorMsg(404, notFoundMsg);
        return true;
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.sqlMessage?.includes('foreign key')) {
            throw dbErrorMsg(409, 'No se puede eliminar el recurso porque tiene dependencias asociadas.');
        }
        throw dbErrorMsg(error.status, error.sqlMessage || error.message);
    }
}
