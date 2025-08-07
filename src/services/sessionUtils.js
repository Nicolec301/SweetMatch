// Utilidades de sesión para el frontend
import ApiService from './ApiService';

class SessionUtils {
  constructor() {
    this.SESSION_KEY = 'sweetmatch_session';
  }

  // Verificar si hay una sesión activa
  isAuthenticated() {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (!session) return false;
    
    try {
      const sessionData = JSON.parse(session);
      return sessionData && sessionData.user && sessionData.token;
    } catch {
      return false;
    }
  }

  // Obtener sesión activa
  getActiveSession() {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (!session) return null;
    
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  }

  // Crear sesión
  createSession(userData, token) {
    const sessionData = {
      user: userData,
      token: token,
      timestamp: new Date().getTime()
    };
    
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    return sessionData;
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    window.location.href = '/';
  }

  // Handle Google Login (con backend real)
  async handleGoogleLogin(credentialResponse) {
    try {
      console.log('Token de Google recibido:', credentialResponse);
      
      // Enviar token al backend para verificación
      const response = await ApiService.request('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      
      if (response.success) {
        const sessionData = this.createSession(response.user, credentialResponse.credential);
        return {
          success: true,
          message: 'Login con Google exitoso',
          session: sessionData
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
      console.log('Intentando login con:', formData);
      const response = await ApiService.loginUser(formData);
      
      if (response.success) {
        const sessionData = this.createSession(response.data, 'session-token');
        return {
          success: true,
          message: 'Login exitoso',
          session: sessionData
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
