export { generateMysqlDatabaseTypeString } from './generator';
import createKnex from 'knex';
function createMyTsql(config) {
    const knex = createKnex(config);
    const routinesProxy = new Proxy({}, {
        get(target, prop, receiver) {
            return async function (...args) {
                //const sql = mysql.format(`call ${String(prop)}(${Array.from(args).map((arg, index) => `?`).join(',')})`, args)
                return knex.raw(`call ${String(prop)}(${Array.from(args).map((arg, index) => `?`).join(',')})`, args);
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
    };
}
const a = createMyTsql({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'test',
        port: 3307,
        typeCast: function (field, next) {
            console.log(field);
            return next();
        }
    },
    pool: { min: 0, max: 7 }
});
// a.proc.testis(1,2).then(console.log)
a.tb.data_type_showcase.select().then(res => {
    console.log(res);
});
a.tb.data_type_showcase.select().then(res => {
    console.log(res[0].sample_multilinestring);
});
//# sourceMappingURL=index.js.map