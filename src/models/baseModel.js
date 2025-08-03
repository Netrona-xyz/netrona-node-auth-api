// base_model.js
export class BaseModel {
    constructor (row, fields) {
        for (const field of fields) {
            this[field.name] = BaseModel.#parseField(field, row[field.name]);
        }
    }

    static #parseField (field, value) {
        if (value === null || value === undefined) return value;
        switch (field.type) {
        case 'int': return parseInt(value);
        case 'float': return parseFloat(value);
        default: return value;
        }
    }

    static toJson (obj, fields) {
        return Object.fromEntries(fields.map(f => [f.name, obj[f.name]]));
    }

    static fromRows (rows, fields, ModelClass) {
        return rows.map(row => new ModelClass(row));
    }
}
