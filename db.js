const mysql = require('mysql');

// Replace these values with the credentials from your PlanetScale project
const host = "aws.connect.psdb.cloud";
const username = "o49mtbgdmz2fxg29bh61";
const password = "pscale_pw_w9otzJIFx8IbmkpWZlG6xMLtS4my3XvW1ybEM2BxKTn";
const database = "products-management";

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