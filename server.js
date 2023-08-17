const express = require('express');
const app = express();
const mysql = require('mysql');

require('dotenv').config();

const db = mysql.createConnection({
    host: "sql6.freesqldatabase.com",
    user: "sql6640348",
    password: "YwTRkibeJI",
    database: "sql6640348",
});


app.use(express.json());

app.get('/createtable', (req, res) => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        stock_quantity INT NOT NULL
        )
        `;
    db.query(createTableQuery, (error, result) => {
        if (error) throw error;

        res.send("Products table created successfully");
    });
});

app.post('/insertproducts', (req, res) => {
    const products = req.body;
    const insertProductsQuery = `INSERT INTO products (name, image, price, stock_quantity) VALUES ?`;

    db.query(insertProductsQuery, [products], (error, result) => {
        if(error) throw error;

        res.send("products inserted successfully");
    });
});

app.get('/products', (req, res) => {
    const showProductsQuery = `SELECT * FROM products`;

    db.query(showProductsQuery, (error, result) => {
        if(error) throw error;

        res.json(result)
    });
});

app.get('/droptable', (req, res) => {
    const dropTableQuery = `DROP TABLE IF EXISTS products`;

    db.query(dropTableQuery, (error, result) => {
        if(error) throw error;

        res.send("table dropped successfulyy!!")
    });
});


app.get("/", (req, res) => {
    res.send("hey from the server!!");

})

app.listen(3001, () => {
    console.log("backend server started!!")
})