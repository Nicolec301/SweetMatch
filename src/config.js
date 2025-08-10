// Configuración del Frontend
const config = {
  // Configuración de Google OAuth
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
  },
  
  // URL de la API backend
  api: {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  socketUrl: process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/api$/, '') : 'http://localhost:3001')
  }
};

export const GOOGLE_CLIENT_ID = config.google.clientId;
export const API_BASE_URL = config.api.baseUrl;
export const SOCKET_BASE_URL = config.api.socketUrl;

export default config;
