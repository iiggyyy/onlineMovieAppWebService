// include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//intialize Express app
const app = express();

//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port, () => {
    console.log('Server running on port', port);
});

// Example Route: Get all movies
app.get('/allmovies', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.movies');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allmovies' });
    }
});

// Example Route: Create a new movie
app.post('/addmovie', async (req, res) => {
    const { title, year, poster_url } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO movies (title, year, poster_url) VALUES (?, ?, ?)',
            [title, year, poster_url]
        );
        res.status(201).json({ message: 'Movie ' +title+ ' added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add movie ' +title });
    }
});

// Example Route: Update a movie
app.put('/updatemovie', async (req, res) => {
    const { id, title, year, poster_url } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE movies SET title = ?, year = ?, poster_url = ? WHERE id = ?',
            [title, year, poster_url, id]
        );
        res.status(200).json({ message: 'Movie id ' +id+ ' updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update movie id ' +id });
    }
});

// Example Route: Delete a movie
app.delete('/deletemovie', async (req, res) => {
    const { id } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM movies WHERE id = ?',
            [id]
        );
        res.status(200).json({ message: 'Movie id ' +id+ ' deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete movie id ' +id });
    }
});
