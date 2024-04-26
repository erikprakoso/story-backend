const express = require('express');
const router = express.Router();
const sparepartMotorTypeController = require('../controllers/sparepartMotorTypeController');
const authMiddleware = require('../middleware/auth');

// Middleware untuk autentikasi atau otorisasi jika diperlukan
router.use(authMiddleware);

// Rute untuk menambah jenis suku cadang motor baru
router.post('/add', sparepartMotorTypeController.addSparepartMotorType);

// Rute untuk mengedit informasi jenis suku cadang motor berdasarkan UUID
router.put('/edit/:uuid', sparepartMotorTypeController.editSparepartMotorType);

// Rute untuk menghapus jenis suku cadang motor berdasarkan UUID
router.delete('/delete/:uuid', sparepartMotorTypeController.deleteSparepartMotorType);

// Rute untuk melihat semua jenis suku cadang motor
router.get('/', sparepartMotorTypeController.getAllSparepartMotorTypes);

module.exports = router;
