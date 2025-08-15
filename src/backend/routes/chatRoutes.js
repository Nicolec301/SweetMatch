// Rutas de mensajes y conversaciones
const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');
const ConversationController = require('../controllers/ConversationController');
const JWTAuthMiddleware = require('../middleware/jwtAuth');

// === RUTAS DE CONVERSACIONES ===
router.get('/conversations/user/:userId', JWTAuthMiddleware.authenticate, ConversationController.getUserConversations);
router.get('/conversations/:id', JWTAuthMiddleware.authenticate, ConversationController.getConversationById);
router.get('/conversations/:id/details', JWTAuthMiddleware.authenticate, ConversationController.getConversationDetails);
router.post('/conversations', JWTAuthMiddleware.authenticate, ConversationController.createOrGetConversation);
router.delete('/conversations/:id', JWTAuthMiddleware.authenticate, ConversationController.deleteConversation);

// === RUTAS DE MENSAJES ===
router.get('/conversations/:conversationId/messages', JWTAuthMiddleware.authenticate, MessageController.getMessages);
router.get('/messages/:id', JWTAuthMiddleware.authenticate, MessageController.getMessageById);
router.post('/messages', JWTAuthMiddleware.authenticate, MessageController.createMessage);
router.delete('/messages/:id', JWTAuthMiddleware.authenticate, MessageController.deleteMessage);

// === RUTAS DE LECTURA ===
router.put('/conversations/:conversationId/read', JWTAuthMiddleware.authenticate, MessageController.markAsRead);
router.get('/unread-count/:userId', JWTAuthMiddleware.authenticate, MessageController.getUnreadCount);

module.exports = router;
router.delete('/conversations/:id', ConversationController.deleteConversation);

module.exports = router;
