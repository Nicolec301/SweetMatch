// Archivo principal de configuración
// Versión que utiliza exclusivamente variables de entorno de .env

// En desarrollo, mostramos información de depuración
if (process.env.NODE_ENV !== 'production') {
  console.log('Variables de entorno cargadas en config:', {
    GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID ? 'Configurado' : 'No configurado',
    REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI ? 'Configurado' : 'No configurado'
  });
}

// Configuración unificada basada exclusivamente en variables de entorno
const config = {
  google: {
    // Usa solo la variable de entorno sin respaldo hardcodeado
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    
    // Usa solo la variable de entorno sin respaldo hardcodeado
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    
    // Scopes estándar para autenticación con Google
    scopes: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ]
  }
};

// Exportar constantes individuales para facilitar su uso
export const GOOGLE_CLIENT_ID = config.google.clientId;
export const GOOGLE_REDIRECT_URI = config.google.redirectUri;
export const GOOGLE_AUTH_SCOPES = config.google.scopes;

// Exportar configuración completa
export default config;
