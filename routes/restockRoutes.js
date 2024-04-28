const express = require('express');
const router = express.Router();
const RestockController = require('../controllers/restockController');
const authMiddleware = require('../middleware/auth');

// Middleware untuk autentikasi atau otorisasi jika diperlukan
router.use(authMiddleware);

// Rute untuk menambah data restock baru
router.post('/add', RestockController.addRestock);

// Rute untuk mengedit informasi restock berdasarkan UUID
router.put('/edit/:uuid', RestockController.editRestock);

// Rute untuk menghapus restock berdasarkan UUID
router.delete('/delete/:uuid', RestockController.deleteRestock);

// Rute untuk melihat semua data restock
router.get('/', RestockController.getAllRestocks);

// Rute untuk melihat detail restock berdasarkan UUID
router.get('/:uuid', RestockController.getRestockById);

// Rute untuk melihat detail sparepart pada restock berdasarkan UUID restock
router.get('/sparepart/:uuid', RestockController.getRestockSpareparts);

module.exports = router;
