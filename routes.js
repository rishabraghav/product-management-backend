const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

app.use(express.json());
app.use(cors({
    origin: 'https://amberpass-products-management.netlify.app'
  }));


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const getUserQuery = `SELECT * FROM users WHERE email = ?`;

    db.query(getUserQuery, [email], async (error, result) => {
        if (error) throw error;

        if (result.length === 0) {
            return res.status(401).send({ error: "Invalid username or password" })
        }

        const user = result[0];

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) res.status(401).json({ error: "Password is not valid" });

        res.json({ message: "Login successful", user });

    })

});

app.post('/register', (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).send({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).send({ error: "Passwords do not match" });
    }

    const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        role VARCHAR(255)
    )
`;

    db.query(createUserTableQuery, (userTableError, userTableResult) => {
        if (userTableError) throw userTableError;
    });


    // Check if the email already exists in the database
    const checkEmailQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(checkEmailQuery, [email], (error, emailResult) => {
        if (error) throw error;

        if (emailResult.length > 0) {
            return res.status(400).send({ error: "Email already registered" });
        }

        // If email is unique, hash the password and register the user
        bcrypt.hash(password, 10, (hashError, hashedPassword) => {
            if (hashError) throw hashError;

            const registerUserQuery = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;

            db.query(registerUserQuery, [name, email, hashedPassword, role], (dbError, result) => {
                if (dbError) throw dbError;
                const user = {
                    name,
                    email,
                    role
                }
                res.status(201).json({ message: "User Registered successfully", user });
            });
        });
    });
});

app.put('/edituser/:id', (req, res) => {
    const { name, email, image } = req.body;
    const id = req.params.id;
    const updateUserQuery = `
    UPDATE users 
    SET name = ?, email = ?, image = ? 
    WHERE id = ?`;

    db.query(updateUserQuery, [name, email, image, id], (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Error updating user" });
        } else {
            const getUserQuery = `SELECT * FROM users WHERE id = ?`;
            db.query(getUserQuery, [id], (getUserError, getUserResult) => {
                if (getUserError) {
                    res.status(500).json({ message: "Error fetching updated user" });
                } else {
                    const updatedUser = getUserResult[0];
                    res.status(200).json({ message: "User updated successfully", user: updatedUser });
                }
            });
        }
    });

});


app.post('/insertproducts', (req, res) => {
    const { name, description, image, price, stock_quantity } = req.body;
    const createProductsTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            image VARCHAR(255),
            price DECIMAL(10, 2) NOT NULL,
            stock_quantity INT NOT NULL
        )
    `;
    db.query(createProductsTableQuery, (productsTableError, productsTableResult) => {
        if (productsTableError) throw productsTableError;
    });


    const insertProductsQuery = `INSERT INTO products (name, description, image, price, stock_quantity) VALUES (?, ?, ?, ?, ?)`;

    db.query(insertProductsQuery, [name, description, image, price, stock_quantity], (error, result) => {
        if (error) throw error;
        const response = {
            message: "products inserted successfully",
            result: { name, description, image, price, stock_quantity },
        }
        res.status(201).json(response);
    });
});

app.delete('/deleteproduct/:id', (req, res) => {
    const productId = req.params.id;
    const deleteProductQuery = `DELETE FROM products WHERE id = ?`;

    db.query(deleteProductQuery, [productId], (error, result) => {
        if (error) {
            res.status(500).json({ message: "Error deleting product" });
        } else {
            res.status(200).json({ message: "Product deleted successfully" });
        }
    })
});
app.put('/editproduct/:id', (req, res) => {
    const productId = req.params.id;
    const { name, description, image, price, stock_quantity } = req.body;

    const updateProductQuery = `
        UPDATE products 
        SET name = ?, description = ?, image = ?, price = ?, stock_quantity = ? 
        WHERE id = ?
    `;

    db.query(updateProductQuery, [name, description, image, price, stock_quantity, productId], (error, result) => {
        if (error) {
            res.status(500).json({ message: "Error updating product" });
        } else {
            res.status(200).json({ message: "Product updated successfully" });
        }
    });
});

//show the data
app.get('/products', (req, res) => {
    const showProductsQuery = `SELECT * FROM products`;

    db.query(showProductsQuery, (error, result) => {
        if (error) throw error;

        res.json(result)
    });
});

app.get('/users', (req, res) => {
    const showUsersQuery = `SELECT * FROM users`;

    db.query(showUsersQuery, (error, result) => {
        if (error) throw error;

        res.json(result)
    });
});


//drop the tables
app.get('/droptableproducts', (req, res) => {
    const dropTableQuery = `DROP TABLE IF EXISTS products`;

    db.query(dropTableQuery, (error, result) => {
        if (error) throw error;

        res.send("table dropped successfulyy!!")
    });
});
app.get('/droptableusers', (req, res) => {
    const dropTableQuery = `DROP TABLE IF EXISTS users`;

    db.query(dropTableQuery, (error, result) => {
        if (error) throw error;

        res.send("table dropped successfulyy!!")
    });
});






app.get("/", (req, res) => {
    res.send("hey from the server!!");

});


module.exports = app;