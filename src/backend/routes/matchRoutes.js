// Rutas de sistema de matches y acciones sociales
const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');
const JWTAuthMiddleware = require('../middleware/jwtAuth');

// === RUTAS DE GESTIÓN DE MATCHES ===
router.get('/', JWTAuthMiddleware.authenticate, MatchController.getMatches);
router.get('/:id', JWTAuthMiddleware.authenticate, MatchController.getMatchById);
router.post('/', JWTAuthMiddleware.authenticate, MatchController.createMatch);
router.put('/:id', JWTAuthMiddleware.authenticate, MatchController.updateMatch);
router.delete('/:id', JWTAuthMiddleware.authenticate, MatchController.deleteMatch);

// === RUTAS DE ACCIONES SOCIALES ===
router.post('/like', JWTAuthMiddleware.authenticate, MatchController.likeUser);
router.post('/pass', JWTAuthMiddleware.authenticate, MatchController.passUser);

// === RUTAS DE VERIFICACIÓN ===
router.get('/mutual-check', JWTAuthMiddleware.authenticate, MatchController.checkMutualMatch);

module.exports = router;
