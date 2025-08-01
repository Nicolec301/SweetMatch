// Importamos directamente desde la configuración central
import { GOOGLE_CLIENT_ID } from '../../config';

/**
 * Inicializa la configuración de Google OAuth
 */
const initializeGoogleAuth = () => {
  // Verificar que tenemos un ID de cliente válido
  if (!GOOGLE_CLIENT_ID) {
    console.error('ERROR: No se ha configurado el ID de cliente de Google en las variables de entorno.');
    console.error('Por favor, asegúrate de que el archivo .env contiene REACT_APP_GOOGLE_CLIENT_ID.');
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
