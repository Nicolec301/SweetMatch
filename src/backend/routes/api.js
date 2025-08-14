// Rutas de la API
const express = require('express');
const router = express.Router();
const tempAuthMiddleware = require('../middleware/tempAuth');

// Controladores
const UserController = require('../controllers/UserController');
const RegisterController = require('../controllers/RegisterController');
const MatchController = require('../controllers/MatchController');
const MessageController = require('../controllers/MessageController');
const ConversationController = require('../controllers/ConversationController');
const SearchController = require('../controllers/SearchController');

// Rutas de registro
router.post('/register', RegisterController.registerUser.bind(RegisterController));
router.post('/register/check-email', RegisterController.checkEmailAvailability.bind(RegisterController));
router.post('/register/validate-step', RegisterController.validateStep.bind(RegisterController));

// Upload (multer)
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const UserPhotoModel = require('../models/UserPhoto');

// Configuración de almacenamiento de fotos
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'users');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const safeName = Date.now() + '-' + Math.round(Math.random()*1e6) + ext;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Formato de imagen no permitido'));
    }
    cb(null, true);
  }
});

// Rutas de usuarios
router.get('/users', UserController.getUsers);
router.get('/users/online', tempAuthMiddleware, UserController.getOnlineUsers); // Mover antes de :id
router.post('/users/status/online', tempAuthMiddleware, UserController.setUserOnline);
router.post('/users/status/offline', tempAuthMiddleware, UserController.setUserOffline);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser); // Mantener para compatibilidad
// Rutas específicas deben ir antes que las genéricas con :id
router.put('/users/complete-profile', UserController.completeProfile); // Completar perfil después del registro
router.put('/users/:id/profile', UserController.updateUserProfile); // Nueva ruta para actualizar perfil
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Subir foto de usuario
router.post('/users/:id/photos', upload.single('foto'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (!req.file) {
      return res.status(400).json({ success:false, message:'Archivo requerido (campo foto)' });
    }
    const relativePath = '/uploads/users/' + req.file.filename;
    const esPrincipal = req.body.es_principal === 'true';
    const result = await UserPhotoModel.addPhoto(userId, relativePath, esPrincipal);
    if (esPrincipal) {
      // Asegurar solo una principal
      await UserPhotoModel.customQuery('UPDATE usuario_fotos SET es_principal = false WHERE usuario_id = $1 AND id != $2',[userId, result.data.id]);
    }
    res.json({ success:true, data: result.data, url: relativePath });
  } catch (error) {
    console.error('Error subiendo foto:', error);
    res.status(500).json({ success:false, message:'Error subiendo foto', error: error.message });
  }
});

// Establecer foto principal existente
router.put('/users/:id/photos/:photoId/principal', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const photoId = parseInt(req.params.photoId);
    const updated = await UserPhotoModel.setPrincipal(userId, photoId);
    res.json({ success:true, data: updated });
  } catch (error) {
    res.status(500).json({ success:false, message:'Error estableciendo foto principal', error: error.message });
  }
});

// Listar fotos del usuario
router.get('/users/:id/photos', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const photos = await UserPhotoModel.getUserPhotos(userId);
    res.json({ success:true, data: photos.data });
  } catch (error) {
    res.status(500).json({ success:false, message:'Error listando fotos', error: error.message });
  }
});

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

// Rutas de búsqueda
router.get('/search/users', SearchController.searchUsers);
router.get('/search/interests', SearchController.getAvailableInterests);
router.get('/search/profile/:userId', SearchController.getUserProfile);
router.post('/search/send-message', SearchController.sendDirectMessage);
router.post('/search/create-test-messages', SearchController.createTestMessages); // SOLO PARA DESARROLLO

// Rutas de acciones sociales (requieren autenticación)
router.post('/matches/like', tempAuthMiddleware, MatchController.likeUser);
router.post('/matches/pass', tempAuthMiddleware, MatchController.passUser);

// Rutas de conversaciones adicionales (requieren autenticación)
router.post('/conversations/create-or-get', tempAuthMiddleware, ConversationController.createOrGetConversation);

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
