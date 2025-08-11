// Utilidades de sesión para el frontend - Usa SessionManager singleton
import ApiService from './ApiService';
import SessionManager from './SessionManager';

class SessionUtils {
  constructor() {
    this.sessionManager = SessionManager.getInstance();
  }

  // Verificar si hay una sesión activa
  isAuthenticated() {
    return this.sessionManager.isAuthenticated();
  }

  // Obtener sesión activa
  getActiveSession() {
    if (!this.sessionManager.isAuthenticated()) {
      return null;
    }
    
    return {
      user: this.sessionManager.getCurrentUser(),
      token: this.sessionManager.getToken(),
      timestamp: Date.now()
    };
  }

  // Crear sesión (delegada al SessionManager)
  createSession(userData, token) {
    const result = this.sessionManager.login(userData, token);
    return result;
  }

  // Cerrar sesión
  logout() {
    const result = this.sessionManager.logout();
    // Redireccionar después del logout
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
    return result;
  }

  // Handle Google Login (con backend real)
  async handleGoogleLogin(credentialResponse) {
    try {
      console.log('🔐 Token de Google recibido');
      
      // Enviar token al backend para verificación
      const response = await ApiService.request('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      
      if (response.success) {
        // Aceptar tanto response.data como response.user (retrocompatibilidad)
        const payload = response.data || response.user;
        const normalized = payload ? {
          ...payload,
          // Asegurar que exista 'nombre'
          nombre: payload.nombre || payload.name || payload.email?.split('@')[0] || 'Usuario'
        } : null;

        if (!normalized) {
          return {
            success: false,
            message: 'Respuesta inválida del servidor (sin datos de usuario)'
          };
        }

        this.sessionManager.login(normalized, credentialResponse.credential);
        return {
          success: true,
          message: `¡Bienvenido ${normalized?.nombre || 'Usuario'}!`,
          session: this.getActiveSession()
        };
      } else {
        return {
          success: false,
          message: response.message || 'Error en login con Google'
        };
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
      return {
        success: false,
        message: 'Error de conexión con Google'
      };
    }
  }

  // Handle Traditional Login (con backend real)
  async handleTraditionalLogin(formData) {
    try {
      console.log('🔐 Intentando login tradicional para:', formData.email);
      const response = await ApiService.loginUser(formData);
      
      if (response.success) {
        this.sessionManager.login(response.data, 'session-token');
        return {
          success: true,
          message: `¡Bienvenido ${response.data.nombre}!`,
          session: this.getActiveSession()
        };
      } else {
        return {
          success: false,
          message: response.message || 'Error en las credenciales'
        };
      }
    } catch (error) {
      console.error('Error en login tradicional:', error);
      return {
        success: false,
        message: 'Error de conexión. Verifique su conexión a internet.'
      };
    }
  }
}

// Exportar instancia singleton
const sessionUtils = new SessionUtils();

export const isAuthenticated = () => sessionUtils.isAuthenticated();
export const getActiveSession = () => sessionUtils.getActiveSession();
export const logout = () => sessionUtils.logout();
export const handleGoogleLogin = (credentialResponse) => sessionUtils.handleGoogleLogin(credentialResponse);
export const handleTraditionalLogin = (formData) => sessionUtils.handleTraditionalLogin(formData);

export default sessionUtils;
