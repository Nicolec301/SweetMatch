/**
 * Backend Principal de SweetMatch
 * Servidor Express con conexión a PostgreSQL
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const { SERVER_CONFIG } = require('./config');

// Importar rutas
const apiRoutes = require('./routes/api');

// Crear aplicación Express
const app = express();

// Configurar CORS para permitir frontend en puerto 3001
const corsOptions = {
  origin: [
    'http://localhost:3000', // Puerto por defecto de React
    'http://localhost:3001', // Puerto actual del frontend
    'http://localhost:3002', // Puerto del backend (por si acaso)
    process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200 // Para legacy browsers
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar rutas de la API
app.use('/api', apiRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Middleware para rutas no encontradas (excluye path de socket.io para permitir handshake)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/socket.io')) return next();
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `No se pudo encontrar ${req.originalUrl}`
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Probar conexión a base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Iniciar servidor con Socket.io
    const port = SERVER_CONFIG.port;
    const httpServer = require('http').createServer(app);
    const { Server } = require('socket.io');
    const io = new Server(httpServer, {
      cors: {
        origin: corsOptions.origin,
        credentials: true
      }
    });

    // Compartir instancia de io globalmente
    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('🔌 Cliente conectado', socket.id);

      // Unirse a salas de conversación
      socket.on('joinConversation', (conversationId) => {
        socket.join(`conversation:${conversationId}`);
      });

      // Unirse a sala personal de usuario (para notificaciones)
      socket.on('joinUser', (userId) => {
        socket.join(`user:${userId}`);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Cliente desconectado', socket.id);
      });
    });

    httpServer.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Servidor SweetMatch iniciado en puerto ${port}`);
      // eslint-disable-next-line no-console
      console.log(`📱 API disponible en http://localhost:${port}/api`);
      // eslint-disable-next-line no-console
      console.log(`🩺 Health check: http://localhost:${port}/api/health`);
    });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error iniciando servidor:', error.message);
    process.exit(1);
  }
}

// Iniciar si es el archivo principal
if (require.main === module) {
  startServer();
}

module.exports = app;