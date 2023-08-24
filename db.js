const mysql = require('mysql');

// Replace these values with the credentials from your PlanetScale project
const host = "aws.connect.psdb.cloud";
const username = "rp7uew1pvjcl3cu4q94k";
const password = "pscale_pw_Jh5zK4V2fnMkL300XhKVWgp4VSOzusVXh1kdSyXGpwT";
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