// Rutas de búsqueda de usuarios y perfiles
const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');
const JWTAuthMiddleware = require('../middleware/jwtAuth');

// === RUTAS DE BÚSQUEDA (públicas) ===
router.get('/users', SearchController.searchUsers);
router.get('/interests', SearchController.getAvailableInterests);
router.get('/profile/:userId', SearchController.getUserProfile);

// === RUTAS DE MENSAJERÍA DESDE BÚSQUEDA (requieren autenticación) ===
router.post('/send-message', JWTAuthMiddleware.authenticate, SearchController.sendDirectMessage);

module.exports = router;
