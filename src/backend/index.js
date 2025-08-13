require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const path = require('path');
const { testConnection } = require('./config/database');
const { SERVER_CONFIG } = require('./config');
const corsOptions = require('./config/cors');
const ErrorHandler = require('./utils/errorHandler');
const logger = require('./utils/logger');

// Importar rutas
const apiRoutes = require('./routes/api');

// Crear aplicación Express
const app = express();

// Middleware de logging para requests
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.request(req, res, duration);
  });
  
  next();
});

// Middlewares
app.use(require('cors')(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos subidos (fotos de usuarios)
// Ruta desde la raíz del proyecto principal, no desde src/backend
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'public', 'uploads')));

// Servir imágenes de demo y recursos estáticos
app.use('/images', express.static(path.join(__dirname, '..', '..', 'public', 'images')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Usar rutas de la API
app.use('/api', apiRoutes);

// Middlewares de manejo de errores
app.use('*', ErrorHandler.notFound);
app.use(ErrorHandler.handle);

// Middleware para rutas no encontradas (Socket.io compatible)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/socket.io')) return next();
  ErrorHandler.notFound(req, res);
});

// Inicializar servidor
async function startServer() {
  try {
    // Probar conexión a base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    logger.info('Conexión a base de datos establecida');

    // Iniciar servidor con Socket.io
    const port = SERVER_CONFIG.port;
    const httpServer = require('http').createServer(app);
    const { Server } = require('socket.io');
    const io = new Server(httpServer, {
      cors: corsOptions
    });

    // Compartir instancia de io globalmente
    app.set('io', io);

    io.on('connection', (socket) => {
      logger.info('Cliente conectado vía Socket.io', { socketId: socket.id });

      // Unirse a salas de conversación
      socket.on('joinConversation', (conversationId) => {
        socket.join(`conversation:${conversationId}`);
        logger.debug('Usuario se unió a conversación', { socketId: socket.id, conversationId });
      });

      // Unirse a sala personal de usuario (para notificaciones)
      socket.on('joinUser', (userId) => {
        socket.join(`user:${userId}`);
        logger.debug('Usuario se unió a sala personal', { socketId: socket.id, userId });
      });

      socket.on('disconnect', () => {
        logger.info('Cliente desconectado', { socketId: socket.id });
      });
    });

    httpServer.listen(port, () => {
      logger.info('Servidor SweetMatch iniciado exitosamente', { 
        port,
        environment: process.env.NODE_ENV || 'development'
      });
      console.log(`🚀 Servidor SweetMatch iniciado en puerto ${port}`);
      console.log(`📱 API disponible en http://localhost:${port}/api`);
      console.log(`🩺 Health check: http://localhost:${port}/health`);
    });

  } catch (error) {
    logger.error('Error crítico iniciando servidor', error);
    console.error('❌ Error iniciando servidor:', error.message);
    process.exit(1);
  }
}

// Iniciar si es el archivo principal
if (require.main === module) {
  startServer();
}

module.exports = app;