// scaffold/generateSchema.js
import fs from 'fs';
import path from 'path';
import { parseCampo } from './parseCampo.js';

function mapToZodField (campo) {
    const { baseType, args, isOptional, isPositive, isNonNegative } = campo;

    let zodType = '';

    switch (baseType) {
    case 'int':
        zodType = 'z.number().int()';
        if (isPositive) zodType += '.positive()';
        else if (isNonNegative) zodType += '.nonnegative()';
        break;

    case 'decimal':
        zodType = 'z.number()';
        if (isPositive) zodType += '.positive()';
        else if (isNonNegative) zodType += '.nonnegative()';
        break;

    case 'string': {
        const length = args?.[0] ?? '255';
        zodType = `z.string().max(${length})`;
        break;
    }

    case 'fecha':
    case 'date':
        zodType = 'dateSchema';
        break;

    default:
        zodType = 'z.any()';
    }

    if (isOptional && !zodType.includes('.optional()')) {
        zodType += '.optional()';
    }

    return zodType;
}

export async function generateSchema (config, output) {
    const { plural, campos } = config;
    const pluralLower = plural[0].toLowerCase() + plural.slice(1);

    const parsedCampos = campos.map(parseCampo);

    const zodFields = parsedCampos
        .filter(c => !c.isPk && !c.isJoin)
        .map(c => `    ${c.name}: ${mapToZodField(c)}`)
        .join(',\n');

    const usaFecha = parsedCampos.some(
        c => (c.baseType === 'fecha' || c.baseType === 'date') && !c.isJoin
    );

    const imports = ["import { z } from 'zod';"];
    if (usaFecha) imports.push("import { dateSchema } from '../utils/dateSchema.js';");

    const schemaCode = `${imports.join('\n')}

export const ${pluralLower}CreateSchema = z.object({
${zodFields}
});

export const ${pluralLower}UpdateSchema = ${pluralLower}CreateSchema.partial();
`;

    const outputDir = path.resolve(output);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const outPath = path.join(outputDir, `${pluralLower}_schema.js`);
    fs.writeFileSync(outPath, schemaCode);
    console.log(`✅ Schema generado en: ${outPath}`);
}
