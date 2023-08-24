const mysql = require('mysql');

// Replace these values with the credentials from your PlanetScale project
const host = "aws.connect.psdb.cloud";
const username = "d38fs9ahmql5979fxo2p";
const password = "pscale_pw_l7lhyfL2TGenrE8dQ64QQoiQ2cJvh9PwObzyH3YCOt3";
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