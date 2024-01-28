import {Connection, RowDataPacket} from 'mysql2'


export type SqlDataType = 'int' | 'varchar' | 'char' | 'text' | 'blob' | 'float' | 'double' | 'decimal' | 'boolean' | 'date' | 'time' | 'datetime' | 'timestamp' | 'year' | 'enum' | 'set' | 'bit' | 'json' | 'tinyint' | 'smallint' | 'mediumint' | 'bigint' | 'longtext' | 'mediumtext' | 'tinytext' | 'binary' | 'varbinary' | 'geometry' | 'point' | 'linestring' | 'polygon' | 'multipoint' | 'multilinestring' | 'multipolygon' | 'geometrycollection' | 'json_table';
export type InformationSchemaRoutines = {
    SPECIFIC_NAME: string;
    ROUTINE_CATALOG: string | null;
    ROUTINE_SCHEMA: string;
    ROUTINE_NAME: string;
    ROUTINE_TYPE: 'PROCEDURE';
    DATA_TYPE: SqlDataType;
    CHARACTER_MAXIMUM_LENGTH: number | null;
    CHARACTER_OCTET_LENGTH: number | null;
    NUMERIC_PRECISION: number | null;
    NUMERIC_SCALE: number | null;
    DATETIME_PRECISION: number | null;
    CHARACTER_SET_NAME: string | null;
    COLLATION_NAME: string | null;
    DTD_IDENTIFIER: string | null;
    ROUTINE_BODY: 'SQL';
    ROUTINE_DEFINITION: string | null;
    EXTERNAL_NAME: string | null;
    EXTERNAL_LANGUAGE: string | null;
    PARAMETER_STYLE: 'SQL';
    IS_DETERMINISTIC: 'YES' | 'NO';
    SQL_DATA_ACCESS: string;
    SQL_PATH: string | null;
    SECURITY_TYPE: 'DEFINER' | 'INVOKER';
    CREATED: Date;
    LAST_ALTERED: Date;
    SQL_MODE: string;
    ROUTINE_COMMENT: string;
    DEFINER: string;
    CHARACTER_SET_CLIENT: string;
    COLLATION_CONNECTION: string;
    DATABASE_COLLATION: string;
};
export type InformationSchemaParameters = {
    TYPE: "PARAMETER";
    SPECIFIC_CATALOG: string | null;
    SPECIFIC_SCHEMA: string | null;
    SPECIFIC_NAME: string;
    ORDINAL_POSITION: number;
    PARAMETER_MODE: 'IN' | 'OUT' | 'INOUT' | null;
    PARAMETER_NAME: string ;
    DATA_TYPE: SqlDataType;
    CHARACTER_MAXIMUM_LENGTH: number | null;
    CHARACTER_OCTET_LENGTH: number | null;
    NUMERIC_PRECISION: number | null;
    NUMERIC_SCALE: number | null;
    DATETIME_PRECISION: number | null;
    CHARACTER_SET_NAME: string | null;
    COLLATION_NAME: string | null;
    ROUTINE_TYPE: 'FUNCTION' | 'PROCEDURE';
    DTD_IDENTIFIER: string | null;
    ROUTINE_BODY: string | null;
};
export type InformationSchemaColumns = {
    TYPE: "COLUMN";
    TABLE_CATALOG: string | null;
    TABLE_SCHEMA: string;
    TABLE_NAME: string;
    COLUMN_NAME: string;
    ORDINAL_POSITION: number;
    COLUMN_DEFAULT: string | null;
    IS_NULLABLE: 'YES' | 'NO';
    DATA_TYPE: SqlDataType;
    CHARACTER_MAXIMUM_LENGTH: number | null;
    CHARACTER_OCTET_LENGTH: number | null;
    NUMERIC_PRECISION: number | null;
    NUMERIC_SCALE: number | null;
    DATETIME_PRECISION: number | null;
    CHARACTER_SET_NAME: string | null;
    COLLATION_NAME: string | null;
    COLUMN_TYPE: string;
    COLUMN_KEY: 'PRI' | 'UNI' | 'MUL' | ''; 
    EXTRA: string;
    PRIVILEGES: string;
    COLUMN_COMMENT: string;
    GENERATION_EXPRESSION: string;
};
export type SqlTypeToTsTypeMap = {
    [type in SqlDataType]?: string | ((param: InformationSchemaParameters | InformationSchemaColumns) =>  string)
}
export const DefaultSqlTypeToTsTypeMap : SqlTypeToTsTypeMap = {
    'int': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `number | null`;
        }else{
            return `number${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'varchar': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `string | null`;
        }else{
            return `string${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'char': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `string | null`;
        }else{
            return `string${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'text': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `string | null`;
        }else{
            return `string${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'blob': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `Buffer | null`;
        }else{
            return `Buffer${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'float': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `number | null`;
        }else{
            return `number${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'double': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `number | null`;
        }else{
            return `number${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'decimal': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `number | null`;
        }else{
            return `number${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'boolean': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `1 | 0 | null`;
        }else{
            return `1 | 0${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'date': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `Date | null`;
        }else{
            return `Date${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'time': (param) => {
        if(param.TYPE === 'PARAMETER' ) {
            return `Date | null`;
        }else{
            return `Date${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'datetime': 'Date | null',
    'timestamp': 'Date | null',
    'year': 'number | null',
    'enum': (param) =>{
        if(param.TYPE === 'PARAMETER' ) {
            // extract enum values from PARAMETER_NAME
            const enumValues = (param.DTD_IDENTIFIER as string).replace(/enum\((.*)\)/ , '$1').split(',').map(value => value.replace(/'/g , '').trim());
            return enumValues?.map(value => `'${value}'`).join(' | ') + " | null" || 'any';
        }else{
            // extract enum values from DTD_IDENTIFIER
            const enumValues = param.COLUMN_TYPE.replace(/enum\((.*)\)/ , '$1').split(',').map(value => value.replace(/'/g , '').trim());
            return `${enumValues.map(value => `'${value}'`).join(' | ')}${param.IS_NULLABLE === 'YES' ? ' | null' : ''}`;
        }
    },
    'set': (param) =>{
        if(param.TYPE === 'PARAMETER' ) {
            // extract set values from PARAMETER_NAME
            const setValues = (param.DTD_IDENTIFIER as string).replace(/set\((.*)\)/ , '$1').split(',').map(value => value.replace(/'/g , '').trim());
            return `GenerateSetCombinations<${setValues.map(value => `'${value}'`).join(' | ')}> | null`;
        }else{
            // extract set values from DTD_IDENTIFIER
            const setValues = param.COLUMN_TYPE.replace(/set\((.*)\)/ , '$1').split(',').map(value => value.replace(/'/g , '').trim());
            console.log(setValues);
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
}

async function query(connection ,...params):Promise<any>{
    return new Promise((resolve , reject)=>{
        connection.query(...params,(err,values)=>{
            if(err) return reject(err)
            resolve(values as any)
        })
    })
}


async function getDatabaseName(connection: Connection) {
    const result = await query(connection ,'SELECT DATABASE() as `database`');

    return result[0].database as string;
}

async function getRoutines(connection: Connection , database: string) {
    const routines = await query(connection ,`
        SELECT
            *
        FROM
            information_schema.ROUTINES
        WHERE
            ROUTINE_SCHEMA = ? AND
            ROUTINE_TYPE = 'PROCEDURE'
    `, [database]);
    return routines as InformationSchemaRoutines[]
}

async function getRoutineParameters(connection: Connection , database: string ) { 
    const parameters = await query(connection,`
        SELECT
            *,
            'PARAMETER' as 'TYPE'
        FROM
            information_schema.PARAMETERS
        WHERE
            SPECIFIC_SCHEMA = ?
    `, [database]);
    return parameters as InformationSchemaParameters[];
}

async function getTablesWithColumns(connection: Connection , database: string ) {
        
    const columns = await query(connection,`
        SELECT
            *,
            'COLUMN' as 'TYPE'
        FROM
            information_schema.COLUMNS
        WHERE
            TABLE_SCHEMA = ?
    `, [database]);

    return Object.values((columns as InformationSchemaColumns[]).reduce((acc , column) => {
        if(!acc[column.TABLE_NAME]) acc[column.TABLE_NAME] = {
            TABLE_NAME: column.TABLE_NAME,
            COLUMNS: []
        }
        acc[column.TABLE_NAME].COLUMNS.push(column);
        return acc;
    }, {} as {[key:string]: {TABLE_NAME: string , COLUMNS: InformationSchemaColumns[]}}))  ;

}


async function getRoutinesWithParameters(connection: Connection , database: string){
    const routines = await getRoutines(connection , database);
    const parameters = await getRoutineParameters(connection , database);
    const routinesWithParameters = routines.map(routine => {
        return {
            ...routine,
            PARAMETERS: [...parameters.filter(parameter => parameter.SPECIFIC_NAME === routine.SPECIFIC_NAME)].sort((a,b) => a.ORDINAL_POSITION - b.ORDINAL_POSITION),
        }
    })

    return routinesWithParameters
}

function getRoutineParametersType( parameters :InformationSchemaParameters[] , typeMap : SqlTypeToTsTypeMap , spacer : string = ''){
    return `${parameters.map(parameter => {
        if(!typeMap[parameter.DATA_TYPE]) return `${parameter.PARAMETER_NAME} : any`;
        if(typeof typeMap[parameter.DATA_TYPE] === 'string') return `${parameter.PARAMETER_NAME} : ${typeMap[parameter.DATA_TYPE]}`;
        if(typeof typeMap[parameter.DATA_TYPE] === 'function') return `${parameter.PARAMETER_NAME} : ${(typeMap[parameter.DATA_TYPE] as Function)(parameter)}`;
    }).join(`,${spacer}`)}`
}
function getTableColumnsType(columns : InformationSchemaColumns[] , typeMap : SqlTypeToTsTypeMap, spacer : string = ''){
    return `${columns.map(column => {
        if(!typeMap[column.DATA_TYPE]) return `${column.COLUMN_NAME} : any`;
        if(typeof typeMap[column.DATA_TYPE] === 'string') return `${column.COLUMN_NAME} : ${typeMap[column.DATA_TYPE]}`;
        if(typeof typeMap[column.DATA_TYPE] === 'function') return `${column.COLUMN_NAME} : ${(typeMap[column.DATA_TYPE] as Function)(column)}`;
    }).join(`,${spacer}`)}`
}

export  async function generateMysqlDatabaseTypeString(connection:Connection , typeMap : SqlTypeToTsTypeMap =  DefaultSqlTypeToTsTypeMap  ) {

    const SqlTypeToTsTypeMap = {
        ...DefaultSqlTypeToTsTypeMap,
        ...typeMap
    }

    const database = await getDatabaseName(connection);
    const routinesWithParameters = await getRoutinesWithParameters(connection , database)
    const tablesWithColumns = await getTablesWithColumns(connection , database);

    const ts = 
    `export type GenerateSetCombinations<T extends string, U extends string = T> = T extends any ? \`\${T},\${GenerateSetCombinations<Exclude<U, T>>}\` | T : never;\n\n` +
    `export type ${database.replaceAll('-','_')}Schema = { \n\t${
        [
            `routines : {\n\t\t${
                routinesWithParameters.map(routine => {
                    return `${routine.ROUTINE_NAME} : {\n\t\t\t${
                        [
                            `parameters : [\n\t\t\t\t${getRoutineParametersType(routine.PARAMETERS , SqlTypeToTsTypeMap , '\n\t\t\t\t')}\n\t\t\t]`,
                            'returns : any[][]'
                        ].join(' ,\n\t\t\t')
                    }\n\t\t}`
                }).join(' ,\n\t\t')
            }\n\t}`,
            `tables : {\n\t\t${
                tablesWithColumns.map(table => {
                    return `${table.TABLE_NAME} : {\n\t\t\t${
                        [
                            `columns : {\n\t\t\t\t${getTableColumnsType(table.COLUMNS , SqlTypeToTsTypeMap , '\n\t\t\t\t')}\n\t\t\t}`
                        ].join(' ,\n\t\t\t')
                    }\n\t\t}`
                } ).join(' ,\n\t\t')
            }\n\t}`
        ].join(' ,\n\t')
    }\n}`

    return ts
}

export default generateMysqlDatabaseTypeString;