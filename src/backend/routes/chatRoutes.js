// Rutas específicas de mensajes y conversaciones
const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');
const ConversationController = require('../controllers/ConversationController');

// Rutas de mensajes
router.get('/', MessageController.getMessages);
router.post('/', MessageController.createMessage);
router.post('/send', MessageController.sendMessage);
router.put('/:id/read', MessageController.markAsRead);
router.get('/unread-count', MessageController.getUnreadCount);
router.get('/:id', MessageController.getMessageById);
router.delete('/:id', MessageController.deleteMessage);

// Rutas de conversaciones
router.get('/conversations', ConversationController.getUserConversations);
router.get('/conversations/:id', ConversationController.getConversationById);
router.post('/conversations', ConversationController.createOrGetConversation);
router.get('/conversations/:id/details', ConversationController.getConversationDetails);
router.delete('/conversations/:id', ConversationController.deleteConversation);

module.exports = router;
