


module.exports= {
    database : {
        driver:"mysql2",
        destination: "generated.d.ts",
        connectionConfig: {
            host:"localhost",
            user: "root",
            password: "root",
            database: "test",
            port: 3307,
        }
    },
    runEvery: 5000, // in ms
}