const express = require('express');
const router = express.Router();
const motorTypeController = require('../controllers/motorTypeController');
const authMiddleware = require('../middleware/auth');

// Middleware untuk autentikasi atau otorisasi jika diperlukan
router.use(authMiddleware);

// Rute untuk menambah jenis suku cadang motor baru
router.post('/add', motorTypeController.addMotorType);

// Rute untuk mengedit informasi jenis suku cadang motor berdasarkan UUID
router.put('/edit/:uuid', motorTypeController.editMotorType);

// Rute untuk menghapus jenis suku cadang motor berdasarkan UUID
router.delete('/delete/:uuid', motorTypeController.deleteMotorType);

// Rute untuk melihat semua jenis suku cadang motor
router.get('/', motorTypeController.getAllMotorTypes);

module.exports = router;
