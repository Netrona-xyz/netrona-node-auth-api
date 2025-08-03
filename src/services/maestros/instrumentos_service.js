import { pool, dbErrorMsg } from '../../database/db.js';
import Instrumento from '../../models/maestros/instrumentos_model.js';

const allowedFields = {
    id: 'i.id',
    tipoInstrumentoId: 'i.tipoInstrumentoId',
    tipoInstrumento: 't.nombre',
    claseInstrumento: 't.clase',
    emisorId: 'i.nombreBase',
    emisor: 'e.nombre',
    ticker: 'i.ticker',
    notas: 'i.notas'
};

const table = 'Instrumentos';
const selectBase = 'SELECT i.id, i.tipoInstrumentoId, t.nombre as tipoInstrumento, t.clase as claseInstrumento, ' +
                   'i.emisorId, e.nombre as emisor, i.ticker, i.notas ';
const selectTables = 'FROM Instrumentos i ' +
                     'LEFT JOIN TiposInstrumentos t ON i.tipoInstrumentoId = t.id ' +
                     'LEFT JOIN Emisores e ON i.emisorId = e.id ';
const mainTable = 'i';
const noExiste = 'El instrumento no existe';
const yaExiste = 'El instrumento ya existe';

export default class InstrumentosService {
    static getAllowedFields () {
        return allowedFields;
    }

    static async getAll (devExtremeQuery) {
        const { where, values, order, limit, offset } = devExtremeQuery;

        try {
            const countSql = `SELECT COUNT(*) as total ${selectTables} ${where ? `WHERE ${where}` : ''}`;

            const [countResult] = await pool.query(countSql, values);
            const totalCount = countResult[0].total;

            const sql = `${selectBase} ${selectTables}
                         ${where ? `WHERE ${where}` : ''}
                         ${order.length ? `ORDER BY ${order.join(', ')}` : ''}
                         LIMIT ? OFFSET ?`;
            values.push(limit, offset);
            const [rows] = await pool.query(sql, values);

            return { data: Instrumento.fromRows(rows), totalCount };
        } catch (error) {
            throw dbErrorMsg(error.status, error.sqlMessage || error.message);
        }
    }

    static async getById (id) {
        try {
            const [rows] = await pool.query(`${selectBase} ${selectTables} WHERE ${mainTable}.id = ?`, [id]);
            if (rows.length === 0) throw dbErrorMsg(404, noExiste);
            return new Instrumento(rows[0]);
        } catch (error) {
            throw dbErrorMsg(error.status, error.sqlMessage || error.message);
        }
    }

    static async create (recordToAdd) {
        try {
            const [rows] = await pool.query(`INSERT INTO ${table} SET ?`, [recordToAdd]);
            recordToAdd.id = rows.insertId;
            const insertedRecord = new Instrumento(recordToAdd);
            // TODO: postInsert
            return insertedRecord;
        } catch (error) {
            if (error?.code === 'ER_DUP_ENTRY') throw dbErrorMsg(409, yaExiste);
            throw dbErrorMsg(error.status, error.sqlMessage || error.message);
        }
    }

    static async update (id, muestra) {
        try {
            // TODO: preUpdate?
            const [rows] = await pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [muestra, id]);
            if (rows.affectedRows !== 1) throw dbErrorMsg(404, noExiste);
            const updatedRecord = await InstrumentosService.getById(id);
            // TODO postUpdate?
            return updatedRecord;
        } catch (error) {
            throw dbErrorMsg(error.status, error.sqlMessage || error.message);
        }
    }

    static async delete (id) {
        try {
            // TODO: preDelete?
            const [rows] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
            if (rows.affectedRows !== 1) throw dbErrorMsg(404, noExiste);
            // TODO: posDelete?
            return true;
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.sqlMessage?.includes('foreign key constraint')) {
                throw dbErrorMsg(409, 'No se puede eliminar el recurso porque tiene dependencias asociadas.');
            }
            throw dbErrorMsg(error.status, error.sqlMessage || error.message);
        }
    }
}
