////////////////////////////////////////////////////////
//          generate schema programatically
////////////////////////////////////////////////////////
import { createConnection } from "mysql2"
import {generateMysqlDatabaseTypeString} from '../src/index'
import { writeFile } from "fs/promises"
import path from "path"

const conn =  createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
    port: 3306,
});

async function generateSchemaAndWriteToFile(){
    const schema = await generateMysqlDatabaseTypeString(conn);
    await writeFile(path.resolve('./test.d.ts'),schema)

}

generateSchemaAndWriteToFile().catch(err => {})


////////////////////////////////////////////////////////
//        generate schema from using cli     
////////////////////////////////////////////////////////
// mytsql generate -c ./config.js 
// see example config.js


////////////////////////////////////////////////////////
//        use generated schema   
////////////////////////////////////////////////////////
import {createMyTsql} from '../src/index'
import type { testSchema } from "./test";



const db = createMyTsql<testSchema>({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test',
        port: 3306
        
    },
    pool: { min: 0, max: 7 }
})

// db.raw('select * from test').then(res => {
//     console.log(res);
// })

// db.proc.testis(1,2).then(res => {
//     console.log(res);
// })
async function main(){
    db.proc.testis<[{hello:string}[] , {test2:number}[]]>(1,2).then(res => {
        console.log(res[0][0]);
    })
}
main()




