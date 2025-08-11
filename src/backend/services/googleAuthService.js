// Configuración de Google Auth para el frontend
import { GOOGLE_CLIENT_ID } from '../../config';

/**
 * Inicializa la configuración de Google OAuth en el frontend
 */
const initializeGoogleAuth = () => {
  // Verificar que tenemos un ID de cliente válido
  if (!GOOGLE_CLIENT_ID) {
    console.error('ERROR: No se ha configurado el ID de cliente de Google.');
    return false;
  }

  // Configurar el script de Google
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);

  return true;
};

export default initializeGoogleAuth;
