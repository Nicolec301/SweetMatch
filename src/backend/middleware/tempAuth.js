// Middleware temporal para simular autenticación
// En producción, esto se reemplazaría con JWT o sistema de autenticación real

const tempAuthMiddleware = (req, res, next) => {
  // Simular usuario autenticado para desarrollo
  // En producción esto vendría del token JWT
  if (!req.user && !req.body.currentUserId) {
    // Usar usuario de prueba por defecto para desarrollo
    req.user = {
      id: 1, // Usuario Ana García de la base de datos de ejemplo
      nombre: 'Ana García',
      email: 'ana@example.com'
    };
    
    // También agregar al body para compatibilidad
    req.body.currentUserId = 1;
  }
  
  next();
};

module.exports = tempAuthMiddleware;
