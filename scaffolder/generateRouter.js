import fs from 'fs';
import path from 'path';

export async function generateRouter (config, outputDir) {
    const { plural, grupo, derechos = {} } = config;

    const pluralLower = plural[0].toLowerCase() + plural.slice(1);
    const routerVar = `${pluralLower}Router`;
    const controllerImport = `${pluralLower}_controller.js`;

    const lines = [
        'import { Router } from \'express\';',
        `import ${plural}Controller from '../../controllers/${grupo}/${controllerImport}';`,
        'import { createParseDevExtremeQuery } from \'../../middleware/parseDevExtremeQuery.js\';',
        'import { authMiddleware } from \'../../middleware/auth.js\';'
    ];

    if (Object.values(derechos).some(Boolean)) {
        lines.push('import { requiereDerecho } from \'../../middleware/requiereDerecho.js\';');
    }

    lines.push(`\nexport const ${routerVar} = Router();`);
    lines.push('\nconst parseQuery = createParseDevExtremeQuery();\n');

    // Helpers
    const line = (method, path, derechoKey, middlewares) => {
        const derecho = derechos[derechoKey];
        const derechoMiddleware = derecho ? `requiereDerecho('${derecho}')` : null;
        const allMiddlewares = ['authMiddleware', ...middlewares];
        if (derechoMiddleware) allMiddlewares.splice(1, 0, derechoMiddleware);
        return `${routerVar}.${method}('${path}', ${allMiddlewares.join(', ')}, ${plural}Controller.${derechoKey});`;
    };

    // Rutas
    lines.push(line('get', '/', 'getAllowedFields', ['parseQuery', `${plural}Controller.getAll`]));
    lines.push(line('get', '/:id', 'getById', [`${plural}Controller.getById`]));
    lines.push(line('post', '/', 'create', [`${plural}Controller.create`]));
    lines.push(line('put', '/:id', 'update', [`${plural}Controller.update`]));
    lines.push(line('delete', '/:id', 'delete', [`${plural}Controller.delete`]));
    lines.push('');

    // Output
    const filePath = path.join(outputDir, `${pluralLower}_router.js`);
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`✅ Router generado en: ${filePath}`);
}
