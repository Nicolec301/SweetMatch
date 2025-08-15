# 🛣️ Routes - Rutas de la API Backend

Esta carpeta contiene las definiciones de rutas HTTP que exponen la funcionalidad del backend de SweetMatch como endpoints REST API.

## 📁 Estructura de Routes

```
routes/
└── 📄 api.js    # Definición de todas las rutas de la API
```

---

## 🌐 api.js - Rutas Principales de la API

**Propósito**: Centraliza todas las rutas HTTP del backend, organizándolas por funcionalidad y aplicando middlewares apropiados.

### **Estructura general**:
```javascript
const express = require('express');
const router = express.Router();

// Importar controladores
const UserController = require('../controllers/UserController');
const MatchController = require('../controllers/MatchController');
const MessageController = require('../controllers/MessageController');
const ConversationController = require('../controllers/ConversationController');
const RegisterController = require('../controllers/RegisterController');
const SearchController = require('../controllers/SearchController');

// Importar middlewares
const JWTAuthMiddleware = require('../middleware/jwtAuth');

module.exports = router;
```

---

## 🔐 Rutas de Autenticación

### **POST /api/auth/google** - Login con Google OAuth
```javascript
/**
 * @route   POST /api/auth/google
 * @desc    Autenticar usuario con Google OAuth
 * @access  Public
 * @body    { token: string }
 */
router.post('/auth/google', async (req, res) => {
  try {
    await UserController.googleLogin(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en autenticación con Google'
    });
  }
});
```

### **POST /api/auth/logout** - Cerrar sesión
```javascript
/**
 * @route   POST /api/auth/logout  
 * @desc    Cerrar sesión del usuario
 * @access  Private
 */
router.post('/auth/logout', JWTAuthMiddleware.authenticate, async (req, res) => {
  try {
    // Implementar lógica de logout
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cerrando sesión'
    });
  }
});
```

### **GET /api/auth/profile** - Perfil del usuario autenticado
```javascript
/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/auth/profile', JWTAuthMiddleware.authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    await UserController.getUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo perfil'
    });
  }
});
```

---

## 👤 Rutas de Usuarios

### **Gestión de usuarios**
```javascript
/**
 * @route   GET /api/users
 * @desc    Listar usuarios con filtros y paginación
 * @access  Private
 * @query   { page?, limit?, gender?, minAge?, maxAge?, city? }
 */
router.get('/users', JWTAuthMiddleware.authenticate, async (req, res) => {
  await UserController.getUsers(req, res);
});

/**
 * @route   GET /api/users/:id
 * @desc    Obtener usuario específico por ID
 * @access  Private
 */
router.get('/users/:id', JWTAuthMiddleware.authenticate, async (req, res) => {
  await UserController.getUserById(req, res);
});

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar información de usuario
 * @access  Private (solo el propio usuario)
 */
router.put('/users/:id', JWTAuthMiddleware.authenticate, async (req, res) => {
  // Verificar que el usuario solo pueda editar su propio perfil
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para editar este perfil'
    });
  }
  await UserController.updateUser(req, res);
});

/**
 * @route   DELETE /api/users/:id  
 * @desc    Eliminar/desactivar cuenta de usuario
 * @access  Private (solo el propio usuario)
 */
router.delete('/users/:id', JWTAuthMiddleware.authenticate, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para eliminar esta cuenta'
    });
  }
  await UserController.deleteUser(req, res);
});
```

### **Gestión de fotos**
```javascript
/**
 * @route   GET /api/users/:id/photos
 * @desc    Obtener fotos de un usuario
 * @access  Private
 */
router.get('/users/:id/photos', JWTAuthMiddleware.authenticate, async (req, res) => {
  await UserController.getUserPhotos(req, res);
});

/**
 * @route   POST /api/users/:id/photos
 * @desc    Subir nueva foto de perfil
 * @access  Private (solo el propio usuario)
 */
router.post('/users/:id/photos', JWTAuthMiddleware.authenticate, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado'
    });
  }
  await UserController.uploadPhoto(req, res);
});

/**
 * @route   PUT /api/users/:id/photos/:photoId
 * @desc    Actualizar foto (ej: establecer como principal)
 * @access  Private (solo el propio usuario)
 */
router.put('/users/:id/photos/:photoId', JWTAuthMiddleware.authenticate, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado'
    });
  }
  await UserController.updatePhoto(req, res);
});

/**
 * @route   DELETE /api/users/:id/photos/:photoId
 * @desc    Eliminar foto de perfil
 * @access  Private (solo el propio usuario)  
 */
router.delete('/users/:id/photos/:photoId', JWTAuthMiddleware.authenticate, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado'
    });
  }
  await UserController.deletePhoto(req, res);
});
```

### **Gestión de intereses**
```javascript
/**
 * @route   GET /api/users/:id/interests
 * @desc    Obtener intereses de un usuario
 * @access  Private
 */
router.get('/users/:id/interests', JWTAuthMiddleware.authenticate, async (req, res) => {
  await UserController.getUserInterests(req, res);
});

/**
 * @route   PUT /api/users/:id/interests
 * @desc    Actualizar intereses del usuario
 * @access  Private (solo el propio usuario)
 * @body    { interests: [interestId1, interestId2, ...] }
 */
router.put('/users/:id/interests', JWTAuthMiddleware.authenticate, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado'
    });
  }
  await UserController.updateUserInterests(req, res);
});
```

---

## 💕 Rutas de Matches

```javascript
/**
 * @route   GET /api/matches
 * @desc    Obtener matches del usuario autenticado
 * @access  Private
 * @query   { status?, page?, limit? }
 */
router.get('/matches', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MatchController.getUserMatches(req, res);
});

/**
 * @route   POST /api/matches/like/:targetUserId
 * @desc    Dar like a un usuario
 * @access  Private
 */
router.post('/matches/like/:targetUserId', JWTAuthMiddleware.authenticate, async (req, res) => {
  // Verificar que no sea el mismo usuario
  if (req.user.id === req.params.targetUserId) {
    return res.status(400).json({
      success: false,
      message: 'No puedes dar like a tu propio perfil'
    });
  }
  await MatchController.createLike(req, res);
});

/**
 * @route   POST /api/matches/pass/:targetUserId
 * @desc    Hacer pass/dislike a un usuario
 * @access  Private
 */
router.post('/matches/pass/:targetUserId', JWTAuthMiddleware.authenticate, async (req, res) => {
  if (req.user.id === req.params.targetUserId) {
    return res.status(400).json({
      success: false,
      message: 'No puedes hacer pass a tu propio perfil'
    });
  }
  await MatchController.createPass(req, res);
});

/**
 * @route   POST /api/matches/super/:targetUserId
 * @desc    Dar super like a un usuario (futuro)
 * @access  Private
 */
router.post('/matches/super/:targetUserId', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MatchController.createSuperLike(req, res);
});

/**
 * @route   GET /api/matches/suggestions
 * @desc    Obtener sugerencias de usuarios compatibles
 * @access  Private
 * @query   { maxDistance?, ageRange?, interests?, limit? }
 */
router.get('/matches/suggestions', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MatchController.getMatchSuggestions(req, res);
});

/**
 * @route   GET /api/matches/mutual
 * @desc    Obtener matches mutuos confirmados
 * @access  Private
 */
router.get('/matches/mutual', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MatchController.getMutualMatches(req, res);
});

/**
 * @route   DELETE /api/matches/:matchId
 * @desc    Deshacer/eliminar match
 * @access  Private (solo participantes del match)
 */
router.delete('/matches/:matchId', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MatchController.unmatch(req, res);
});
```

---

## 💬 Rutas de Conversaciones y Mensajes

### **Conversaciones**
```javascript
/**
 * @route   GET /api/conversations
 * @desc    Listar conversaciones del usuario
 * @access  Private
 * @query   { page?, limit?, status? }
 */
router.get('/conversations', JWTAuthMiddleware.authenticate, async (req, res) => {
  await ConversationController.getUserConversations(req, res);
});

/**
 * @route   GET /api/conversations/:id
 * @desc    Obtener conversación específica
 * @access  Private (solo participantes)
 */
router.get('/conversations/:id', JWTAuthMiddleware.authenticate, async (req, res) => {
  await ConversationController.getConversation(req, res);
});

/**
 * @route   POST /api/conversations
 * @desc    Crear nueva conversación (normalmente automática al match)
 * @access  Private
 * @body    { participantId: string }
 */
router.post('/conversations', JWTAuthMiddleware.authenticate, async (req, res) => {
  await ConversationController.createConversation(req, res);
});

/**
 * @route   PUT /api/conversations/:id
 * @desc    Actualizar conversación (ej: archivar, bloquear)
 * @access  Private (solo participantes)
 * @body    { status?: 'active'|'archived'|'blocked' }
 */
router.put('/conversations/:id', JWTAuthMiddleware.authenticate, async (req, res) => {
  await ConversationController.updateConversation(req, res);
});

/**
 * @route   DELETE /api/conversations/:id
 * @desc    Eliminar/archivar conversación
 * @access  Private (solo participantes)
 */
router.delete('/conversations/:id', JWTAuthMiddleware.authenticate, async (req, res) => {
  await ConversationController.deleteConversation(req, res);
});
```

### **Mensajes**
```javascript
/**
 * @route   GET /api/conversations/:conversationId/messages
 * @desc    Obtener mensajes de una conversación
 * @access  Private (solo participantes de la conversación)
 * @query   { page?, limit?, before? }
 */
router.get('/conversations/:conversationId/messages', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MessageController.getConversationMessages(req, res);
});

/**
 * @route   POST /api/conversations/:conversationId/messages
 * @desc    Enviar nuevo mensaje
 * @access  Private (solo participantes de la conversación)
 * @body    { content: string, type?: 'text'|'image'|'emoji' }
 */
router.post('/conversations/:conversationId/messages', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MessageController.sendMessage(req, res);
});

/**
 * @route   PUT /api/messages/:messageId
 * @desc    Editar mensaje (dentro de 15 minutos)
 * @access  Private (solo el autor del mensaje)
 * @body    { content: string }
 */
router.put('/messages/:messageId', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MessageController.editMessage(req, res);
});

/**
 * @route   DELETE /api/messages/:messageId
 * @desc    Eliminar mensaje
 * @access  Private (solo el autor del mensaje)
 */
router.delete('/messages/:messageId', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MessageController.deleteMessage(req, res);
});

/**
 * @route   PUT /api/messages/read
 * @desc    Marcar mensajes como leídos
 * @access  Private
 * @body    { messageIds: [string], conversationId: string }
 */
router.put('/messages/read', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MessageController.markAsRead(req, res);
});

/**
 * @route   GET /api/messages/unread/count
 * @desc    Obtener conteo de mensajes no leídos
 * @access  Private
 */
router.get('/messages/unread/count', JWTAuthMiddleware.authenticate, async (req, res) => {
  await MessageController.getUnreadCount(req, res);
});
```

---

## 🔍 Rutas de Búsqueda

```javascript
/**
 * @route   GET /api/search/users
 * @desc    Búsqueda básica de usuarios
 * @access  Private
 * @query   { 
 *   q?: string,           // Nombre o descripción
 *   age?: [min, max],     // Rango de edad
 *   gender?: string,      // Género preferido
 *   city?: string,        // Ciudad
 *   distance?: number,    // Distancia máxima en km
 *   page?: number,        // Página
 *   limit?: number        // Resultados por página
 * }
 */
router.get('/search/users', JWTAuthMiddleware.authenticate, async (req, res) => {
  await SearchController.searchUsers(req, res);
});

/**
 * @route   POST /api/search/advanced
 * @desc    Búsqueda avanzada con múltiples filtros
 * @access  Private
 * @body    {
 *   ageRange: [number, number],
 *   gender: string[],
 *   interests: string[],
 *   education: string[],
 *   location: { lat: number, lng: number, radius: number },
 *   relationshipType: string[],
 *   hasPhotos: boolean,
 *   isOnline: boolean,
 *   lastActive: string,
 *   limit: number
 * }
 */
router.post('/search/advanced', JWTAuthMiddleware.authenticate, async (req, res) => {
  await SearchController.advancedSearch(req, res);
});

/**
 * @route   GET /api/search/filters
 * @desc    Obtener opciones disponibles para filtros
 * @access  Private
 */
router.get('/search/filters', JWTAuthMiddleware.authenticate, async (req, res) => {
  await SearchController.getFilterOptions(req, res);
});

/**
 * @route   GET /api/search/nearby
 * @desc    Usuarios cercanos basado en geolocalización
 * @access  Private
 * @query   { lat: number, lng: number, radius?: number, limit?: number }
 */
router.get('/search/nearby', JWTAuthMiddleware.authenticate, async (req, res) => {
  await SearchController.getNearbyUsers(req, res);
});

/**
 * @route   GET /api/search/online
 * @desc    Usuarios conectados actualmente
 * @access  Private
 * @query   { limit?: number }
 */
router.get('/search/online', JWTAuthMiddleware.authenticate, async (req, res) => {
  await SearchController.getOnlineUsers(req, res);
});
```

---

## 📝 Rutas de Registro

```javascript
/**
 * @route   POST /api/register
 * @desc    Registro tradicional con email y contraseña
 * @access  Public
 * @body    {
 *   email: string,
 *   password: string,
 *   nombre: string,
 *   fechaNacimiento: string,
 *   genero: 'male'|'female'|'non-binary'
 * }
 */
router.post('/register', async (req, res) => {
  await RegisterController.registerWithEmail(req, res);
});

/**
 * @route   POST /api/register/google
 * @desc    Registro con Google OAuth
 * @access  Public  
 * @body    { token: string, additionalInfo?: object }
 */
router.post('/register/google', async (req, res) => {
  await RegisterController.registerWithGoogle(req, res);
});

/**
 * @route   POST /api/register/complete
 * @desc    Completar perfil después del registro inicial
 * @access  Private (usuario recién registrado)
 * @body    {
 *   descripcion?: string,
 *   ciudad?: string,
 *   coordenadas?: { lat: number, lng: number },
 *   altura?: number,
 *   educacion?: string,
 *   profesion?: string,
 *   intereses: string[],
 *   fotos?: File[]
 * }
 */
router.post('/register/complete', JWTAuthMiddleware.authenticate, async (req, res) => {
  await RegisterController.completeProfile(req, res);
});

/**
 * @route   POST /api/register/verify
 * @desc    Verificar email (futuro)
 * @access  Public
 * @body    { token: string }
 */
router.post('/register/verify', async (req, res) => {
  await RegisterController.verifyEmail(req, res);
});
```

---

## 🎯 Rutas de Intereses

```javascript
/**
 * @route   GET /api/interests
 * @desc    Obtener todos los intereses disponibles
 * @access  Private
 * @query   { category?: string }
 */
router.get('/interests', JWTAuthMiddleware.authenticate, async (req, res) => {
  try {
    const Interest = require('../models/Interest');
    const result = await Interest.getByCategories();
    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo intereses'
    });
  }
});

/**
 * @route   GET /api/interests/popular
 * @desc    Obtener intereses más populares
 * @access  Private
 * @query   { limit?: number }
 */
router.get('/interests/popular', JWTAuthMiddleware.authenticate, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const Interest = require('../models/Interest');
    const result = await Interest.findMany(
      { activo: true },
      { 
        orderBy: 'popularidad DESC',
        limit: parseInt(limit)
      }
    );
    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo intereses populares'
    });
  }
});
```

---

## 📊 Rutas de Estadísticas (Futuro)

```javascript
/**
 * @route   GET /api/stats/user
 * @desc    Estadísticas del usuario autenticado
 * @access  Private
 */
router.get('/stats/user', JWTAuthMiddleware.authenticate, async (req, res) => {
  // Implementar estadísticas personales
  // - Total de likes dados/recibidos
  // - Número de matches
  // - Mensajes enviados
  // - Perfil views
  res.json({
    success: true,
    message: 'Estadísticas - por implementar'
  });
});

/**
 * @route   GET /api/stats/system
 * @desc    Estadísticas generales del sistema (admin)
 * @access  Private (admin only)
 */
router.get('/stats/system', JWTAuthMiddleware.authenticate, /* requireRole('admin'), */ async (req, res) => {
  // Implementar estadísticas del sistema
  // - Usuarios activos
  // - Matches por día
  // - Mensajes por día
  // - Tasa de retención
  res.json({
    success: true,
    message: 'Estadísticas del sistema - por implementar'
  });
});
```

---

## 🔧 Middleware de Validación por Ruta

### **Validación de parámetros**
```javascript
const validateUserId = (req, res, next) => {
  const { id } = req.params;
  
  // Validar formato UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID de usuario inválido'
    });
  }
  
  next();
};

// Aplicar a rutas con parámetro :id
router.get('/users/:id', validateUserId, JWTAuthMiddleware.authenticate, UserController.getUserById);
```

### **Validación de paginación**
```javascript
const validatePagination = (req, res, next) => {
  let { page = 1, limit = 20 } = req.query;
  
  page = parseInt(page);
  limit = parseInt(limit);
  
  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100; // Máximo 100 resultados por página
  
  req.query.page = page;
  req.query.limit = limit;
  
  next();
};

// Aplicar a rutas con paginación
router.get('/users', validatePagination, JWTAuthMiddleware.authenticate, UserController.getUsers);
```

---

## 🚨 Manejo de Errores Global

```javascript
// Middleware de manejo de errores 404
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Middleware de manejo de errores general
router.use((error, req, res, next) => {
  console.error('Error en API:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor'
      : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});
```

---

## 📝 Documentación de Headers

### **Headers requeridos**:
```javascript
/*
Authorization: Bearer <token>     // Para rutas protegidas
Content-Type: application/json    // Para requests con body
Accept: application/json          // Especificar formato de respuesta
User-Agent: SweetMatch/1.0        // Identificar la aplicación
*/
```

### **Headers opcionales**:
```javascript
/*
X-Request-ID: <uuid>              // Para tracking de requests
X-User-Location: lat,lng          // Para funcionalidades geográficas  
X-Device-ID: <device_uuid>        // Para analytics y sessions
Accept-Language: es-CO            // Para internacionalización futura
*/
```

---

*Las rutas de SweetMatch están diseñadas siguiendo principios REST, con endpoints intuitivos, manejo consistente de errores y documentación clara para facilitar el desarrollo y mantenimiento.*

