const express = require('express');
const router = express.Router();
const SparepartController = require('../controllers/sparepartController');
const authMiddleware = require('../middleware/auth');

// Middleware untuk autentikasi atau otorisasi jika diperlukan
authMiddleware,

// Rute untuk melihat semua sparepart
router.get('/', authMiddleware, SparepartController.getAllSpareparts);

// Rute untuk melihat detail sparepart berdasarkan UUID
router.get('/:uuid', authMiddleware, SparepartController.getSparepartById);

// Rute untuk menambah sparepart baru
router.post('/add', authMiddleware, SparepartController.addSparepart);

// Rute untuk menambah sparepart secara massal dari file
router.post('/add/bulk', authMiddleware, SparepartController.addSparepartsBulk);

// Rute untuk mengedit informasi sparepart berdasarkan UUID
router.put('/edit/:uuid', authMiddleware, SparepartController.editSparepart);

// Rute untuk menghapus sparepart berdasarkan UUID
router.delete('/delete/:uuid', authMiddleware, SparepartController.deleteSparepart);

module.exports = router;
