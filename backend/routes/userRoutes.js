const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../validations/userValidation');
const { validateLogin } = require('../validations/loginValidation');
const authenticateToken = require("../middleware/auth");

router.post('/create-account', validateUser, userController.createAccount);
router.post('/login', validateLogin, userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/logout', authenticateToken, userController.logout);
router.get('/get-user', authenticateToken, userController.getUser);

module.exports = router;