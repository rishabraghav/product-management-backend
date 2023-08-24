const mysql = require('mysql');
require('dotenv').config();

// Replace these values with the credentials from your PlanetScale project
const host = process.env.HOST;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

// console.log(host, username, password, database);

const db = mysql.createConnection({
    host: host,
    user: username,
    password: password,
    database: database,
    // Add this option to the connection configuration to enable SSL
    ssl: {
        rejectUnauthorized: true
    }
});

module.exports = db;