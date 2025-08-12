# 🎮 Controllers - Controladores de la API Backend

Esta carpeta contiene todos los controladores que manejan la lógica de negocio de la API de SweetMatch, organizados por funcionalidad y siguiendo el patrón MVC.

## 📁 Estructura de Controllers

```
controllers/
├── 📄 ConversationController.js  # Gestión de conversaciones entre usuarios
├── 📄 MatchController.js         # Sistema de matches y likes
├── 📄 MessageController.js       # Mensajería y chat en tiempo real
├── 📄 RegisterController.js      # Proceso de registro de usuarios
├── 📄 SearchController.js        # Búsqueda y filtrado de usuarios
└── 📄 UserController.js          # CRUD de usuarios y perfiles
```

---

## 📋 Controladores y Funcionalidades

### **👥 UserController.js** - Gestión de Usuarios
**Propósito**: CRUD completo de usuarios, perfiles, autenticación y gestión de datos personales.

**Endpoints principales**:
```javascript
// Gestión de usuarios
GET    /api/users                # Listar usuarios con filtros
GET    /api/users/:id            # Obtener usuario específico
PUT    /api/users/:id            # Actualizar información de usuario
DELETE /api/users/:id            # Eliminar cuenta de usuario

// Autenticación
POST   /api/auth/login           # Login tradicional
POST   /api/auth/google          # Login con Google OAuth
POST   /api/auth/logout          # Cerrar sesión
GET    /api/auth/profile         # Perfil del usuario autenticado

// Gestión de fotos
POST   /api/users/:id/photos     # Subir foto de perfil
PUT    /api/users/:id/photos/:photoId  # Actualizar foto
DELETE /api/users/:id/photos/:photoId  # Eliminar foto

// Intereses
GET    /api/users/:id/interests  # Obtener intereses del usuario
PUT    /api/users/:id/interests  # Actualizar intereses
```

**Funcionalidades clave**:
- ✅ **Autenticación completa**: Login tradicional y Google OAuth
- ✅ **Gestión de perfiles**: Información personal y preferencias
- ✅ **Subida de fotos**: Múltiples fotos de perfil con validación
- ✅ **Sistema de intereses**: Categorías y tags personalizables
- ✅ **Validación de datos**: Sanitización y validación robusta
- ✅ **Soft delete**: Eliminación lógica de cuentas

**Ejemplo de método**:
```javascript
class UserController {
  async googleLogin(req, res) {
    try {
      const { token } = req.body;
      const result = await GoogleAuthService.verifyToken(token);
      
      if (result.valid) {
        const email = result.user.email;
        const existing = await UserModel.findOne({ email });
        
        if (existing.success && existing.found) {
          // Usuario existente - login
          const dbUser = await UserModel.getUserWithInterests(existing.data.id);
          return res.json({
            success: true,
            message: 'Login exitoso',
            data: dbUser.data
          });
        } else {
          // Usuario nuevo - crear cuenta
          const newUser = await UserModel.createFromGoogle(result.user);
          return res.json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: newUser.data
          });
        }
      }
    } catch (error) {
      console.error('Error en Google login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}
```

---

### **📝 RegisterController.js** - Registro de Usuarios
**Propósito**: Manejo específico del proceso de registro de nuevos usuarios.

**Endpoints**:
```javascript
POST   /api/register             # Registro tradicional
POST   /api/register/google      # Registro con Google
POST   /api/register/verify      # Verificar email (futuro)
POST   /api/register/complete    # Completar perfil después del registro
```

**Proceso de registro**:
1. **Validación inicial**: Email, contraseña, datos básicos
2. **Verificación**: Email único, formato correcto
3. **Creación de usuario**: Hash de contraseña, usuario base
4. **Perfil inicial**: Datos mínimos requeridos
5. **Redirección**: A completar perfil o login

**Validaciones implementadas**:
```javascript
validateRegistrationData(data) {
  const errors = [];
  
  // Email validation
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.push('Email inválido');
  }
  
  // Password strength
  if (!data.password || data.password.length < 8) {
    errors.push('Contraseña debe tener al menos 8 caracteres');
  }
  
  // Required fields
  const required = ['nombre', 'fechaNacimiento', 'genero'];
  required.forEach(field => {
    if (!data[field]) {
      errors.push(`${field} es requerido`);
    }
  });
  
  return errors;
}
```

---

### **💕 MatchController.js** - Sistema de Matches
**Propósito**: Lógica del sistema de matches, likes, dislikes y compatibilidad.

**Endpoints**:
```javascript
GET    /api/matches              # Obtener matches del usuario
POST   /api/matches/like/:userId # Dar like a un usuario
POST   /api/matches/pass/:userId # Hacer pass/dislike
POST   /api/matches/super/:userId # Super like (futuro)
GET    /api/matches/suggestions  # Obtener sugerencias de usuarios
GET    /api/matches/mutual       # Matches mutuos confirmados
DELETE /api/matches/:matchId     # Deshacer match
```

**Algoritmo de matches**:
```javascript
async getMatchSuggestions(userId, filters = {}) {
  const user = await UserModel.findById(userId);
  const suggestions = await UserModel.findCompatible(user, {
    age: filters.ageRange || [user.edad - 5, user.edad + 5],
    location: filters.maxDistance || 50, // km
    interests: filters.commonInterests || 1,
    exclude: await this.getAlreadyMatchedUsers(userId)
  });
  
  return suggestions.map(suggestion => ({
    ...suggestion,
    compatibilityScore: this.calculateCompatibility(user, suggestion)
  }));
}
```

**Estados de match**:
- **PENDING**: Like enviado, esperando respuesta
- **MATCHED**: Match mutuo confirmado
- **PASSED**: Usuario rechazado
- **SUPER**: Super like enviado (futuro)

---

### **💬 MessageController.js** - Sistema de Mensajería
**Propósito**: Gestión de mensajes individuales y estados de lectura.

**Endpoints**:
```javascript
GET    /api/messages/:conversationId  # Obtener mensajes de conversación
POST   /api/messages/:conversationId  # Enviar nuevo mensaje
PUT    /api/messages/:messageId/read  # Marcar como leído
DELETE /api/messages/:messageId       # Eliminar mensaje
GET    /api/messages/unread/count     # Contar mensajes no leídos
```

**Integración con Socket.io**:
```javascript
async sendMessage(req, res) {
  try {
    const { conversationId } = req.params;
    const { content, userId } = req.body;
    
    // Crear mensaje en BD
    const message = await MessageModel.create({
      conversationId,
      senderId: userId,
      content,
      timestamp: new Date()
    });
    
    // Emitir via Socket.io
    const io = req.app.get('io');
    io.to(`conversation:${conversationId}`).emit('newMessage', {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      timestamp: message.timestamp
    });
    
    res.json({
      success: true,
      message: 'Mensaje enviado',
      data: message
    });
    
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
}
```

---

### **🗨️ ConversationController.js** - Gestión de Conversaciones
**Propósito**: Manejo de conversaciones entre usuarios matched.

**Endpoints**:
```javascript
GET    /api/conversations           # Listar conversaciones del usuario
GET    /api/conversations/:id       # Obtener conversación específica
POST   /api/conversations           # Crear nueva conversación
PUT    /api/conversations/:id       # Actualizar conversación
DELETE /api/conversations/:id       # Eliminar/archivar conversación
```

**Estructura de conversación**:
```javascript
{
  id: 'uuid',
  participants: [userId1, userId2],
  createdAt: '2025-01-01T00:00:00Z',
  lastMessage: {
    content: 'Último mensaje...',
    timestamp: '2025-01-01T12:00:00Z',
    senderId: 'userId1'
  },
  unreadCount: {
    [userId1]: 0,
    [userId2]: 3
  },
  status: 'active' // active, archived, blocked
}
```

**Funcionalidades**:
- ✅ **Auto-creación**: Al hacer match mutuo
- ✅ **Conteo no leídos**: Por usuario
- ✅ **Estados**: Activa, archivada, bloqueada
- ✅ **Última actividad**: Timestamp del último mensaje
- ✅ **Participantes**: Siempre dos usuarios

---

### **🔍 SearchController.js** - Búsqueda de Usuarios
**Propósito**: Lógica avanzada de búsqueda y filtrado de usuarios.

**Endpoints**:
```javascript
GET    /api/search/users            # Búsqueda básica de usuarios
POST   /api/search/advanced         # Búsqueda con filtros avanzados
GET    /api/search/filters          # Obtener opciones de filtros
GET    /api/search/nearby           # Usuarios cercanos (geolocalización)
GET    /api/search/online           # Usuarios conectados actualmente
```

**Filtros disponibles**:
```javascript
const searchFilters = {
  // Demográficos
  ageRange: [18, 65],
  gender: ['male', 'female', 'non-binary'],
  
  // Geográficos
  location: {
    lat: 40.7128,
    lng: -74.0060,
    radius: 50 // km
  },
  
  // Intereses
  interests: ['música', 'deportes', 'viajes'],
  
  // Preferencias
  relationshipType: ['casual', 'serious', 'friendship'],
  education: ['high-school', 'college', 'postgrad'],
  
  // Actividad
  lastActive: 'week', // day, week, month
  hasPhoto: true,
  verified: false
};
```

**Algoritmo de búsqueda**:
```javascript
async advancedSearch(filters, userId) {
  let query = `
    SELECT u.*, 
           ST_Distance(u.location, $1) as distance,
           COUNT(ui.interest_id) as common_interests
    FROM users u
    LEFT JOIN user_interests ui ON u.id = ui.user_id
    WHERE u.id != $2
  `;
  
  const params = [userLocation, userId];
  
  // Aplicar filtros dinámicamente
  if (filters.ageRange) {
    query += ` AND u.age BETWEEN $${params.length + 1} AND $${params.length + 2}`;
    params.push(filters.ageRange[0], filters.ageRange[1]);
  }
  
  if (filters.maxDistance) {
    query += ` AND ST_Distance(u.location, $1) <= $${params.length + 1}`;
    params.push(filters.maxDistance * 1000); // Convert to meters
  }
  
  query += ` 
    GROUP BY u.id 
    ORDER BY common_interests DESC, distance ASC
    LIMIT $${params.length + 1}
  `;
  params.push(filters.limit || 50);
  
  return await db.query(query, params);
}
```

---

## 🏗️ Arquitectura de Controladores

### **Estructura común**:
```javascript
class ControllerName {
  // GET endpoints
  async getResource(req, res) { /* ... */ }
  async getResourceById(req, res) { /* ... */ }
  
  // POST endpoints  
  async createResource(req, res) { /* ... */ }
  
  // PUT endpoints
  async updateResource(req, res) { /* ... */ }
  
  // DELETE endpoints
  async deleteResource(req, res) { /* ... */ }
  
  // Utility methods
  validateInput(data) { /* ... */ }
  handleError(error, res) { /* ... */ }
}
```

### **Manejo de errores estándar**:
```javascript
handleError(error, res, customMessage = null) {
  console.error('Controller Error:', error);
  
  // Error de validación
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      errors: error.errors
    });
  }
  
  // Error de base de datos
  if (error.code === '23505') { // Duplicate key
    return res.status(409).json({
      success: false,
      message: 'El recurso ya existe'
    });
  }
  
  // Error genérico
  return res.status(500).json({
    success: false,
    message: customMessage || 'Error interno del servidor'
  });
}
```

### **Formato de respuesta estándar**:
```javascript
// Éxito
{
  success: true,
  message: "Operación exitosa",
  data: { /* datos del recurso */ },
  meta: { /* metadatos como paginación */ }
}

// Error
{
  success: false,
  message: "Descripción del error",
  errors: [/* array de errores específicos */]
}
```

---

## 🔐 Seguridad en Controladores

### **Validación de entrada**:
```javascript
validateUserInput(data) {
  const schema = {
    email: { type: 'email', required: true },
    password: { type: 'string', minLength: 8, required: true },
    age: { type: 'number', min: 18, max: 99, required: true }
  };
  
  return this.validate(data, schema);
}
```

### **Autorización**:
```javascript
async checkUserPermission(req, res, next) {
  const { userId } = req.params;
  const currentUser = req.user; // From auth middleware
  
  if (currentUser.id !== userId && !currentUser.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado'
    });
  }
  
  next();
}
```

### **Rate limiting por endpoint**:
```javascript
const rateLimit = require('express-rate-limit');

const searchLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Demasiadas búsquedas, intenta más tarde'
});

// Aplicar en rutas específicas
app.get('/api/search/users', searchLimit, SearchController.searchUsers);
```

---

## 📊 Performance y Optimización

### **Paginación estándar**:
```javascript
async getUsers(req, res) {
  const { page = 1, limit = 20, ...filters } = req.query;
  const offset = (page - 1) * limit;
  
  const result = await UserModel.findMany({
    filters,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
  
  res.json({
    success: true,
    data: result.data,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: result.total,
      totalPages: Math.ceil(result.total / limit)
    }
  });
}
```

### **Caching de consultas frecuentes**:
```javascript
const cache = new Map();

async getCachedSuggestions(userId) {
  const cacheKey = `suggestions:${userId}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const suggestions = await this.generateSuggestions(userId);
  cache.set(cacheKey, suggestions);
  
  // Expire after 1 hour
  setTimeout(() => cache.delete(cacheKey), 3600000);
  
  return suggestions;
}
```

---

## 🧪 Testing de Controladores

### **Unit tests ejemplo**:
```javascript
describe('UserController', () => {
  beforeEach(() => {
    // Setup test database
  });
  
  test('should create user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      nombre: 'Test User'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(userData.email);
  });
});
```

---

*Los controladores son el corazón de la API de SweetMatch, manejando toda la lógica de negocio de manera organizada, segura y escalable.*
