// Rutas específicas de matches
const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');

// Rutas de matches
router.get('/', MatchController.getMatches);
router.post('/', MatchController.createMatch);
router.put('/:id', MatchController.updateMatch);
router.get('/:id', MatchController.getMatchById);
router.delete('/:id', MatchController.deleteMatch);

// Rutas específicas de acciones
router.post('/like', MatchController.likeUser);
router.post('/pass', MatchController.passUser);
router.post('/check-mutual', MatchController.checkMutualMatch);

module.exports = router;
