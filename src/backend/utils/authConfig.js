// Configuración para la autenticación de Google OAuth

// Importamos la configuración desde nuestro sistema centralizado
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_AUTH_SCOPES } from '../../config';

// Exportamos las constantes para uso directo
export { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_AUTH_SCOPES };

// Configuración para la autenticación con Google
export const googleAuthConfig = {
  clientId: GOOGLE_CLIENT_ID,
  redirectUri: GOOGLE_REDIRECT_URI,
  scopes: GOOGLE_AUTH_SCOPES
};

// Exportamos la configuración completa
const config = {
  google: googleAuthConfig
};

export default config;
