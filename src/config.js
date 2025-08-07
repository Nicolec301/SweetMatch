// Configuración del Frontend
const config = {
  // Configuración de Google OAuth
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
  },
  
  // URL de la API backend
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
  }
};

export const GOOGLE_CLIENT_ID = config.google.clientId;
export const API_BASE_URL = config.api.baseUrl;

export default config;
