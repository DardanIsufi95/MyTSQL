


module.exports= {
    database : {
        driver:"mysql2",
        destination: "generated.d.ts",
        connectionConfig: {
            host:"localhost",
            user: "root",
            password: "",
            database: "test",
            port: 3306,
        }
    },
    runEvery: 5000, // in ms
}