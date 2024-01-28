"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMysqlDatabaseTypeString = exports.DefaultSqlTypeToTsTypeMap = void 0;
exports.DefaultSqlTypeToTsTypeMap = {
    'int': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `number | null`;
        }
        else {
            return `number${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'varchar': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `string | null`;
        }
        else {
            return `string${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'char': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `string | null`;
        }
        else {
            return `string${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'text': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `string | null`;
        }
        else {
            return `string${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'blob': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `Buffer | null`;
        }
        else {
            return `Buffer${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'float': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `number | null`;
        }
        else {
            return `number${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'double': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `number | null`;
        }
        else {
            return `number${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'decimal': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `number | null`;
        }
        else {
            return `number${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'boolean': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `1 | 0 | null`;
        }
        else {
            return `1 | 0${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'date': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `Date | null`;
        }
        else {
            return `Date${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'time': (param) => {
        if (param.TYPE === 'PARAMETER') {
            return `Date | null`;
        }
        else {
            return `Date${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'datetime': 'Date | null',
    'timestamp': 'Date | null',
    'year': 'number | null',
    'enum': (param) => {
        if (param.TYPE === 'PARAMETER') {
            // extract enum values from PARAMETER_NAME
            const enumValues = param.DTD_IDENTIFIER.replace(/enum\((.*)\)/, '$1').split(',').map(value => value.replace(/'/g, '').trim());
            return enumValues?.map(value => `'${value}'`).join(' | ') + " | null" || 'any';
        }
        else {
            // extract enum values from DTD_IDENTIFIER
            const enumValues = param.COLUMN_TYPE.replace(/enum\((.*)\)/, '$1').split(',').map(value => value.replace(/'/g, '').trim());
            return `${enumValues.map(value => `'${value}'`).join(' | ')}${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'set': (param) => {
        if (param.TYPE === 'PARAMETER') {
            // extract set values from PARAMETER_NAME
            const setValues = param.DTD_IDENTIFIER.replace(/set\((.*)\)/, '$1').split(',').map(value => value.replace(/'/g, '').trim());
            return `GenerateSetCombinations<${setValues.map(value => `'${value}'`).join(' | ')}> | null`;
        }
        else {
            // extract set values from DTD_IDENTIFIER
            const setValues = param.COLUMN_TYPE.replace(/set\((.*)\)/, '$1').split(',').map(value => value.replace(/'/g, '').trim());
            return setValues ? `GenerateSetCombinations<${setValues.map(value => `'${value}'`).join(' | ')}>${param.IS_NULLABLE === 'YES' ? ' | null' : ''}` : 'any';
        }
    },
    'bit': '1 | 0 | null',
    'json': '{[key:string]:any} | any[] | null',
    'tinyint': 'number | null',
    'smallint': 'number | null',
    'mediumint': 'number | null',
    'bigint': 'number | null',
    'longtext': 'string | null',
    'mediumtext': 'string | null',
    'tinytext': 'string | null',
    'binary': 'Buffer | null',
    'varbinary': 'Buffer | null',
    'geometry': 'Buffer | string',
    'point': 'Buffer | string',
    'linestring': 'Buffer | string',
    'polygon': 'Buffer | string',
    'multipoint': 'Buffer | string',
    'multilinestring': 'Buffer | string',
    'multipolygon': 'Buffer | string',
    'geometrycollection': 'Buffer | string',
    'json_table': 'Buffer | null',
};
async function query(connection, ...params) {
    return new Promise((resolve, reject) => {
        connection.query(...params, (err, values) => {
            if (err)
                return reject(err);
            resolve(values);
        });
    });
}
async function getDatabaseName(connection) {
    const result = await query(connection, 'SELECT DATABASE() as `database`');
    return result[0].database;
}
async function getRoutines(connection, database) {
    const routines = await query(connection, `
        SELECT
            *
        FROM
            information_schema.ROUTINES
        WHERE
            ROUTINE_SCHEMA = ? AND
            ROUTINE_TYPE = 'PROCEDURE'
    `, [database]);
    return routines;
}
async function getRoutineParameters(connection, database) {
    const parameters = await query(connection, `
        SELECT
            *,
            'PARAMETER' as 'TYPE'
        FROM
            information_schema.PARAMETERS
        WHERE
            SPECIFIC_SCHEMA = ?
    `, [database]);
    return parameters;
}
async function getTablesWithColumns(connection, database) {
    const columns = await query(connection, `
        SELECT
            *,
            'COLUMN' as 'TYPE'
        FROM
            information_schema.COLUMNS
        WHERE
            TABLE_SCHEMA = ?
    `, [database]);
    return Object.values(columns.reduce((acc, column) => {
        if (!acc[column.TABLE_NAME])
            acc[column.TABLE_NAME] = {
                TABLE_NAME: column.TABLE_NAME,
                COLUMNS: []
            };
        acc[column.TABLE_NAME].COLUMNS.push(column);
        return acc;
    }, {}));
}
async function getRoutinesWithParameters(connection, database) {
    const routines = await getRoutines(connection, database);
    const parameters = await getRoutineParameters(connection, database);
    const routinesWithParameters = routines.map(routine => {
        return {
            ...routine,
            PARAMETERS: [...parameters.filter(parameter => parameter.SPECIFIC_NAME === routine.SPECIFIC_NAME)].sort((a, b) => a.ORDINAL_POSITION - b.ORDINAL_POSITION),
        };
    });
    return routinesWithParameters;
}
function getRoutineParametersType(parameters, typeMap, spacer = '') {
    return `${parameters.map(parameter => {
        if (!typeMap[parameter.DATA_TYPE])
            return `${parameter.PARAMETER_NAME} : any`;
        if (typeof typeMap[parameter.DATA_TYPE] === 'string')
            return `${parameter.PARAMETER_NAME} : ${typeMap[parameter.DATA_TYPE]}`;
        if (typeof typeMap[parameter.DATA_TYPE] === 'function')
            return `${parameter.PARAMETER_NAME} : ${typeMap[parameter.DATA_TYPE](parameter)}`;
    }).join(`,${spacer}`)}`;
}
function getTableColumnsType(columns, typeMap, spacer = '') {
    return `${columns.map(column => {
        if (!typeMap[column.DATA_TYPE])
            return `${column.COLUMN_NAME} : any`;
        if (typeof typeMap[column.DATA_TYPE] === 'string')
            return `${column.COLUMN_NAME} : ${typeMap[column.DATA_TYPE]}`;
        if (typeof typeMap[column.DATA_TYPE] === 'function')
            return `${column.COLUMN_NAME} : ${typeMap[column.DATA_TYPE](column)}`;
    }).join(`,${spacer}`)}`;
}
async function generateMysqlDatabaseTypeString(connection, typeMap = exports.DefaultSqlTypeToTsTypeMap) {
    const SqlTypeToTsTypeMap = {
        ...exports.DefaultSqlTypeToTsTypeMap,
        ...typeMap
    };
    const database = await getDatabaseName(connection);
    const routinesWithParameters = await getRoutinesWithParameters(connection, database);
    const tablesWithColumns = await getTablesWithColumns(connection, database);
    const ts = `export type GenerateSetCombinations<T extends string, U extends string = T> = T extends any ? \`\${T},\${GenerateSetCombinations<Exclude<U, T>>}\` | T : never;\n\n` +
        `export type ${database.replaceAll('-', '_')}Schema = { \n\t${[
            `routines : {\n\t\t${routinesWithParameters.map(routine => {
                return `${routine.ROUTINE_NAME} : {\n\t\t\t${[
                    `parameters : [\n\t\t\t\t${getRoutineParametersType(routine.PARAMETERS, SqlTypeToTsTypeMap, '\n\t\t\t\t')}\n\t\t\t]`,
                    'returns : any[][]'
                ].join(' ,\n\t\t\t')}\n\t\t}`;
            }).join(' ,\n\t\t')}\n\t}`,
            `tables : {\n\t\t${tablesWithColumns.map(table => {
                return `${table.TABLE_NAME} : {\n\t\t\t${[
                    `columns : {\n\t\t\t\t${getTableColumnsType(table.COLUMNS, SqlTypeToTsTypeMap, '\n\t\t\t\t')}\n\t\t\t}`
                ].join(' ,\n\t\t\t')}\n\t\t}`;
            }).join(' ,\n\t\t')}\n\t}`
        ].join(' ,\n\t')}\n}`;
    return ts;
}
exports.generateMysqlDatabaseTypeString = generateMysqlDatabaseTypeString;
exports.default = generateMysqlDatabaseTypeString;
//# sourceMappingURL=generator.js.map