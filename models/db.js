// Misalnya, dalam file models/db.js
import { dbConfig } from '../config/config';

const mysql = require('mysql');
const util = require('util');

// Buat koneksi ke database
const connection = mysql.createConnection(dbConfig);

// Koneksi ke database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Mengubah method query menjadi promise-based
const query = util.promisify(connection.query).bind(connection);

export { query, connection }; // Juga bisa mengekspor method atau variabel lainnya jika diperlukan
