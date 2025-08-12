// Controlador de autenticación con JWT
const bcrypt = require('bcrypt');
const User = require('../models/User');
const JWTAuthMiddleware = require('../middleware/jwtAuth');
const GoogleAuthService = require('../services/googleAuthService');
const logger = require('../utils/logger');

class AuthController {
  /**
   * Login con email y contraseña
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      // Buscar usuario por email
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar tokens
      const accessToken = JWTAuthMiddleware.generateToken(user);
      const refreshToken = JWTAuthMiddleware.generateRefreshToken(user);

      logger.info('Login exitoso', { userId: user.id, email: user.email });

      // Remover datos sensibles
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: userWithoutPassword,
          tokens: {
            access: accessToken,
            refresh: refreshToken
          }
        }
      });
    } catch (error) {
      logger.error('Error en login', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Login/Registro con Google OAuth
   */
  static async googleAuth(req, res) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: 'Token de Google requerido'
        });
      }

      // Verificar token de Google
      const verification = await GoogleAuthService.verifyToken(idToken);
      
      if (!verification.valid) {
        return res.status(401).json({
          success: false,
          message: 'Token de Google inválido'
        });
      }

      const googleUser = verification.user;

      // Buscar si el usuario ya existe
      let user = await User.findByEmail(googleUser.email);

      if (!user) {
        // Crear nuevo usuario
        user = await User.create({
          nombre: googleUser.name,
          email: googleUser.email,
          foto_perfil: googleUser.picture,
          provider: 'google',
          provider_id: googleUser.id,
          email_verificado: true
        });

        logger.info('Nuevo usuario creado via Google', { userId: user.id, email: user.email });
      } else {
        logger.info('Usuario existente logueado via Google', { userId: user.id, email: user.email });
      }

      // Generar tokens JWT
      const accessToken = JWTAuthMiddleware.generateToken(user);
      const refreshToken = JWTAuthMiddleware.generateRefreshToken(user);

      // Remover datos sensibles
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Autenticación con Google exitosa',
        data: {
          user: userWithoutPassword,
          tokens: {
            access: accessToken,
            refresh: refreshToken
          }
        }
      });
    } catch (error) {
      logger.error('Error en autenticación Google', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Refresh token
   */
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token requerido'
        });
      }

      // Verificar refresh token
      const decoded = JWTAuthMiddleware.verifyRefreshToken(refreshToken);

      // Obtener usuario actualizado
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Generar nuevo access token
      const newAccessToken = JWTAuthMiddleware.generateToken(user);

      res.json({
        success: true,
        message: 'Token renovado',
        data: {
          token: newAccessToken
        }
      });
    } catch (error) {
      logger.error('Error renovando token', error);
      res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }
  }

  /**
   * Logout (invalidar tokens - requiere implementación de blacklist)
   */
  static async logout(req, res) {
    try {
      // TODO: Implementar blacklist de tokens para logout real
      logger.info('Logout realizado', { userId: req.user.id });
      
      res.json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      logger.error('Error en logout', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Obtener información del usuario autenticado
   */
  static async me(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Remover datos sensibles
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      logger.error('Error obteniendo perfil de usuario', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = AuthController;
