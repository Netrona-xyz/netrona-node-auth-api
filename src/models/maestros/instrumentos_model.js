// instrumentos_model.js
import { BaseModel } from '../baseModel.js';

export default class Instrumento extends BaseModel {
    static fields = [
        { name: 'id', type: 'int' },
        { name: 'tipoInstrumentoId', type: 'int', fk: true },
        { name: 'tipoInstrumento', type: 'string', join: true },
        { name: 'claseInstrumento', type: 'string', join: true },
        { name: 'emisorId', type: 'int', fk: true },
        { name: 'emisor', type: 'string', join: true },
        { name: 'ticker', type: 'string' },
        { name: 'notas', type: 'string' }
    ];

    constructor (row) {
        super(row, Instrumento.fields);
        // ? Parseo o logica especifica
    }

    toJson () {
        return BaseModel.toJson(this, Instrumento.fields);
    }

    static fromRows (rows) {
        return BaseModel.fromRows(rows, Instrumento.fields, Instrumento);
    }
}
