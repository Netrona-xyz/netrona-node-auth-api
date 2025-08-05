// scaffold/generateService.js
import fs from 'fs';
import path from 'path';
import { parseCampos } from './parseCampo.js';

export async function generateService (config, output) {
    const { grupo, entidad, plural, tabla, alias, campos, joins = [] } = config;
    // const entidadLower = entidad.toLowerCase();
    const pluralLower = plural[0].toLowerCase() + plural.slice(1);
    const parsedCampos = parseCampos(campos);

    const importModel = `import ${entidad} from '../../models/${grupo}/${pluralLower}_model.js';`;

    const baseFields = parsedCampos
        .filter(c => !c.isJoin)
        .map(c => `${alias}.${c.name}`);

    const joinFields = parsedCampos
        .filter(c => c.isJoin)
        .map(c => {
            const j = joins.flatMap(j => j.select).find(sel => sel.includes(` as ${c.name}`));
            return j;
        })
        .filter(Boolean);

    const selectBase = `SELECT ${[...baseFields, ...joinFields].join(', ')}`;
    const fromClause = `FROM ${tabla} ${alias} ` + joins.map(j => `LEFT JOIN ${j.tabla} ${j.alias} ON ${j.on}`).join(' ');

    const allowedFields = {};
    parsedCampos.forEach(c => {
        if (!c.isJoin) allowedFields[c.name] = `${alias}.${c.name}`;
    });
    joins.forEach(j => {
        j.select.forEach(sel => {
            const [, asAlias] = sel.split(' as ');
            const [tablaCampo] = sel.split(' as ');
            allowedFields[asAlias.trim()] = tablaCampo.trim();
        });
    });

    // const allowedFieldsCode = JSON.stringify(allowedFields, null, 4);
    const allowedFieldsCode = '{\n' +
        Object.entries(allowedFields)
            .map(([key, value]) => `    ${key}: '${value}'`)
            .join(',\n') +
        '\n}';

    const serviceCode = `import { getAllWithJoins, getByIdWithJoins, createRecord, updateRecord, deleteRecord } from '../baseCrudService.js';
${importModel}

const table = '${tabla}';
const selectBase = '${selectBase}';
const fromClause = '${fromClause}';
const allowedFields = ${allowedFieldsCode};
const noExiste = 'El ${entidad} no existe';
const yaExiste = 'El ${entidad} ya existe';
const tracking = true; // Activar tracking para esta entidad

export default class ${plural}Service {
    static getAllowedFields () {
        return allowedFields;
    }

    static async getAll (devExtremeQuery) {
        return await getAllWithJoins({ selectBase, fromClause, devExtremeQuery, Model: ${entidad} });
    }

    static async getById (id) {
        return await getByIdWithJoins({ id, selectBase, fromClause, Model: ${entidad}, notFoundMsg: noExiste });
    }

    static async create (recordToAdd, userId) {
        return await createRecord({ table, record: recordToAdd, Model: ${entidad}, conflictMsg: yaExiste, tracking, userId });
    }

    static async update (id, record, userId) {
        return await updateRecord({ table, id, record, getByIdFn: this.getById, notFoundMsg: noExiste, tracking, userId });
    }

    static async delete (id) {
        return await deleteRecord({ table, id, notFoundMsg: noExiste });
    }
}
`;

    const outputDir = path.resolve(output);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    const outPath = path.join(outputDir, `${pluralLower}_service.js`);
    fs.writeFileSync(outPath, serviceCode);
    console.log(`✅ Service generado en: ${outPath}`);
}
