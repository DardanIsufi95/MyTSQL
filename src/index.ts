export {generateMysqlDatabaseTypeString} from './generator'
export {SqlTypeToTsTypeMap} from './generator'
import createKnex , {Knex}  from 'knex'
import {ResultSetHeader , RowDataPacket} from 'mysql2/promise'




type MyTsqlSchemaType = {
    routines : {
        [key: string] : {
            parameters : any,
            returns : any
        }
    },
    tables : {
        [key: string] : {
            columns : {
                [key: string] : any
            },
        }
    }
}

type MyTsqlRoutineType<T extends MyTsqlSchemaType> = {
    [key in keyof T['routines']] : <R extends any[] = T['routines'][key]['returns']>(...args: T['routines'][key]['parameters']) => Promise<{headers: ResultSetHeader , dataSet: R}> 
}

type MyTsqlTableType<T extends MyTsqlSchemaType> =  {
    [key in keyof T['tables']] : Knex.QueryBuilder<T['tables'][key]['columns'],T['tables'][key]['columns'][] > 
}


class TableRepository<T extends MyTsqlSchemaType['tables'][string]> {
    constructor(private knex: Knex, private tablename: string) {}

    async getOneOrFail(opts: Partial<T['columns']>): Promise<T['columns']> {
        //const res = await this.knex.select<T['columns']>("*").from(this.tablename).where(opts).first();


        return {} as T['columns'];
    }
}


export function createMyTsql<T extends MyTsqlSchemaType>(this: any, config: Knex.Config){

    const knex = createKnex(config)

    const routinesProxy = new Proxy<MyTsqlRoutineType<T>>({} as MyTsqlRoutineType<T>, {
        get(target, prop , receiver) {
            return async function(...args: any[] ){
                //const sql = mysql.format(`call ${String(prop)}(${Array.from(args).map((arg, index) => `?`).join(',')})`, args)
                const [result] = await knex.raw(`call ${String(prop)}(${Array.from(args).map((arg, index) => `?`).join(',')})` , args)
                const headers  = result.pop() as ResultSetHeader
                const dataSet = result as RowDataPacket[][]

                return {
                    headers,
                    dataSet
                }
            }  
        }
    })

    const tablesProxy = new Proxy<MyTsqlTableType<T>>({} as MyTsqlTableType<T>, {
        get(target, prop, receiver) {

            
            return knex.table(prop as string)
                
            
        }
    })
   




    return {
        proc: routinesProxy,
        tb: tablesProxy,
        transaction: knex.transaction.bind(knex),
        raw: knex.raw.bind(knex),
        queryBuilder: knex.queryBuilder.bind(knex),
    }
}
export type GenerateSetCombinations<T extends string, U extends string = T> =
    T extends any ? `${T},${GenerateSetCombinations<Exclude<U, T>>}` | T : never;

export default createMyTsql


// console.log(a.tb.data_type_showcase.select().toQuery())

// a.proc.test_procedure(1,2,3,4,5,6,7,new Date(),new Date(),10,11,new Date(),new Date(),new Date(),new Date(),new Date(),2,new Date(),"new Date()",1,"new Date()",3,'enum_param','set_param,set_param3')

