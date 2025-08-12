// Manejador centralizado de errores
class ErrorHandler {
  static handle(err, req, res, next) {
    console.error('🚨 Error capturado:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    // Errores de validación
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: err.errors
      });
    }

    // Errores de base de datos
    if (err.code === '23505') { // Duplicate key
      return res.status(409).json({
        success: false,
        message: 'El recurso ya existe'
      });
    }

    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({
        success: false,
        message: 'Referencia inválida'
      });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Error de Multer (archivos)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'Archivo demasiado grande'
      });
    }

    // Error genérico
    res.status(err.status || 500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor'
        : err.message
    });
  }

  static notFound(req, res) {
    res.status(404).json({
      success: false,
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
  }
}

module.exports = ErrorHandler;