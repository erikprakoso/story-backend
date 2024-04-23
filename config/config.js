// config/config.js

const jwtSecret = 'your_jwt_secret_key'; // Ganti dengan secret key untuk JWT

const dbConfig = {
    host: 'localhost',
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'bengkel', // Ganti dengan nama database yang digunakan
};

export { jwtSecret, dbConfig };
