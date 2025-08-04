// scaffold/generateModel.js
import fs from 'fs';
import path from 'path';
import { parseCampos } from './parseCampo.js';

export async function generateModel (config, output) {
    const { entidad, plural, campos } = config;
    const pluralLower = plural[0].toLowerCase() + plural.slice(1);
    const parsedCampos = parseCampos(campos);

    const fieldsCode = parsedCampos.map(c => {
        const attrs = [];
        if (c.isPk) attrs.push('pk');
        if (c.isFk) attrs.push('fk');
        if (c.isJoin) attrs.push('join');
        if (c.args?.[0] === '0') attrs.push('>=0');
        if (c.args?.[0] === '+') attrs.push('>=1');
        if (c.flags?.includes('opt')) attrs.push('opt');

        const typeStr = c.args.length
            ? `${c.baseType}(${c.args.join(',')})`
            : c.baseType;

        const attrPart = attrs.length ? `, attr: [${attrs.map(a => `'${a}'`).join(', ')}]` : '';
        return `        { name: '${c.name}', type: '${typeStr}'${attrPart} }`;
    }).join(',\n');

    const modelCode = `// ${entidad.toLowerCase()}_model.js
import { BaseModel } from '../baseModel.js';

export default class ${entidad} extends BaseModel {
    static fields = [
${fieldsCode}
    ];

    constructor (row) {
        super(row, ${entidad}.fields);
        // ? Parseo o lógica específica
    }

    toJson () {
        return BaseModel.toJson(this, ${entidad}.fields);
    }

    static fromRows (rows) {
        return BaseModel.fromRows(rows, ${entidad}.fields, ${entidad});
    }
}
`;

    const outputDir = path.resolve(output);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    const outPath = path.join(outputDir, `${pluralLower}_model.js`);
    fs.writeFileSync(outPath, modelCode);
    console.log(`✅ Modelo generado en: ${outPath}`);
}
