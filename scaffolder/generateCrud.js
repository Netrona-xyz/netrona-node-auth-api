// scaffold/generateCrud.js
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { generateModel } from './generateModel.js';
import { generateService } from './generateService.js';
import { generateController } from './generateController.js';
import { generateSchema } from './generateSchema.js';
import { generateRouter } from './generateRouter.js';
import { generateTest } from './generateTest.js';

const entitiesDir = './scaffolder/entities/';
const outputDir = './scaffolder/output';

async function promptForConfigFile () {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => {
        rl.question('Ingrese el nombre del archivo de config (ej: instrumento_entity_config.json): ', answer => {
            rl.close();
            resolve(answer);
        });
    });
}

async function main () {
    const argPath = process.argv[2];
    const fileName = argPath || await promptForConfigFile();
    const configPath = path.resolve(entitiesDir, fileName);

    if (!fs.existsSync(configPath)) {
        console.error(`No existe el archivo: ${configPath}`);
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    // Ejecutar generadores
    await generateModel(config, outputDir);
    await generateService(config, outputDir);
    await generateController(config, outputDir);
    await generateSchema(config, outputDir);
    await generateRouter(config, outputDir);
    await generateTest(config, outputDir);
}

main();
