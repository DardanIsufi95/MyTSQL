"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
let handler = {
    get(target, p, receiver) {
        console.log(`get called with ${String(p)}`);
        return function () {
            return `get called with ${String(p)}`;
        };
    }
};
function parseMySQLError(error) {
    let detail = '';
    switch (error.code) {
        case 'ER_DUP_ENTRY':
            detail = error.sqlMessage.match(/Duplicate entry '(.*)' for key '(.*)'/);
            return {
                field: detail[2],
            };
        case 'ER_NO_REFERENCED_ROW':
            detail = error.sqlMessage.match(/Cannot add or update a child row: a foreign key constraint fails \(`.*`.`.*`, CONSTRAINT `.*` FOREIGN KEY \(`(.*)`\) REFERENCES `.*` \(`.*`\)\)/);
            return detail ? `No referenced row for field: ${detail[1]}` : error.sqlMessage;
        case 'ER_NO_REFERENCED_ROW_2':
            detail = error.sqlMessage.match(/Cannot add or update a child row: a foreign key constraint fails \(`.*`.`.*`, CONSTRAINT `.*` FOREIGN KEY \(`(.*)`\) REFERENCES `.*` \(`.*`\)\)/);
            return detail ? `No referenced row for field: ${detail[1]}` : error.sqlMessage;
        case 'ER_DUP_FIELDNAME':
            detail = error.sqlMessage.match(/Duplicate column name '(.*)'/);
            return detail ? `Duplicate column name: ${detail[1]}` : error.sqlMessage;
        case 'ER_PARSE_ERROR':
            detail = error.sqlMessage.match(/You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '(.*)'/);
            return detail ? `Parse error: ${detail[1]}` : error.sqlMessage;
        case 'ER_BAD_FIELD_ERROR':
            detail = error.sqlMessage.match(/Unknown column '(.*)' in 'field list'/);
            return detail ? `Bad field: ${detail[1]}` : error.sqlMessage;
        case 'ER_NON_UNIQ_ERROR':
            detail = error.sqlMessage.match(/Column '(.*)' in (.*) is ambiguous/);
            return detail ? `Non unique column: ${detail[1]}` : error.sqlMessage;
        case 'ER_BAD_NULL_ERROR':
            detail = error.sqlMessage.match(/Column '(.*)' cannot be null/);
            return detail ? `Bad null: ${detail[1]}` : error.sqlMessage;
        case 'ER_BAD_TABLE_ERROR':
            detail = error.sqlMessage.match(/Unknown table '(.*)' in (.*)/);
            return detail ? `Bad table: ${detail[1]}` : error.sqlMessage;
        case 'ER_NO_SUCH_TABLE':
            detail = error.sqlMessage.match(/Table '(.*)' doesn't exist/);
            return detail ? `No such table: ${detail[1]}` : error.sqlMessage;
        default:
            throw error;
    }
}
const mysql2_1 = require("mysql2");
const pool = (0, mysql2_1.createConnection)({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
    port: 3306,
});
const index_1 = require("./index");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
async function main() {
    const schema = await (0, index_1.generateMysqlDatabaseTypeString)(pool);
    await (0, promises_1.writeFile)(path_1.default.resolve('./test.d.ts'), schema);
    // function test(this: any, arg){
    //     console.log(this.number , arg);
    // }
    // let bindedFn = test.bind({number: 99}, "argument");
    // console.log(bindedFn());
    // return;
    // //const test = /Duplicate entry '(.*)' for key '(.*)'/;
    // //console.log( test instanceof RegExp);return;
    // const res = await pool.execute('INSERT INTO `test` (`test`) VALUES (?)', ['testdasdasdasdadasdasdassd']).then(([rows, fields]) => {
    //     return [rows, fields] as const;
    // }).catch(err => {
    //     const error = parseMySQLError(err);
    //     console.log(err ,error);
    //     return [null, null] as const;
    // });
    // console.log(res);
}
main().catch(err => {
    console.log(err);
    throw err;
});
//# sourceMappingURL=test.js.map