


module.exports= {
    database : {
        driver:"mysql2",
        destination: "generated.d.ts",
        connectionConfig: {
            host:"localhost",
            user: "root",
            password: "root",
            database: "test"
        }
    },
    runEvery: 5000, // in ms
}