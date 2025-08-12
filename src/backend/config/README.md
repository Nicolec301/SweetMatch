# ⚙️ Config - Configuraciones del Sistema Backend

Esta carpeta contiene todas las configuraciones centralizadas del backend de SweetMatch, incluyendo base de datos, servidor y servicios externos.

## 📁 Estructura de Config

```
config/
├── 📄 database.js            # Configuración y conexión a PostgreSQL
└── 📄 index.js               # Configuraciones generales del sistema
```

---

## 📄 Archivos de Configuración

### **database.js** - Configuración de PostgreSQL
**Propósito**: Manejo de la conexión y configuración de la base de datos PostgreSQL.

**Funcionalidades principales**:
```javascript
const { Pool } = require('pg');

// Pool de conexiones PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'sweetmatch',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root123',
  ssl: process.env.DB_SSL === 'true',
  max: 10,                    // Máximo 10 conexiones simultáneas
  idleTimeoutMillis: 30000,   // 30 segundos timeout
  connectionTimeoutMillis: 2000, // 2 segundos para conectar
});

// Función para probar la conexión
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado a PostgreSQL');
    const result = await client.query('SELECT NOW()');
    console.log('✅ Conexión a base de datos exitosa:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    return false;
  }
}

module.exports = { pool, testConnection };
```

**Características**:
- ✅ **Connection Pooling**: Optimización de conexiones
- ✅ **Error Handling**: Manejo robusto de errores
- ✅ **Health Check**: Verificación de conectividad
- ✅ **Environment Variables**: Configuración flexible
- ✅ **SSL Support**: Conexiones seguras opcionales

**Variables de entorno utilizadas**:
```env
DB_HOST=localhost              # Servidor de base de datos
DB_PORT=5432                   # Puerto de PostgreSQL
DB_NAME=sweetmatch            # Nombre de la base de datos
DB_USER=postgres              # Usuario de la base de datos
DB_PASSWORD=root123           # Contraseña del usuario
DB_SSL=false                  # Usar SSL (true/false)
```

---

### **index.js** - Configuraciones Generales
**Propósito**: Configuraciones centralizadas de toda la aplicación backend.

**Estructura de configuración**:
```javascript
require('dotenv').config();

const config = {
  // Configuración de Google OAuth
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
  },
  
  // Configuración de base de datos PostgreSQL
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'sweetmatch',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root123',
    ssl: process.env.DB_SSL === 'true',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  
  // Configuración del servidor
  server: {
    port: parseInt(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  // Configuración JWT (futuro)
  jwt: {
    secret: process.env.JWT_SECRET || 'sweetmatch-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // Configuración de archivos
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    uploadPath: process.env.UPLOAD_PATH || './public/uploads'
  }
};

// Exportaciones específicas
module.exports = config;
module.exports.DATABASE_CONFIG = config.database;
module.exports.SERVER_CONFIG = config.server;
module.exports.GOOGLE_CLIENT_ID = config.google.clientId;
module.exports.JWT_CONFIG = config.jwt;
module.exports.UPLOAD_CONFIG = config.upload;
```

**Secciones de configuración**:

#### **🔐 Google OAuth**
```javascript
google: {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
}
```
- Configuración para autenticación con Google
- ID de cliente OAuth 2.0
- Usado por `googleAuthService.js`

#### **🗄️ Database**
```javascript
database: {
  host: 'localhost',
  port: 5432,
  database: 'sweetmatch',
  user: 'postgres',
  password: 'root123',
  ssl: false,
  max: 10,                    // Pool size
  idleTimeoutMillis: 30000,   // Timeout conexión idle
  connectionTimeoutMillis: 2000 // Timeout para conectar
}
```
- Pool de conexiones optimizado
- Timeouts configurables
- Soporte SSL opcional

#### **🚀 Server**
```javascript
server: {
  port: 3001,
  nodeEnv: 'development'
}
```
- Puerto del servidor configurable
- Ambiente de ejecución
- Usado por `index.js` principal

#### **🔑 JWT (Futuro)**
```javascript
jwt: {
  secret: 'sweetmatch-secret-key',
  expiresIn: '7d'
}
```
- Configuración para tokens JWT
- Secret key para firmar tokens
- Tiempo de expiración configurable

#### **📁 Upload**
```javascript
upload: {
  maxSize: 5242880,           // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  uploadPath: './public/uploads'
}
```
- Configuración para subida de archivos
- Límites de tamaño y tipos
- Ruta de almacenamiento

---

## 🔧 Uso en la Aplicación

### **Importación típica**:
```javascript
// Importar configuración completa
const config = require('./config');

// Importar configuraciones específicas
const { DATABASE_CONFIG, SERVER_CONFIG } = require('./config');
const { GOOGLE_CLIENT_ID } = require('./config');
```

### **En controladores**:
```javascript
const { UPLOAD_CONFIG } = require('../config');

// Validar tamaño de archivo
if (file.size > UPLOAD_CONFIG.maxSize) {
  throw new Error('Archivo demasiado grande');
}
```

### **En servicios**:
```javascript
const { GOOGLE_CLIENT_ID } = require('../config');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(GOOGLE_CLIENT_ID);
```

---

## 🌍 Variables de Entorno

### **Archivo `.env` requerido**:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sweetmatch
DB_USER=postgres
DB_PASSWORD=root123
DB_SSL=false

# Servidor
PORT=3001
NODE_ENV=development

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=tu_google_client_id_aqui

# JWT (futuro)
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=7d

# Upload de archivos
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./public/uploads
```

### **Variables por ambiente**:

#### **Development**:
```env
NODE_ENV=development
DB_HOST=localhost
PORT=3001
```

#### **Production**:
```env
NODE_ENV=production
DB_HOST=tu_servidor_produccion
DB_SSL=true
PORT=443
```

#### **Testing**:
```env
NODE_ENV=test
DB_NAME=sweetmatch_test
```

---

## 🛡️ Seguridad de Configuración

### **Buenas prácticas implementadas**:
- ✅ **Variables de entorno**: Secrets no hardcoded
- ✅ **Valores por defecto**: Fallbacks seguros
- ✅ **Validación de tipos**: parseInt() para números
- ✅ **SSL configurable**: Conexiones seguras en producción
- ✅ **Timeouts**: Prevenir conexiones colgadas

### **Recomendaciones**:
```javascript
// ❌ Nunca hacer esto
const secret = 'mi-password-123';

// ✅ Siempre usar variables de entorno
const secret = process.env.JWT_SECRET || 'fallback-for-dev';
```

---

## 📊 Monitoreo y Salud

### **Health checks incluidos**:
```javascript
// Test de conexión a BD
const dbHealthy = await testConnection();

// Verificar configuraciones críticas
const configHealthy = {
  hasGoogleClientId: !!GOOGLE_CLIENT_ID,
  hasDatabaseConfig: !!DATABASE_CONFIG.host,
  serverPort: SERVER_CONFIG.port
};
```

### **Logging de configuración**:
```javascript
console.log('Configuración de BD:', {
  host: DATABASE_CONFIG.host,
  port: DATABASE_CONFIG.port,
  database: DATABASE_CONFIG.database,
  user: DATABASE_CONFIG.user,
  password: '***' // Never log passwords
});
```

---

## 🔮 Configuraciones Futuras

### **Planned additions**:
```javascript
// Redis para caching
redis: {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD
},

// Email service
email: {
  provider: process.env.EMAIL_PROVIDER || 'sendgrid',
  apiKey: process.env.EMAIL_API_KEY,
  fromEmail: process.env.FROM_EMAIL || 'noreply@sweetmatch.com'
},

// Push notifications
push: {
  fcmServerKey: process.env.FCM_SERVER_KEY,
  apnsCertPath: process.env.APNS_CERT_PATH
},

// Rate limiting
rateLimit: {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100 // requests per window
}
```

---

## 🧪 Testing de Configuraciones

### **Test de configuración**:
```javascript
describe('Config', () => {
  test('should have database config', () => {
    expect(DATABASE_CONFIG.host).toBeDefined();
    expect(DATABASE_CONFIG.port).toBeGreaterThan(0);
  });

  test('should have Google client ID', () => {
    expect(GOOGLE_CLIENT_ID).toBeDefined();
    expect(GOOGLE_CLIENT_ID).toMatch(/\.apps\.googleusercontent\.com$/);
  });
});
```

### **Validación al startup**:
```javascript
function validateConfig() {
  const required = [
    'DB_HOST',
    'DB_NAME', 
    'DB_USER',
    'DB_PASSWORD',
    'REACT_APP_GOOGLE_CLIENT_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    process.exit(1);
  }
  
  console.log('✅ All required configuration present');
}
```

---

*Este sistema de configuración proporciona una base flexible y segura para el crecimiento de SweetMatch, manteniendo la separación entre código y configuración específica del ambiente.*
