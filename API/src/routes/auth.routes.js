const express = require('express');
const AuthController = require('../controllers/auth.controller');   
const router = express.Router();

const { validateLogin } = require('../middlewares/login.middleware');

const authController = new AuthController();

router
    .post('/login', validateLogin, authController.login)

module.exports = router;