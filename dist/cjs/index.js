"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMyTsql = exports.generateMysqlDatabaseTypeString = void 0;
var generator_1 = require("./generator");
Object.defineProperty(exports, "generateMysqlDatabaseTypeString", { enumerable: true, get: function () { return generator_1.generateMysqlDatabaseTypeString; } });
const knex_1 = __importDefault(require("knex"));
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
function createMyTsql(config) {
    const knex = (0, knex_1.default)(config);
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
exports.createMyTsql = createMyTsql;
exports.default = createMyTsql;
// console.log(a.tb.data_type_showcase.select().toQuery())
// a.proc.test_procedure(1,2,3,4,5,6,7,new Date(),new Date(),10,11,new Date(),new Date(),new Date(),new Date(),new Date(),2,new Date(),"new Date()",1,"new Date()",3,'enum_param','set_param,set_param3')
//# sourceMappingURL=index.js.map