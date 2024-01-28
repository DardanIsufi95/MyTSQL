export { generateMysqlDatabaseTypeString } from './generator';
export { SqlTypeToTsTypeMap } from './generator';
import createKnex, { Knex } from 'knex';
import { ResultSetHeader } from 'mysql2/promise';
type MyTSQLSchemaType = {
    routines: {
        [key: string]: {
            parameters: any;
            returns: any;
        };
    };
    tables: {
        [key: string]: {
            columns: {
                [key: string]: any;
            };
        };
    };
};
type MyTSQLRoutineType<T extends MyTSQLSchemaType> = {
    [key in keyof T['routines']]: <R extends any[] = T['routines'][key]['returns']>(...args: T['routines'][key]['parameters']) => Promise<{
        headers: ResultSetHeader;
        dataSet: R;
    }>;
};
type MyTSQLTableType<T extends MyTSQLSchemaType> = {
    [key in keyof T['tables']]: Knex.QueryBuilder<T['tables'][key]['columns'], T['tables'][key]['columns'][]>;
};
export declare function createMyTSQL<T extends MyTSQLSchemaType>(this: any, config: Knex.Config): {
    proc: MyTSQLRoutineType<T>;
    tb: MyTSQLTableType<T>;
    transaction: {
        (config?: createKnex.Knex.TransactionConfig | undefined): Promise<createKnex.Knex.Transaction<any, any[]>>;
        (transactionScope?: null | undefined, config?: createKnex.Knex.TransactionConfig | undefined): Promise<createKnex.Knex.Transaction<any, any[]>>;
        <T_1>(transactionScope: (trx: createKnex.Knex.Transaction<any, any[]>) => void | Promise<T_1>, config?: createKnex.Knex.TransactionConfig | undefined): Promise<T_1>;
    };
    raw: createKnex.Knex.RawBuilder<any, any>;
    queryBuilder: <TRecord2 extends {} = any, TResult2 = unknown[]>() => createKnex.Knex.QueryBuilder<TRecord2, TResult2>;
};
export type GenerateSetCombinations<T extends string, U extends string = T> = T extends any ? `${T},${GenerateSetCombinations<Exclude<U, T>>}` | T : never;
export default createMyTSQL;
//# sourceMappingURL=index.d.ts.map