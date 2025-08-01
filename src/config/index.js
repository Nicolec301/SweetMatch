// Archivo principal de configuración
// Versión simplificada que no depende de dotenv ni módulos de Node.js

// En desarrollo, mostramos información de depuración
if (process.env.NODE_ENV !== 'production') {
  console.log('Variables de entorno en config:', {
    GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '(no definido)',
    REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI || '(no definido)'
  });
}

// Valor hardcodeado de respaldo (solo para desarrollo)
const BACKUP_CLIENT_ID = '780446462718-jg6dloll2f832j07alrmue75b4dkipc9.apps.googleusercontent.com';

// Configuración unificada basada en variables de entorno
const config = {
  google: {
    // Usa la variable de entorno REACT_APP_GOOGLE_CLIENT_ID con respaldo explícito
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || BACKUP_CLIENT_ID,
    
    // Usa la variable de entorno REACT_APP_REDIRECT_URI con respaldo
    redirectUri: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000',
    
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
