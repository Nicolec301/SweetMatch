// Rutas de la API
const express = require('express');
const router = express.Router();

// Controladores
const UserController = require('../controllers/UserController');
const RegisterController = require('../controllers/RegisterController');
const MatchController = require('../controllers/MatchController');
const MessageController = require('../controllers/MessageController');
const ConversationController = require('../controllers/ConversationController');

// Rutas de registro
router.post('/register', RegisterController.registerUser.bind(RegisterController));
router.post('/register/check-email', RegisterController.checkEmailAvailability.bind(RegisterController));
router.post('/register/validate-step', RegisterController.validateStep.bind(RegisterController));

// Rutas de usuarios
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser); // Mantener para compatibilidad
// Rutas específicas deben ir antes que las genéricas con :id
router.put('/users/complete-profile', UserController.completeProfile); // Completar perfil después del registro
router.put('/users/:id/profile', UserController.updateUserProfile); // Nueva ruta para actualizar perfil
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Rutas de intereses
router.get('/interests', UserController.getInterests);

// Rutas de autenticación
router.post('/auth/login', UserController.loginUser);
router.post('/auth/google', UserController.googleLogin);

// Rutas de matches
router.get('/matches', MatchController.getMatches);
router.get('/matches/:id', MatchController.getMatchById);
router.post('/matches', MatchController.createMatch);
router.put('/matches/:id', MatchController.updateMatch);
router.delete('/matches/:id', MatchController.deleteMatch);
router.get('/matches/mutual-check', MatchController.checkMutualMatch);

// Rutas de conversaciones
router.get('/conversations/user/:userId', ConversationController.getUserConversations);
router.get('/conversations/:id', ConversationController.getConversationById);
router.get('/conversations/:id/details', ConversationController.getConversationDetails);
router.post('/conversations', ConversationController.createOrGetConversation);
router.delete('/conversations/:id', ConversationController.deleteConversation);

// Rutas de mensajes
router.get('/conversations/:conversationId/messages', MessageController.getMessages);
router.get('/messages/:id', MessageController.getMessageById);
router.post('/messages', MessageController.createMessage);
router.post('/messages/send', MessageController.sendMessage); // Alias para compatibilidad
router.delete('/messages/:id', MessageController.deleteMessage);
router.put('/conversations/:conversationId/read', MessageController.markAsRead);
router.get('/users/:userId/unread-count', MessageController.getUnreadCount);

// Ruta de salud
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SweetMatch API funcionando con sistema CRUD generalizado',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

module.exports = router;
