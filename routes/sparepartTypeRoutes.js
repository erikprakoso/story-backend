const express = require('express');
const router = express.Router();
const SparepartTypeController = require('../controllers/sparepartTypeController');

// Rute untuk menambah tipe suku cadang baru
router.post('/add', SparepartTypeController.addSparepartType);

// Rute untuk mengedit tipe suku cadang berdasarkan UUID
router.put('/edit/:uuid', SparepartTypeController.editSparepartType);

// Rute untuk menghapus tipe suku cadang berdasarkan UUID
router.delete('/delete/:uuid', SparepartTypeController.deleteSparepartType);

// Rute untuk melihat semua tipe suku cadang
router.get('/', SparepartTypeController.getAllSparepartTypes);

module.exports = router;
