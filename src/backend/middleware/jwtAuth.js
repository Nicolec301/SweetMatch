// Middleware de autenticación JWT real
const jwt = require('jsonwebtoken');
const { JWT_CONFIG } = require('../config');
const logger = require('../utils/logger');

class JWTAuthMiddleware {
  /**
   * Middleware principal de autenticación JWT
   */
  static authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Token de acceso requerido'
        });
      }

      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Formato de token inválido'
        });
      }

      const token = authHeader.substring(7); // Remover "Bearer "
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      // Verificar el token
      const decoded = jwt.verify(token, JWT_CONFIG.secret);
      
      // Agregar datos del usuario al request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        nombre: decoded.nombre,
        iat: decoded.iat,
        exp: decoded.exp
      };

      // Para compatibilidad con código existente
      req.body.currentUserId = decoded.id;

      logger.info('Usuario autenticado via JWT', { 
        userId: decoded.id, 
        email: decoded.email 
      });

      next();
    } catch (error) {
      logger.error('Error de autenticación JWT', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado',
          code: 'TOKEN_EXPIRED'
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido',
          code: 'INVALID_TOKEN'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error de autenticación interno'
      });
    }
  }

  /**
   * Middleware opcional - permite acceso sin token pero agrega usuario si existe
   */
  static optional(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // No hay token, continuar sin usuario
        return next();
      }

      const token = authHeader.substring(7);
      
      if (!token) {
        return next();
      }

      // Verificar el token si existe
      const decoded = jwt.verify(token, JWT_CONFIG.secret);
      
      req.user = {
        id: decoded.id,
        email: decoded.email,
        nombre: decoded.nombre,
        iat: decoded.iat,
        exp: decoded.exp
      };

      req.body.currentUserId = decoded.id;

      next();
    } catch (error) {
      // Si hay error en token opcional, continuar sin usuario
      logger.warning('Token opcional inválido', error.message);
      next();
    }
  }

  /**
   * Generar un token JWT para un usuario
   */
  static generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre || user.name
    };

    return jwt.sign(payload, JWT_CONFIG.secret, {
      expiresIn: JWT_CONFIG.expiresIn
    });
  }

  /**
   * Generar token de refresh
   */
  static generateRefreshToken(user) {
    const payload = {
      id: user.id,
      type: 'refresh'
    };

    return jwt.sign(payload, JWT_CONFIG.secret, {
      expiresIn: JWT_CONFIG.refreshExpiresIn
    });
  }

  /**
   * Verificar token de refresh
   */
  static verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.secret);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Token de refresh inválido');
      }

      return decoded;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JWTAuthMiddleware;
