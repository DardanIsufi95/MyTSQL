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
    SPECIFIC_CATALOG: string | null;
    SPECIFIC_SCHEMA: string | null;
    SPECIFIC_NAME: string;
    ORDINAL_POSITION: number;
    PARAMETER_MODE: 'IN' | 'OUT' | 'INOUT' | null;
    PARAMETER_NAME: string | null;
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
    [type in SqlDataType]?: string | ((param: InformationSchemaParameters) =>  string)
}
export const DefaultSqlTypeToTsTypeMap : SqlTypeToTsTypeMap = {
    'int': 'number | null',
    'varchar': 'string | null',
    'char': 'string | null',
    'text': 'string | null',
    'blob': 'Buffer | null',
    'float': 'number | null',
    'double': 'number | null',
    'decimal': 'number | null',
    'boolean': 'number | null',
    'date': 'Date | null',
    'time': 'Date | null',
    'datetime': 'Date | null',
    'timestamp': 'Date | null',
    'year': 'number | null',
    'enum': (param) =>{
        // extract enum values from DTD_IDENTIFIER
        const enumValues = param.DTD_IDENTIFIER!.replace(/enum\((.*)\)/ , '$1').split(',').map(value => value.replace(/'/g , '').trim());
        return enumValues.map(value => `'${value}'`).join(' | ') + " | null";
    },
    'set': (param) =>{
        //extract set values from DTD_IDENTIFIER
        const setValues = param.DTD_IDENTIFIER!.replace(/set\((.*)\)/ , '$1').split(',').map(value => value.replace(/'/g , '').trim());
        return `Set<${setValues.map(val=>`'${val}'`).join('|')}> | null`;
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
            *
        FROM
            information_schema.PARAMETERS
        WHERE
            SPECIFIC_SCHEMA = ?
    `, [database]);
    return parameters as InformationSchemaParameters[];
}

async function getTableColumns(connection: Connection , database: string ) {
        
    const columns = await query(connection,`
        SELECT
            *
        FROM
            information_schema.COLUMNS
        WHERE
            TABLE_SCHEMA = ?
    `, [database]);

    return columns as InformationSchemaColumns[];

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


export default async function generateMysqlDatabaseTypeString(connection:Connection , typeMap : SqlTypeToTsTypeMap =  DefaultSqlTypeToTsTypeMap  ) {

    const SqlTypeToTsTypeMap = {
        ...DefaultSqlTypeToTsTypeMap,
        ...typeMap
    }

    const database = await getDatabaseName(connection);
    const routinesWithParameters = await getRoutinesWithParameters(connection , database)

    const ts = `export type ${database.replaceAll('-','_')}Schema = { \n\troutines : {\n\t\t${routinesWithParameters.map(routine => {
        return `${routine.ROUTINE_NAME}: {\n\t\t\tparameters: [${routine.PARAMETERS.map(parameter => {
            if(!SqlTypeToTsTypeMap[parameter.DATA_TYPE]) return `${parameter.PARAMETER_NAME}: any`;
            if(typeof SqlTypeToTsTypeMap[parameter.DATA_TYPE] === 'string') return `${parameter.PARAMETER_NAME}: ${SqlTypeToTsTypeMap[parameter.DATA_TYPE]}`;
            if(typeof SqlTypeToTsTypeMap[parameter.DATA_TYPE] === 'function') return `${parameter.PARAMETER_NAME}: ${(SqlTypeToTsTypeMap[parameter.DATA_TYPE] as Function)(parameter)}`;
        }).join(' , ')}]\n\t\t}`
    }).join(' ,\n\t\t')}\n\t}\n}`


    return ts
}