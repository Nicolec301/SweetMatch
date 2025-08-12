# 🛡️ Middleware - Middlewares del Backend

Esta carpeta contiene los middlewares personalizados que se ejecutan entre las peticiones HTTP y los controladores, manejando autenticación, autorización, validación y otras funcionalidades transversales.

## 📁 Estructura de Middleware

```
middleware/
└── 📄 tempAuth.js    # Middleware temporal de autenticación
```

---

## 🔐 tempAuth.js - Middleware de Autenticación Temporal

**Propósito**: Manejo temporal de autenticación mientras se implementa el sistema completo de autenticación con JWT/Sessions.

### **Funcionalidades principales**:

#### **1. Validación de usuarios**
```javascript
const tempAuth = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }
    
    // Extraer token (formato: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
    }
    
    // Validación temporal (para desarrollo)
    if (token === 'temp-dev-token') {
      req.user = {
        id: 'temp-user-id',
        email: 'dev@sweetmatch.com',
        isAuthenticated: true,
        role: 'user'
      };
      return next();
    }
    
    // Si no es token temporal, rechazar
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
    
  } catch (error) {
    console.error('Error en tempAuth middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno de autenticación'
    });
  }
};
```

#### **2. Middleware opcional**
```javascript
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    // Si hay header, validar
    return tempAuth(req, res, next);
  } else {
    // Si no hay header, continuar sin usuario
    req.user = null;
    return next();
  }
};
```

#### **3. Verificación de roles**
```javascript
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticación requerida'
      });
    }
    
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes'
      });
    }
    
    next();
  };
};
```

### **Uso en rutas**:
```javascript
// En routes/api.js
const { tempAuth, optionalAuth, requireRole } = require('../middleware/tempAuth');

// Rutas protegidas
router.get('/users/profile', tempAuth, UserController.getProfile);
router.put('/users/:id', tempAuth, UserController.updateUser);

// Rutas con autenticación opcional
router.get('/users/search', optionalAuth, SearchController.searchUsers);

// Rutas con roles específicos
router.delete('/users/:id', tempAuth, requireRole('admin'), UserController.deleteUser);
```

---

## 🚀 Middleware Futuro a Implementar

### **1. JWT Authentication Middleware**
```javascript
// auth.js (futuro)
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    req.user = user;
    next();
  });
};
```

### **2. Rate Limiting Middleware**
```javascript
// rateLimiter.js (futuro)
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Demasiadas peticiones, intenta más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Demasiados intentos de login, intenta más tarde'
  }
});
```

### **3. Validation Middleware**
```javascript
// validation.js (futuro)
const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }
  
  next();
};

// Validaciones específicas
const validateUserRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('nombre').trim().isLength({ min: 2, max: 50 }),
  body('fechaNacimiento').isISO8601().toDate(),
  handleValidationErrors
];
```

### **4. CORS Middleware**
```javascript
// cors.js (futuro)
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://sweetmatch.app',
      'https://www.sweetmatch.app'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

const corsMiddleware = cors(corsOptions);
```

### **5. Logging Middleware**
```javascript
// logger.js (futuro)
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: duration,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};
```

### **6. Error Handling Middleware**
```javascript
// errorHandler.js (futuro)
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Error de duplicado en DB
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'El recurso ya existe'
    });
  }
  
  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
  
  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message
  });
};
```

---

## 🎯 Patrones de Implementación

### **Orden de middlewares en Express**:
```javascript
// app.js
const express = require('express');
const app = express();

// 1. Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 2. Middlewares de seguridad
app.use(cors(corsOptions));
app.use(helmet());

// 3. Middlewares de logging
app.use(requestLogger);

// 4. Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// 5. Rutas con middlewares específicos
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', tempAuth, require('./routes/users'));
app.use('/api/matches', tempAuth, require('./routes/matches'));

// 6. Error handling (siempre al final)
app.use(errorHandler);
```

### **Middleware condicional**:
```javascript
const conditionalAuth = (condition) => {
  return (req, res, next) => {
    if (condition(req)) {
      return tempAuth(req, res, next);
    } else {
      return next();
    }
  };
};

// Uso: requerir auth solo para ciertos endpoints
app.use('/api/users', conditionalAuth(req => req.method !== 'GET'));
```

### **Middleware de validación de ownership**:
```javascript
const validateOwnership = (resourceModel) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user.id;
      
      const resource = await resourceModel.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Recurso no encontrado'
        });
      }
      
      if (resource.userId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para este recurso'
        });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};
```

---

## 🔧 Testing de Middlewares

### **Test para tempAuth**:
```javascript
const request = require('supertest');
const express = require('express');
const tempAuth = require('../middleware/tempAuth');

describe('tempAuth middleware', () => {
  let app;
  
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/protected', tempAuth, (req, res) => {
      res.json({ success: true, user: req.user });
    });
  });
  
  test('should reject request without authorization header', async () => {
    const response = await request(app)
      .get('/protected')
      .expect(401);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Token de autenticación requerido');
  });
  
  test('should accept valid temp token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer temp-dev-token')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.user.isAuthenticated).toBe(true);
  });
});
```

---

## 📚 Mejores Prácticas

### **1. Middleware reutilizable**:
```javascript
// Crear middlewares genéricos
const createAuthMiddleware = (options = {}) => {
  const { optional = false, roles = [] } = options;
  
  return (req, res, next) => {
    // Lógica de autenticación adaptable
    if (optional && !req.headers.authorization) {
      req.user = null;
      return next();
    }
    
    // Validar autenticación
    // Validar roles si se especifican
    
    next();
  };
};
```

### **2. Error handling consistente**:
```javascript
// Wrapper para async middlewares
const asyncMiddleware = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Uso
app.get('/users', asyncMiddleware(async (req, res) => {
  const users = await UserModel.findAll();
  res.json(users);
}));
```

### **3. Middleware de desarrollo vs producción**:
```javascript
const devMiddleware = process.env.NODE_ENV === 'development' 
  ? require('./middleware/development')
  : (req, res, next) => next();

app.use(devMiddleware);
```

---

*Los middlewares proporcionan una capa de procesamiento consistente y reutilizable para todas las peticiones HTTP, garantizando seguridad, validación y funcionalidades transversales en SweetMatch.*
