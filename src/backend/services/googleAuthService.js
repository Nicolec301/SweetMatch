// Verificación real de Google ID Token para el backend
const { GOOGLE_CLIENT_ID } = require('../config/index');
const { OAuth2Client } = require('google-auth-library');

class GoogleAuthService {
  constructor() {
    this.clientId = GOOGLE_CLIENT_ID;
    this.client = new OAuth2Client(this.clientId);
  }

  /**
   * Verifica el ID token de Google y retorna datos del usuario.
   * No hardcodea ningún usuario; usa únicamente los datos del token.
   */
  async verifyToken(idToken) {
    try {
      if (!idToken) {
        throw new Error('Token no proporcionado');
      }

      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Token inválido');
      }

      // Datos comunes del payload: sub (ID), email, name, given_name, family_name, picture
      return {
        valid: true,
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
          picture: payload.picture
        }
      };
    } catch (error) {
      console.error('Error verificando token de Google:', error.message);
      return { valid: false, error: error.message };
    }
  }
}

module.exports = new GoogleAuthService();