// Rutas de búsqueda
const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');

// Rutas de búsqueda
router.post('/users', SearchController.searchUsers);
router.get('/interests', SearchController.getAvailableInterests);
router.get('/profile/:id', SearchController.getUserProfile);
router.post('/message', SearchController.sendDirectMessage);

// Ruta para testing
router.post('/test-messages', SearchController.createTestMessages);

module.exports = router;
