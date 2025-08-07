// Rutas de la API
const express = require('express');
const router = express.Router();

// Controladores
const UserController = require('../controllers/UserController');
const MatchController = require('../controllers/MatchController');
const MessageController = require('../controllers/MessageController');

// Rutas de usuarios
router.get('/users', UserController.getUsers);
router.post('/users', UserController.createUser);
router.get('/interests', UserController.getInterests);
router.post('/auth/login', UserController.loginUser);
router.post('/auth/google', UserController.googleLogin);

// Rutas de matches
router.get('/matches', MatchController.getMatches);
router.post('/matches', MatchController.createMatch);

// Rutas de mensajes
router.get('/messages', MessageController.getMessages);
router.post('/messages', MessageController.sendMessage);

// Ruta de salud
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SweetMatch API funcionando',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
