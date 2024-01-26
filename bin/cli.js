#!/usr/bin/env node
const { program } = require('commander');
const packageJson = require('../package.json');
const path = require('path');
const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)


program
    .version(packageJson.version)
    .description('An example CLI for generating TypeScript types from a database schema')
    .option('-c, --config <config>', 'Specify the path to the configuration file');


program.parse(process.argv);

const options = program.opts();


let conn = null;

if (options.config) {
    const config = require(path.resolve(options.config));

    const database = config.database
    const driver = database.driver
    const destination = database.destination
    const connectionConfig = database.connectionConfig
    const runEvery = config.runEvery

    const {createConnection} = require(driver)

    if(!createConnection){
        console.error(`Driver ${driver} not found`)
        process.exit(1)
    }

    conn = createConnection(connectionConfig)

    const generate = require("../dist/cjs/index.js").default

    const generateAndSave = async () => {
        const ts = await generate(conn)
        await writeFile(path.resolve(destination),ts)
    }

    if(runEvery){
        setInterval(async ()=>{
            await generateAndSave().catch((e)=>{
                conn.close()
                conn = null
                process.exit(1)
            })
            console.log(`Generated ${destination}`)
        },runEvery)
    }else {
        generateAndSave().then(()=>{
            conn.close()
            conn = null
            console.log(`Generated ${destination}`)
            process.exit(0)
        }).catch((e)=>{
            conn.close()
            conn = null
            process.exit(1)
        })
    }
    
} else {
    console.error('No configuration file specified. Please use the -c option to specify the config file.');
    process.exit(1);
}

process.on('unhandledRejection', (reason, promise) => {
    conn.close()
    console.error(reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    conn.close()
    console.error(error);
    process.exit(1);
});
process.on('beforeExit', (code) => {
    conn.close()
});
process.on('exit', (code) => {
    console.log(`Exiting with code ${code}`);
});

