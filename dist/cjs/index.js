"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMysqlDatabaseTypeString = void 0;
var generator_1 = require("./generator");
Object.defineProperty(exports, "generateMysqlDatabaseTypeString", { enumerable: true, get: function () { return generator_1.generateMysqlDatabaseTypeString; } });
const knex_1 = __importDefault(require("knex"));
function createMyTsql(config) {
    const knex = (0, knex_1.default)(config);
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