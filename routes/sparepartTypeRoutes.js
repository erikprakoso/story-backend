const express = require('express');
const router = express.Router();
const SparepartTypeController = require('../controllers/sparepartTypeController');
const authMiddleware = require('../middleware/auth');

// Middleware untuk autentikasi atau otorisasi jika diperlukan
authMiddleware,

// Rute untuk menambah tipe suku cadang baru
router.post('/add', authMiddleware, SparepartTypeController.addSparepartType);

// Rute untuk mengedit tipe suku cadang berdasarkan UUID
router.put('/edit/:uuid', authMiddleware, SparepartTypeController.editSparepartType);

// Rute untuk menghapus tipe suku cadang berdasarkan UUID
router.delete('/delete/:uuid', authMiddleware, SparepartTypeController.deleteSparepartType);

// Rute untuk melihat semua tipe suku cadang
router.get('/', authMiddleware, SparepartTypeController.getAllSparepartTypes);

module.exports = router;
