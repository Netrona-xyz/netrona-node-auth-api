// scaffold/utils/parseCampo.js

/**
 * Parsea una definición de campo del config ("nombre:tipo:flag1:flag2")
 * y devuelve un objeto estructurado.
 *
 * @param {string} campoStr - Ejemplo: "nombre:string(30):join"
 * @returns {{
 *   name: string,
 *   type: string,
 *   rawType: string,
 *   baseType: string,
 *   args: string[],
 *   isPk: boolean,
 *   isFk: boolean,
 *   isJoin: boolean,
 *   isHidden: boolean,
 *   isOptional: boolean,
 *   isPositive: boolean,
 *   isNonNegative: boolean
 * }}
 */
function parseCampo (campoStr) {
    const partes = campoStr.split(':');
    const name = partes[0];
    const rawType = partes[1];
    const flags = partes.slice(2);

    const match = rawType.match(/^([a-zA-Z]+)(?:\(([^)]+)\))?$/);
    const baseType = match?.[1] ?? 'any';
    const args = match?.[2]?.split(',') ?? [];

    // Flags numéricos por tipo
    const isPositive = args.includes('+');
    const isNonNegative = args.includes('0');
    const isOptional = flags.includes('opt');

    return {
        name,
        type: baseType,
        rawType,
        baseType,
        args,
        isPk: flags.includes('pk'),
        isFk: flags.includes('fk'),
        isJoin: flags.includes('join'),
        isHidden: flags.includes('hidden'),
        isOptional,
        isPositive,
        isNonNegative
    };
}

/**
 * Parsea un array de definiciones tipo ["id:int:pk", ...] a objetos de campo.
 * @param {string[]} campos
 * @returns {ReturnType<typeof parseCampo>[]} Campos estructurados
 */
function parseCampos (campos) {
    return campos.map(parseCampo);
}

export { parseCampo, parseCampos };
