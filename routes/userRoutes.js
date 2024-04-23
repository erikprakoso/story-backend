const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Middleware untuk autentikasi atau otorisasi jika diperlukan

// Rute untuk menambah pengguna baru
router.post('/add', UserController.addUser);

// Rute untuk mengedit informasi pengguna berdasarkan UUID
router.put('/:uuid', UserController.editUser);

// Rute untuk menghapus pengguna berdasarkan UUID
router.delete('/delete/:uuid', UserController.deleteUser);

// Rute untuk melihat daftar pengguna
router.get('/', UserController.getAllUsers);

module.exports = router;
