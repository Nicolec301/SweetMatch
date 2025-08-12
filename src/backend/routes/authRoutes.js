// Rutas de autenticación
const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');
const AuthController = require('../controllers/AuthController');
const JWTAuthMiddleware = require('../middleware/jwtAuth');

// Rutas de registro (públicas)
router.post('/register', RegisterController.registerUser.bind(RegisterController));
router.post('/register/check-email', RegisterController.checkEmailAvailability.bind(RegisterController));
router.post('/register/validate-step', RegisterController.validateStep.bind(RegisterController));

// Rutas de autenticación JWT (públicas)
router.post('/login', AuthController.login);
router.post('/google', AuthController.googleAuth);
router.post('/refresh', AuthController.refreshToken);

// Rutas protegidas
router.post('/logout', JWTAuthMiddleware.authenticate, AuthController.logout);
router.get('/me', JWTAuthMiddleware.authenticate, AuthController.me);

module.exports = router;
