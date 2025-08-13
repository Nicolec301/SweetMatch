// Rutas específicas de usuarios
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const uploadService = require('../services/uploadService');

// Rutas de usuarios
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/complete-profile', UserController.completeProfile);
router.put('/:id/profile', UserController.updateUserProfile);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

// Rutas para upload de fotos
router.post('/:userId/photo/profile', uploadService.single('photo'), UserController.uploadProfilePhoto);
router.post('/:userId/photos/additional', uploadService.array('photos', 5), UserController.uploadAdditionalPhotos);
router.get('/:userId/photos', UserController.getUserPhotos);
router.delete('/:userId/photos/:photoId', UserController.deleteUserPhoto);

module.exports = router;
