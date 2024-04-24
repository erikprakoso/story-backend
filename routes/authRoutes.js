const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Middleware untuk autentikasi atau otorisasi jika diperlukan
authMiddleware,

router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.patch('/reset_password/:uuid', authMiddleware, authController.resetPassword);

module.exports = router;
