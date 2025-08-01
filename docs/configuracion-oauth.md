# Configuración de Autenticación Google OAuth

## Introducción

Este documento explica cómo configurar la autenticación de Google OAuth en SweetMatch sin necesidad de incluir archivos de credenciales sensibles en el código fuente.

## Métodos de Configuración

### 1. Variables de Entorno (Recomendado)

Crea un archivo `.env` en la raíz del proyecto (no lo subas al repositorio):

```
REACT_APP_GOOGLE_CLIENT_ID=tu-client-id-de-google
REACT_APP_GOOGLE_REDIRECT_URI=http://localhost:3000
```

El sistema cargará automáticamente estas variables.

### 2. Archivos de Configuración por Entorno

Para desarrollo local, configura el archivo `src/config/development.js` con tus credenciales.

**Importante**: Asegúrate de que este archivo esté en `.gitignore` para no subirlo al repositorio.

### 3. Configuración Manual

Si no quieres usar ninguno de los métodos anteriores, puedes editar directamente `src/index.js` y configurar el `clientId` en el componente `GoogleOAuthProvider`.

## Obtención de Credenciales de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Ve a "APIs y servicios" > "Credenciales"
4. Crea una "ID de cliente de OAuth 2.0" para aplicación web
5. Configura los orígenes autorizados de JavaScript (URL de tu aplicación)
6. Configura las URIs de redirección autorizadas
7. Copia el ID de cliente generado

## Seguridad

- **NUNCA** subas archivos de credenciales a repositorios públicos
- Usa `.gitignore` para excluir archivos sensibles
- No hardcodees credenciales en el código fuente
- Considera usar un gestor de secretos para producción

## Configuración Actual

La aplicación está configurada para cargar credenciales desde:

1. Variables de entorno en `.env` (si existen)
2. Archivo de configuración de desarrollo (`src/config/development.js`)
