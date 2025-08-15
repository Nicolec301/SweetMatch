// Rutas de usuarios y gestión de fotos
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const JWTAuthMiddleware = require('../middleware/jwtAuth');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const UserPhotoModel = require('../models/UserPhoto');

// === CONFIGURACIÓN DE UPLOAD ===
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

// === RUTAS BÁSICAS DE USUARIOS ===
router.get('/', UserController.getUsers);
router.get('/online', JWTAuthMiddleware.authenticate, UserController.getOnlineUsers);
router.get('/:id', UserController.getUserById);
router.put('/complete-profile', JWTAuthMiddleware.authenticate, UserController.completeProfile);
router.put('/:id', JWTAuthMiddleware.authenticate, UserController.updateUser);
router.delete('/:id', JWTAuthMiddleware.authenticate, UserController.deleteUser);

// === RUTAS DE ESTADO ONLINE ===
router.post('/status/online', JWTAuthMiddleware.authenticate, UserController.setUserOnline);
router.post('/status/offline', JWTAuthMiddleware.authenticate, UserController.setUserOffline);

// === RUTAS DE GESTIÓN DE FOTOS ===

// Subir foto de usuario
router.post('/:id/photos', JWTAuthMiddleware.authenticate, upload.single('foto'), async (req, res) => {
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
router.put('/:id/photos/:photoId/principal', JWTAuthMiddleware.authenticate, async (req, res) => {
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
router.get('/:id/photos', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const photos = await UserPhotoModel.getUserPhotos(userId);
    res.json({ success:true, data: photos.data });
  } catch (error) {
    res.status(500).json({ success:false, message:'Error listando fotos', error: error.message });
  }
});

// Eliminar foto
router.delete('/:id/photos/:photoId', JWTAuthMiddleware.authenticate, async (req, res) => {
  try {
    const photoId = parseInt(req.params.photoId);
    const result = await UserPhotoModel.deletePhoto(photoId);
    res.json({ success:true, data: result });
  } catch (error) {
    res.status(500).json({ success:false, message:'Error eliminando foto', error: error.message });
  }
});

// === RUTAS DE INTERESES (públicas) ===
router.get('/interests/available', UserController.getInterests);

// === RUTAS DE CONTADOR DE NO LEÍDOS ===
router.get('/:userId/unread-count', JWTAuthMiddleware.authenticate, async (req, res) => {
  // Esta ruta podría moverse a chatRoutes, pero está relacionada con usuarios
  const MessageController = require('../controllers/MessageController');
  return MessageController.getUnreadCount(req, res);
});

module.exports = router;
