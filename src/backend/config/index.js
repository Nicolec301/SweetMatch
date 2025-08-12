// Configuración simple del backend
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
    ssl: false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  
  // Configuración del servidor
  server: {
    port: parseInt(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  }
};

// Exportaciones
module.exports = {
  GOOGLE_CLIENT_ID: config.google.clientId,
  DB_CONFIG: config.database,
  SERVER_CONFIG: config.server
};
