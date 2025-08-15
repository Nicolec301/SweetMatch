// Rutas de autenticación y registro
const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');
const UserController = require('../controllers/UserController');
const JWTAuthMiddleware = require('../middleware/jwtAuth');

// === RUTAS DE REGISTRO (públicas) ===
router.post('/register', RegisterController.registerUser.bind(RegisterController));
router.post('/register/check-email', RegisterController.checkEmailAvailability.bind(RegisterController));
router.post('/register/validate-step', RegisterController.validateStep.bind(RegisterController));

// === RUTAS DE AUTENTICACIÓN (públicas) ===
router.post('/login', UserController.loginUser);
router.post('/google', UserController.googleLogin);

// === RUTAS PROTEGIDAS (requieren JWT) ===
router.post('/logout', JWTAuthMiddleware.authenticate, (req, res) => {
  // Limpiar token del cliente (el cliente debe eliminar el token del localStorage)
  res.json({ success: true, message: 'Logout exitoso' });
});

router.get('/me', JWTAuthMiddleware.authenticate, (req, res) => {
  // Retornar información del usuario autenticado
  res.json({ success: true, user: req.user });
});

module.exports = router;
