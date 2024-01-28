export { generateMysqlDatabaseTypeString } from './generator';
import createKnex from 'knex';
class TableRepository {
    knex;
    tablename;
    constructor(knex, tablename) {
        this.knex = knex;
        this.tablename = tablename;
    }
    async getOneOrFail(opts) {
        //const res = await this.knex.select<T['columns']>("*").from(this.tablename).where(opts).first();
        return {};
    }
}
export function createMyTSQL(config) {
    const knex = createKnex(config);
    const routinesProxy = new Proxy({}, {
        get(target, prop, receiver) {
            return async function (...args) {
                //const sql = mysql.format(`call ${String(prop)}(${Array.from(args).map((arg, index) => `?`).join(',')})`, args)
                const [result] = await knex.raw(`call ${String(prop)}(${Array.from(args).map((arg, index) => `?`).join(',')})`, args);
                const headers = result.pop();
                const dataSet = result;
                return {
                    headers,
                    dataSet
                };
            };
        }
    });
    const tablesProxy = new Proxy({}, {
        get(target, prop, receiver) {
            return knex.table(prop);
        }
    });
    return {
        proc: routinesProxy,
        tb: tablesProxy,
        transaction: knex.transaction.bind(knex),
        raw: knex.raw.bind(knex),
        queryBuilder: knex.queryBuilder.bind(knex),
    };
}
export default createMyTSQL;
// console.log(a.tb.data_type_showcase.select().toQuery())
// a.proc.test_procedure(1,2,3,4,5,6,7,new Date(),new Date(),10,11,new Date(),new Date(),new Date(),new Date(),new Date(),2,new Date(),"new Date()",1,"new Date()",3,'enum_param','set_param,set_param3')
//# sourceMappingURL=index.js.map