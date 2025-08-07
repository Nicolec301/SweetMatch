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

// Configurar CORS usando la URL del .env
const frontendUrl = process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000';
const backendUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';

// Middlewares
app.use(cors({
  origin: [frontendUrl, backendUrl],
  credentials: true
}));
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

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
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

    // Iniciar servidor
    const port = SERVER_CONFIG.port;
    app.listen(port, () => {
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