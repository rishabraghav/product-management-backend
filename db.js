const mysql = require('mysql');

const db = mysql.createConnection({
    host: "sql6.freesqldatabase.com",
    user: "sql6640348",
    password: "YwTRkibeJI",
    database: "sql6640348",
});

module.exports = db;
