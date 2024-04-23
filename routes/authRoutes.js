const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.patch('/reset_password/:uuid', authController.resetPassword);

module.exports = router;
