const { Pool } = require('pg');
const { dbHost, dbPort, dbUser, dbPassword, dbName } = require('./configs');

const pool = new Pool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName
})

module.exports = pool;