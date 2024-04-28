const express = require('express');
const router = express.Router();
const SalesController = require('../controllers/salesController');
const authMiddleware = require('../middleware/auth');

// Middleware untuk autentikasi atau otorisasi jika diperlukan
router.use(authMiddleware);

// Rute untuk menambah data sales baru
router.post('/add', SalesController.addSales);

// Rute untuk mengedit informasi sales berdasarkan UUID
router.put('/edit/:uuid', SalesController.editSales);

// Rute untuk menghapus sales berdasarkan UUID
router.delete('/delete/:uuid', SalesController.deleteSales);

// Rute untuk melihat semua data sales
router.get('/', SalesController.getAllSales);

// Rute untuk melihat detail sales berdasarkan UUID
router.get('/:uuid', SalesController.getSalesById);

module.exports = router;