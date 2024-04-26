const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); // Jika Anda menggunakan dotenv untuk mengakses variabel lingkungan
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sparepartRoutes = require('./routes/sparepartRoutes');
const restockRoutes = require('./routes/restockRoutes');
const sparepartTypeRoutes = require('./routes/sparepartTypeRoutes');
const motorTypeRoutes = require('./routes/motorTypeRoutes');

// Inisialisasi Express
const app = express();

// Menggunakan middleware
app.use(bodyParser.json());
app.use(cors());

// Mengakses variabel lingkungan jika menggunakan dotenv
dotenv.config();

// Definisikan konfigurasi Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Versi OpenAPI (bisa disesuaikan)
    info: {
      title: 'Transfer Request Management API',
      description: 'API for managing transfer requests',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'], // Daftar file rute yang berisi dokumentasi Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Gunakan middleware untuk menampilkan UI Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Definisikan rute-rute API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/spareparts', sparepartRoutes);
app.use('/api/v1/restocks', restockRoutes);
app.use('/api/v1/sparepart-types', sparepartTypeRoutes);
app.use('/api/v1/motor-types', motorTypeRoutes);

// Menjalankan server Express
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});