// Configuración simple de Google Auth para backend
const { GOOGLE_CLIENT_ID } = require('../config/index');

/**
 * Servicio de autenticación de Google simplificado
 */
class GoogleAuthService {
  constructor() {
    this.clientId = GOOGLE_CLIENT_ID;
  }

  // Verificar token de Google (simplificado para desarrollo)
  async verifyToken(token) {
    try {
      // En un entorno real, aquí verificarías el token con Google
      // Para desarrollo, solo verificamos que el token existe
      if (!token) {
        throw new Error('Token no proporcionado');
      }
      
      return {
        valid: true,
        user: {
          id: 'demo-user',
          email: 'demo@example.com',
          name: 'Usuario Demo'
        }
      };
    } catch (error) {
      console.error('Error verificando token:', error);
      return { valid: false, error: error.message };
    }
  }
}

module.exports = new GoogleAuthService();
