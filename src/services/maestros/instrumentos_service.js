import { getAllWithJoins, getByIdWithJoins, createRecord, updateRecord, deleteRecord } from '../baseCrudService.js';
import Instrumento from '../../models/maestros/instrumentos_model.js';

const table = 'Instrumentos';
const selectBase = 'SELECT i.id, i.tipoInstrumentoId, t.nombre as tipoInstrumento, t.clase as claseInstrumento, i.emisorId, e.nombre as emisor, i.ticker, i.notas ';
const fromClause = 'FROM Instrumentos i LEFT JOIN TiposInstrumentos t ON i.tipoInstrumentoId = t.id LEFT JOIN Emisores e ON i.emisorId = e.id';
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
const noExiste = 'El instrumento no existe';
const yaExiste = 'El instrumento ya existe';
const tracking = true; // Activar tracking para esta entidad

export default class InstrumentosService {
    static getAllowedFields () {
        return allowedFields;
    }

    static async getAll (devExtremeQuery) {
        return await getAllWithJoins({ selectBase, fromClause, devExtremeQuery, Model: Instrumento });
    }

    static async getById (id) {
        return await getByIdWithJoins({ id, selectBase, fromClause, Model: Instrumento, notFoundMsg: noExiste });
    }

    static async create (recordToAdd, userId) {
        return await createRecord({ table, record: recordToAdd, Model: Instrumento, conflictMsg: yaExiste, tracking, userId });
    }

    static async update (id, record, userId) {
        return await updateRecord({ table, id, record, getByIdFn: this.getById, notFoundMsg: noExiste, tracking, userId });
    }

    static async delete (id) {
        return await deleteRecord({ table, id, notFoundMsg: noExiste });
    }
}
