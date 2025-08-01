import { jwtDecode } from 'jwt-decode';
import { googleAuthConfig } from './authConfig';

// Claves para almacenamiento en localStorage
const USER_KEY = 'sweetmatch_user';
const TOKEN_KEY = 'sweetmatch_token';
const AUTH_TYPE_KEY = 'sweetmatch_auth_type';

/**
 * Maneja la autenticación con Google
 * @param {Object} credentialResponse - Respuesta de Google OAuth
 * @returns {Object} - Objeto con información del usuario y resultado de la operación
 */
export const handleGoogleLogin = (credentialResponse) => {
  try {
    const credential = credentialResponse.credential;
    const decoded = jwtDecode(credential);
    
    // Extraer información relevante del usuario
    const userData = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      firstName: decoded.given_name,
      lastName: decoded.family_name,
      picture: decoded.picture,
      emailVerified: decoded.email_verified,
      // Información adicional que podríamos necesitar
      locale: decoded.locale,
      provider: 'google',
      // Datos para autenticación
      authDetails: {
        clientId: googleAuthConfig.clientId,
        scope: googleAuthConfig.scopes.join(' '),
        expiresAt: decoded.exp * 1000, // Convertir a milisegundos
        issuedAt: decoded.iat * 1000  // Convertir a milisegundos
      }
    };
    
    // Guardar datos en localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, credential);
    localStorage.setItem(AUTH_TYPE_KEY, 'google');
    
    console.log('Google login exitoso:', userData);
    
    // En un caso real, aquí enviaríamos el token al backend para validación
    // y obtendríamos un token JWT propio de nuestra aplicación
    
    return {
      success: true,
      user: userData,
      message: `¡Bienvenido ${userData.name}!`
    };
  } catch (error) {
    console.error('Error en el inicio de sesión con Google:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error al iniciar sesión con Google'
    };
  }
};

/**
 * Maneja el login tradicional con email/usuario y contraseña
 * @param {Object} credentials - Credenciales del usuario (email/nombre y contraseña)
 * @returns {Promise<Object>} - Promesa que resuelve al objeto con información del resultado
 */
export const handleTraditionalLogin = async (credentials) => {
  try {
    // Aquí iría la llamada a tu API para validar las credenciales
    // Por ahora es una simulación
    
    // Simulación de respuesta exitosa
    const mockResponse = {
      id: 'user123',
      name: credentials.nombre,
      email: `${credentials.nombre}@example.com`,
      // Otros datos del usuario que vendría de tu backend
    };
    
    // Simulación de token JWT (en producción, vendría de tu backend)
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6InVzZXIiLCJpYXQiOjE2Mjk4MTQ3MjB9';
    
    // Guardar datos en localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(mockResponse));
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(AUTH_TYPE_KEY, 'traditional');
    
    console.log('Login tradicional exitoso:', mockResponse);
    
    return {
      success: true,
      user: mockResponse,
      message: `¡Bienvenido ${mockResponse.name}!`
    };
  } catch (error) {
    console.error('Error en el inicio de sesión tradicional:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error al iniciar sesión'
    };
  }
};

/**
 * Verifica si hay una sesión activa
 * @returns {Object|null} - Información del usuario o null si no hay sesión
 */
export const getActiveSession = () => {
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error al obtener la sesión activa:', error);
    return null;
  }
};

/**
 * Cierra la sesión del usuario
 * @returns {Object} - Resultado de la operación
 */
export const logout = () => {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_TYPE_KEY);
    
    console.log('Cierre de sesión exitoso');
    
    return {
      success: true,
      message: 'Has cerrado sesión exitosamente'
    };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error al cerrar sesión'
    };
  }
};

/**
 * Obtiene el token de autenticación
 * @returns {string|null} - Token de autenticación o null si no existe
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Obtiene el tipo de autenticación
 * @returns {string|null} - 'google', 'traditional' o null si no hay sesión
 */
export const getAuthType = () => {
  return localStorage.getItem(AUTH_TYPE_KEY);
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si el usuario está autenticado, false en caso contrario
 */
export const isAuthenticated = () => {
  const session = getActiveSession();
  if (!session) return false;
  
  // Si es un inicio de sesión con Google, verificamos la expiración del token
  if (getAuthType() === 'google' && session.authDetails) {
    const currentTime = new Date().getTime();
    if (currentTime > session.authDetails.expiresAt) {
      // Token expirado, cerrar sesión
      logout();
      return false;
    }
  }
  
  return true;
};

/**
 * Verifica la validez del token actual
 * @returns {Object} - Información sobre la validez del token
 */
export const validateToken = () => {
  const session = getActiveSession();
  const token = getAuthToken();
  const authType = getAuthType();
  
  if (!session || !token || !authType) {
    return { valid: false, message: 'No hay sesión activa' };
  }
  
  // Si es un token de Google, verificamos su expiración
  if (authType === 'google' && session.authDetails) {
    const currentTime = new Date().getTime();
    const expiresAt = session.authDetails.expiresAt;
    
    if (currentTime > expiresAt) {
      return { 
        valid: false, 
        expired: true,
        message: 'El token ha expirado', 
        expiresAt: new Date(expiresAt).toLocaleString() 
      };
    }
    
    // Calcular tiempo restante
    const timeRemaining = expiresAt - currentTime;
    const minutesRemaining = Math.floor(timeRemaining / 60000);
    
    return {
      valid: true,
      message: 'Token válido',
      expiresIn: minutesRemaining,
      expiresAt: new Date(expiresAt).toLocaleString()
    };
  }
  
  // Para el inicio de sesión tradicional (asumimos que está siempre válido)
  return { valid: true, message: 'Token válido (sesión tradicional)' };
};
