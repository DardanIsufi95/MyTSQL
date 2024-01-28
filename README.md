# MyTSQL Documentation

## Overview
This TypeScript module provides a robust interface for interacting with MySQL databases using Knex. It includes functionality for generating schemas, executing stored procedures, and querying tables.

---

## Installation
To use this module, ensure you have the necessary dependencies installed:

```bash
npm install knex mysql2
```

---

## Usage

### Creating a MyTsql Instance
To start using MyTsql, you need to create an instance with your database configuration.

```typescript
import createMyTsql from 'path-to-module';

const db = createMyTsql<YourSchemaType>({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'your_username',
        password: 'your_password',
        database: 'your_database',
        port: 3306
    },
    pool: { min: 0, max: 7 }
});
```

### Executing Stored Procedures
You can execute stored procedures using the `proc` method.

```typescript
db.proc.yourProcedureName<ReturnType[]>(param1, param2, ...).then(result => {
    // Handle result
});
```

### Querying Tables
For table queries, use the `tb` method.

```typescript
db.tb.yourTableName.select().then(rows => {
    // Handle rows
});
```

---

## Generating Schema Programmatically
To generate a schema from your MySQL database, use the `generateSchemaAndWriteToFile` function.

```typescript
import { generateSchemaAndWriteToFile } from 'path-to-module';

generateSchemaAndWriteToFile().catch(err => {
    // Handle error
});
```

---

## CLI Schema Generation
You can also generate a schema using the CLI.

```bash
mytsql generate -c ./config.js
```

---

## API Reference

### `createMyTsql<T extends MyTsqlSchemaType>(config: Knex.Config): MyTsqlInstance`
Creates an instance of MyTsql with the given Knex configuration.

#### Parameters
- `config`: Knex configuration object.

#### Returns
- `MyTsqlInstance`: An instance for interacting with the database.

---

### `MyTsqlRoutineType<T>`
Type definition for stored procedures.

#### Usage
```typescript
type YourProcedureType = MyTsqlRoutineType<YourSchemaType>;
```

---

### `MyTsqlTableType<T>`
Type definition for table queries.

#### Usage
```typescript
type YourTableType = MyTsqlTableType<YourSchemaType>;
```

---

## Examples
Here are some examples of how to use this module:

### Executing a Procedure
```typescript
db.proc.someProcedure<[ReturnType]>(param1).then(result => {
    // Process result
});
```

### Querying a Table
```typescript
db.tb.someTable.select().then(rows => {
    // Process rows
});
```

