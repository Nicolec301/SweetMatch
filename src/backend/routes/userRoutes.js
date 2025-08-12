// Rutas específicas de usuarios
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Rutas de usuarios
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/complete-profile', UserController.completeProfile);
router.put('/:id/profile', UserController.updateUserProfile);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

// TODO: Implementar upload de fotos usando UploadService cuando esté listo
// router.post('/:id/photos', uploadService.getUploadMiddleware(), UserController.uploadPhoto);

module.exports = router;
