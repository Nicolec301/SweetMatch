# 🔧 Services - Servicios del Backend

Esta carpeta contiene los servicios que encapsulan la lógica de negocio compleja, integraciones con APIs externas y funcionalidades especializadas de SweetMatch.

## 📁 Estructura de Services

```
services/
├── 📄 ApiService.js           # Servicio para llamadas HTTP externas
├── 📄 ChatService.js          # Lógica de chat y mensajería en tiempo real
├── 📄 googleAuthService.js    # Integración con Google OAuth 2.0
├── 📄 SearchService.js        # Algoritmos avanzados de búsqueda
├── 📄 SessionManager.js       # Gestión de sesiones de usuario
├── 📄 SessionManager.md       # Documentación de gestión de sesiones
└── 📄 sessionUtils.js         # Utilidades para manejo de sesiones
```

---

## 🌐 ApiService.js - Cliente HTTP Universal

**Propósito**: Proporciona una interfaz unificada para realizar llamadas HTTP a servicios externos, con manejo de errores, reintentos y timeouts.

### **Funcionalidades principales**:

```javascript
class ApiService {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.defaultTimeout = options.timeout || 10000;
    this.retryCount = options.retries || 3;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'SweetMatch/1.0',
      ...options.headers
    };
  }
  
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }
  
  async post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options);
  }
  
  async put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }
  
  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }
  
  async request(method, endpoint, data, options = {}) {
    const url = new URL(endpoint, this.baseURL);
    const config = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      },
      timeout: options.timeout || this.defaultTimeout
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    // Implementar reintentos
    let lastError;
    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            await response.json().catch(() => ({}))
          );
        }
        
        const contentType = response.headers.get('Content-Type');
        if (contentType?.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text();
        }
        
      } catch (error) {
        lastError = error;
        
        if (attempt < this.retryCount && this.shouldRetry(error)) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await this.sleep(delay);
          continue;
        }
        
        break;
      }
    }
    
    throw lastError;
  }
  
  shouldRetry(error) {
    // Reintentar en errores de red o 5xx
    return error.code === 'NETWORK_ERROR' || 
           (error.status >= 500 && error.status < 600);
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

module.exports = { ApiService, ApiError };
```

### **Uso de ApiService**:
```javascript
// Crear instancia para API externa
const weatherApi = new ApiService('https://api.openweathermap.org/data/2.5', {
  headers: { 'Authorization': `Bearer ${process.env.WEATHER_API_KEY}` },
  timeout: 5000,
  retries: 2
});

// Realizar llamadas
try {
  const weather = await weatherApi.get('/weather?q=Bogota&appid=KEY');
  console.log('Clima actual:', weather);
} catch (error) {
  console.error('Error obteniendo clima:', error.message);
}
```

---

## 💬 ChatService.js - Servicio de Chat en Tiempo Real

**Propósito**: Maneja toda la lógica de chat en tiempo real usando Socket.io, incluyendo salas, notificaciones y estados de conexión.

### **Inicialización y configuración**:
```javascript
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const MessageModel = require('../models/Message');
const ConversationModel = require('../models/Conversation');

class ChatService {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });
    
    this.connectedUsers = new Map(); // userId -> socketId
    this.userSockets = new Map();    // socketId -> userInfo
    
    this.setupMiddleware();
    this.setupEventHandlers();
  }
  
  setupMiddleware() {
    // Middleware de autenticación para sockets
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Token requerido'));
        }
        
        // Validar token (temporal)
        if (token === 'temp-dev-token') {
          socket.userId = 'temp-user-id';
          socket.user = {
            id: 'temp-user-id',
            nombre: 'Usuario Desarrollo'
          };
          return next();
        }
        
        // TODO: Implementar validación JWT real
        return next(new Error('Token inválido'));
        
      } catch (error) {
        next(new Error('Error de autenticación'));
      }
    });
  }
  
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Usuario conectado: ${socket.user.nombre} (${socket.id})`);
      
      // Registrar usuario conectado
      this.connectedUsers.set(socket.userId, socket.id);
      this.userSockets.set(socket.id, {
        userId: socket.userId,
        user: socket.user,
        connectedAt: new Date()
      });
      
      // Eventos del socket
      this.handleJoinConversation(socket);
      this.handleLeaveConversation(socket);
      this.handleSendMessage(socket);
      this.handleTyping(socket);
      this.handleMarkAsRead(socket);
      this.handleDisconnect(socket);
      
      // Notificar que el usuario está online
      this.broadcastUserOnline(socket.userId);
    });
  }
}
```

### **Manejo de mensajes**:
```javascript
handleSendMessage(socket) {
  socket.on('sendMessage', async (data) => {
    try {
      const { conversationId, content, type = 'text' } = data;
      
      // Validar que el usuario pertenece a la conversación
      const canSend = await this.validateUserInConversation(
        socket.userId, 
        conversationId
      );
      
      if (!canSend) {
        socket.emit('messageError', {
          error: 'No autorizado para enviar mensajes en esta conversación'
        });
        return;
      }
      
      // Crear mensaje en la base de datos
      const message = await MessageModel.create({
        conversation_id: conversationId,
        sender_id: socket.userId,
        content: content.trim(),
        message_type: type
      });
      
      if (!message.success) {
        socket.emit('messageError', {
          error: 'Error guardando mensaje'
        });
        return;
      }
      
      // Preparar datos del mensaje para broadcast
      const messageData = {
        id: message.data.id,
        conversationId,
        senderId: socket.userId,
        senderName: socket.user.nombre,
        content: message.data.content,
        type: message.data.message_type,
        timestamp: message.data.created_at
      };
      
      // Enviar mensaje a todos los participantes de la conversación
      socket.to(`conversation:${conversationId}`).emit('newMessage', messageData);
      
      // Confirmar al remitente
      socket.emit('messageConfirmed', messageData);
      
      // Actualizar contador de mensajes no leídos para otros participantes
      await this.updateUnreadCounts(conversationId, socket.userId);
      
      // Enviar notificación push (futuro)
      await this.sendPushNotification(conversationId, socket.userId, content);
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      socket.emit('messageError', {
        error: 'Error interno enviando mensaje'
      });
    }
  });
}
```

### **Manejo de salas de conversación**:
```javascript
handleJoinConversation(socket) {
  socket.on('joinConversation', async (conversationId) => {
    try {
      // Validar que el usuario puede acceder a la conversación
      const canJoin = await this.validateUserInConversation(
        socket.userId,
        conversationId
      );
      
      if (!canJoin) {
        socket.emit('conversationError', {
          error: 'No autorizado para acceder a esta conversación'
        });
        return;
      }
      
      // Unirse a la sala de la conversación
      socket.join(`conversation:${conversationId}`);
      
      console.log(`Usuario ${socket.user.nombre} se unió a conversación ${conversationId}`);
      
      // Notificar a otros participantes que el usuario está online
      socket.to(`conversation:${conversationId}`).emit('userJoined', {
        userId: socket.userId,
        userName: socket.user.nombre
      });
      
      // Marcar mensajes como leídos al entrar
      await this.markConversationAsRead(conversationId, socket.userId);
      
      socket.emit('conversationJoined', {
        conversationId,
        message: 'Te has unido a la conversación'
      });
      
    } catch (error) {
      console.error('Error uniéndose a conversación:', error);
      socket.emit('conversationError', {
        error: 'Error uniéndose a la conversación'
      });
    }
  });
}

handleLeaveConversation(socket) {
  socket.on('leaveConversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    
    // Notificar a otros participantes
    socket.to(`conversation:${conversationId}`).emit('userLeft', {
      userId: socket.userId,
      userName: socket.user.nombre
    });
    
    console.log(`Usuario ${socket.user.nombre} salió de conversación ${conversationId}`);
  });
}
```

### **Indicadores de escritura**:
```javascript
handleTyping(socket) {
  socket.on('typing', (data) => {
    const { conversationId, isTyping } = data;
    
    socket.to(`conversation:${conversationId}`).emit('userTyping', {
      userId: socket.userId,
      userName: socket.user.nombre,
      isTyping
    });
  });
}
```

### **Utilitarios del ChatService**:
```javascript
async validateUserInConversation(userId, conversationId) {
  try {
    const conversation = await ConversationModel.findById(conversationId);
    
    if (!conversation.success || !conversation.found) {
      return false;
    }
    
    const conv = conversation.data;
    return conv.participant1_id === userId || conv.participant2_id === userId;
    
  } catch (error) {
    console.error('Error validando usuario en conversación:', error);
    return false;
  }
}

async updateUnreadCounts(conversationId, senderId) {
  // Implementar lógica para actualizar contadores no leídos
  // Emitir evento con nuevos conteos a usuarios conectados
  
  const participants = await this.getConversationParticipants(conversationId);
  
  for (const participantId of participants) {
    if (participantId !== senderId) {
      const socketId = this.connectedUsers.get(participantId);
      if (socketId) {
        const unreadCount = await MessageModel.getUnreadCountForUser(participantId);
        this.io.to(socketId).emit('unreadCountUpdate', {
          totalUnread: unreadCount
        });
      }
    }
  }
}

broadcastUserOnline(userId) {
  this.io.emit('userOnline', { userId });
}

broadcastUserOffline(userId) {
  this.io.emit('userOffline', { userId });
}

getConnectedUsers() {
  return Array.from(this.connectedUsers.keys());
}

isUserConnected(userId) {
  return this.connectedUsers.has(userId);
}
```

---

## 🔐 googleAuthService.js - Integración con Google OAuth

**Propósito**: Maneja la autenticación con Google OAuth 2.0, validación de tokens y obtención de información de usuario.

### **Configuración y setup**:
```javascript
const { OAuth2Client } = require('google-auth-library');

class GoogleAuthService {
  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }
  
  async verifyToken(idToken) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      
      return {
        valid: true,
        user: {
          id: payload.sub,
          email: payload.email,
          email_verified: payload.email_verified,
          name: payload.name,
          given_name: payload.given_name,
          family_name: payload.family_name,
          picture: payload.picture,
          locale: payload.locale
        }
      };
      
    } catch (error) {
      console.error('Error verificando token de Google:', error);
      return {
        valid: false,
        error: error.message
      };
    }
  }
  
  async getUserInfo(accessToken) {
    try {
      // Usar el access token para obtener más información
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error('Error obteniendo información de usuario');
      }
      
      const userInfo = await response.json();
      
      return {
        success: true,
        data: userInfo
      };
      
    } catch (error) {
      console.error('Error obteniendo info de usuario:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  generateAuthUrl(scopes = ['openid', 'email', 'profile']) {
    const authUrl = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true
    });
    
    return authUrl;
  }
  
  async exchangeCodeForTokens(code) {
    try {
      const { tokens } = await this.client.getToken(code);
      this.client.setCredentials(tokens);
      
      return {
        success: true,
        tokens
      };
      
    } catch (error) {
      console.error('Error intercambiando código:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new GoogleAuthService();
```

---

## 🔍 SearchService.js - Algoritmos de Búsqueda Avanzada

**Propósito**: Implementa algoritmos sofisticados de búsqueda, filtrado y ranking de usuarios compatibles.

### **Algoritmo de compatibilidad**:
```javascript
class SearchService {
  constructor() {
    this.db = require('../config/database');
  }
  
  async findCompatibleUsers(currentUserId, filters = {}, limit = 20) {
    try {
      const currentUser = await this.getCurrentUserProfile(currentUserId);
      
      if (!currentUser) {
        throw new Error('Usuario actual no encontrado');
      }
      
      const compatibleUsers = await this.executeCompatibilityQuery(
        currentUser,
        filters,
        limit
      );
      
      // Calcular score de compatibilidad para cada usuario
      const scoredUsers = compatibleUsers.map(user => ({
        ...user,
        compatibilityScore: this.calculateCompatibilityScore(currentUser, user),
        reasons: this.getCompatibilityReasons(currentUser, user)
      }));
      
      // Ordenar por score de compatibilidad
      scoredUsers.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      
      return {
        success: true,
        data: scoredUsers,
        total: scoredUsers.length
      };
      
    } catch (error) {
      console.error('Error buscando usuarios compatibles:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  calculateCompatibilityScore(currentUser, targetUser) {
    let score = 0;
    const weights = {
      commonInterests: 0.3,
      ageCompatibility: 0.2,
      locationProximity: 0.25,
      educationLevel: 0.1,
      relationshipGoals: 0.15
    };
    
    // Intereses en común (0-100)
    const commonInterestsScore = this.calculateCommonInterestsScore(
      currentUser.interests,
      targetUser.interests
    );
    score += commonInterestsScore * weights.commonInterests;
    
    // Compatibilidad de edad (0-100)
    const ageScore = this.calculateAgeCompatibilityScore(
      currentUser.edad,
      targetUser.edad
    );
    score += ageScore * weights.ageCompatibility;
    
    // Proximidad geográfica (0-100)
    const locationScore = this.calculateLocationScore(
      currentUser.coordenadas,
      targetUser.coordenadas
    );
    score += locationScore * weights.locationProximity;
    
    // Nivel educativo (0-100)
    const educationScore = this.calculateEducationCompatibility(
      currentUser.educacion,
      targetUser.educacion
    );
    score += educationScore * weights.educationLevel;
    
    // Objetivos de relación (0-100)
    const relationshipScore = this.calculateRelationshipGoalsScore(
      currentUser.tipo_relacion,
      targetUser.tipo_relacion
    );
    score += relationshipScore * weights.relationshipGoals;
    
    return Math.round(score);
  }
  
  calculateCommonInterestsScore(interests1, interests2) {
    if (!interests1?.length || !interests2?.length) return 0;
    
    const common = interests1.filter(interest => 
      interests2.some(i => i.id === interest.id)
    );
    
    const totalUnique = new Set([
      ...interests1.map(i => i.id),
      ...interests2.map(i => i.id)
    ]).size;
    
    // Jaccard similarity * 100
    return (common.length / totalUnique) * 100;
  }
  
  calculateAgeCompatibilityScore(age1, age2) {
    const ageDiff = Math.abs(age1 - age2);
    
    // Diferencias menores a 3 años = score alto
    if (ageDiff <= 3) return 100;
    if (ageDiff <= 5) return 80;
    if (ageDiff <= 8) return 60;
    if (ageDiff <= 12) return 40;
    if (ageDiff <= 15) return 20;
    
    return 0;
  }
  
  calculateLocationScore(coords1, coords2) {
    if (!coords1 || !coords2) return 50; // Score neutro sin ubicación
    
    const distance = this.calculateDistance(coords1, coords2);
    
    // Score basado en distancia (km)
    if (distance <= 5) return 100;
    if (distance <= 15) return 90;
    if (distance <= 30) return 70;
    if (distance <= 50) return 50;
    if (distance <= 100) return 30;
    
    return 10;
  }
  
  async advancedSearch(currentUserId, criteria) {
    try {
      const {
        ageRange = [18, 99],
        genders = [],
        interests = [],
        education = [],
        location = null,
        maxDistance = null,
        relationshipTypes = [],
        hasPhotos = false,
        isOnline = false,
        lastActive = null,
        excludeViewed = false,
        limit = 50
      } = criteria;
      
      let query = `
        SELECT DISTINCT u.*,
               up.url as main_photo,
               array_agg(DISTINCT i.nombre) as interest_names,
               ST_Distance(u.coordenadas, $1) / 1000 as distance_km
        FROM users u
        LEFT JOIN user_photos up ON u.id = up.user_id AND up.es_principal = true
        LEFT JOIN user_interests ui ON u.id = ui.user_id
        LEFT JOIN interests i ON ui.interest_id = i.id
      `;
      
      const params = [location ? `POINT(${location.lng} ${location.lat})` : null];
      const conditions = ['u.id != $' + (params.length + 1)];
      params.push(currentUserId);
      
      // Filtros dinámicos
      if (ageRange.length === 2) {
        conditions.push(`u.edad BETWEEN $${params.length + 1} AND $${params.length + 2}`);
        params.push(ageRange[0], ageRange[1]);
      }
      
      if (genders.length > 0) {
        conditions.push(`u.genero = ANY($${params.length + 1})`);
        params.push(genders);
      }
      
      if (hasPhotos) {
        conditions.push('up.id IS NOT NULL');
      }
      
      if (isOnline) {
        conditions.push(`u.ultima_conexion > NOW() - INTERVAL '15 minutes'`);
      }
      
      // Construir query final
      query += ` WHERE ${conditions.join(' AND ')}`;
      query += ` GROUP BY u.id, up.url`;
      query += ` ORDER BY distance_km ASC, u.ultima_conexion DESC`;
      query += ` LIMIT $${params.length + 1}`;
      params.push(limit);
      
      const result = await this.db.query(query, params);
      
      return {
        success: true,
        data: result.rows,
        total: result.rowCount
      };
      
    } catch (error) {
      console.error('Error en búsqueda avanzada:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new SearchService();
```

---

## 🎫 SessionManager.js - Gestión de Sesiones

**Propósito**: Maneja sesiones de usuario, tokens de autenticación y estado de conexión.

### **Implementación de SessionManager**:
```javascript
class SessionManager {
  constructor() {
    this.sessions = new Map(); // sessionId -> sessionData
    this.userSessions = new Map(); // userId -> Set<sessionId>
    this.cleanupInterval = setInterval(() => this.cleanup(), 15 * 60 * 1000); // 15 min
  }
  
  async createSession(userId, userAgent, ipAddress) {
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    
    const sessionData = {
      sessionId,
      userId,
      userAgent,
      ipAddress,
      createdAt: new Date(),
      lastActivity: new Date(),
      expiresAt,
      isActive: true
    };
    
    // Guardar sesión
    this.sessions.set(sessionId, sessionData);
    
    // Agregar a sesiones del usuario
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId).add(sessionId);
    
    return {
      success: true,
      sessionId,
      expiresAt
    };
  }
  
  async validateSession(sessionId) {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { valid: false, reason: 'Session not found' };
    }
    
    if (!session.isActive) {
      return { valid: false, reason: 'Session inactive' };
    }
    
    if (new Date() > session.expiresAt) {
      this.removeSession(sessionId);
      return { valid: false, reason: 'Session expired' };
    }
    
    // Actualizar última actividad
    session.lastActivity = new Date();
    
    return {
      valid: true,
      session
    };
  }
  
  generateSessionId() {
    return require('crypto').randomBytes(32).toString('hex');
  }
}

module.exports = new SessionManager();
```

---

## 🛠️ sessionUtils.js - Utilidades de Sesión

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class SessionUtils {
  static generateJWT(payload, expiresIn = '24h') {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn }
    );
  }
  
  static verifyJWT(token) {
    try {
      return {
        valid: true,
        decoded: jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
  
  static hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }
  
  static verifyPassword(password, hashedPassword) {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }
  
  static generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
  
  static extractUserAgent(req) {
    return {
      raw: req.headers['user-agent'],
      browser: this.parseBrowser(req.headers['user-agent']),
      os: this.parseOS(req.headers['user-agent']),
      device: this.parseDevice(req.headers['user-agent'])
    };
  }
  
  static getClientIP(req) {
    return req.headers['x-forwarded-for'] ||
           req.headers['x-real-ip'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null);
  }
}

module.exports = SessionUtils;
```

---

*Los servicios de SweetMatch encapsulan la lógica compleja del negocio, proporcionando APIs limpias y reutilizables para funcionalidades especializadas como autenticación, chat en tiempo real y búsqueda inteligente.*
