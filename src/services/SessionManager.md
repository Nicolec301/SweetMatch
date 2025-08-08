# SessionManager - Patrón Singleton para SweetMatch

El `SessionManager` es un servicio singleton que gestiona el estado de autenticación y los datos del usuario en toda la aplicación SweetMatch.

## 🎯 Características

- ✅ **Patrón Singleton**: Una sola instancia en toda la aplicación
- ✅ **Persistencia**: Guarda automáticamente en localStorage
- ✅ **Tipo-seguro**: Métodos específicos para diferentes tipos de datos
- ✅ **Reactivo**: Funciona perfectamente con React hooks
- ✅ **Debugging**: Herramientas de debug integradas

## 🚀 Uso Básico

### Importar y obtener instancia

```javascript
import SessionManager from '../services/SessionManager';

// Obtener la instancia singleton
const sessionManager = SessionManager.getInstance();
```

### Verificar autenticación

```javascript
if (sessionManager.isAuthenticated()) {
  // Usuario está autenticado
  console.log('Usuario logueado');
} else {
  // Usuario no autenticado
  console.log('Usuario no logueado');
}
```

### Obtener datos del usuario

```javascript
// Información completa para UI
const userInfo = sessionManager.getUserInfo();
// Retorna: { isAuthenticated: boolean, user: {...} }

// Datos específicos
const currentUser = sessionManager.getCurrentUser();
const userName = sessionManager.getUserName();
const userEmail = sessionManager.getUserEmail();
const userId = sessionManager.getUserId();
const initials = sessionManager.getInitials();
```

## 🔐 Gestión de Sesiones

### Iniciar sesión

```javascript
const userData = {
  id: 1,
  nombre: 'Juan Pérez',
  email: 'juan@email.com',
  edad: 25,
  // ... otros campos
};

const result = sessionManager.login(userData, 'optional-token');
console.log(result.message); // "¡Bienvenido Juan Pérez!"
```

### Cerrar sesión

```javascript
const result = sessionManager.logout();
console.log(result.message); // "¡Hasta luego!"
```

### Actualizar datos del usuario

```javascript
const result = sessionManager.updateUser({
  nombre: 'Nuevo Nombre',
  descripcion: 'Nueva descripción'
});

if (result.success) {
  console.log('Usuario actualizado');
}
```

## 🧩 Integración con React

### En componentes funcionales

```jsx
import React, { useState, useEffect } from 'react';
import SessionManager from '../services/SessionManager';

const MyComponent = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const sessionManager = SessionManager.getInstance();
    const info = sessionManager.getUserInfo();
    setUserInfo(info);
  }, []);

  return (
    <div>
      {userInfo && userInfo.isAuthenticated ? (
        <h1>Hola {userInfo.user.nombre}!</h1>
      ) : (
        <p>Por favor inicia sesión</p>
      )}
    </div>
  );
};
```

### En el Header/Navigation

```jsx
import SessionManager from '../services/SessionManager';
import UserMenu from './UserMenu';

const Header = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const sessionManager = SessionManager.getInstance();
    setUserInfo(sessionManager.getUserInfo());
  }, []);

  return (
    <header>
      {userInfo && userInfo.isAuthenticated ? (
        <UserMenu />
      ) : (
        <LoginButton />
      )}
    </header>
  );
};
```

## 🔧 API Completa

### Métodos de Autenticación

| Método | Descripción | Retorno |
|--------|-------------|---------|
| `isAuthenticated()` | Verifica si hay sesión activa | `boolean` |
| `login(userData, token)` | Inicia sesión con datos del usuario | `{success, message}` |
| `logout()` | Cierra la sesión actual | `{success, message}` |
| `clearSession()` | Limpia sesión (para errores) | `void` |

### Métodos de Datos

| Método | Descripción | Retorno |
|--------|-------------|---------|
| `getCurrentUser()` | Obtiene datos completos del usuario | `Object \| null` |
| `getUserName()` | Obtiene nombre del usuario | `string \| null` |
| `getUserEmail()` | Obtiene email del usuario | `string \| null` |
| `getUserId()` | Obtiene ID del usuario | `number \| null` |
| `getInitials()` | Obtiene iniciales del nombre | `string` |
| `getUserInfo()` | Información lista para UI | `{isAuthenticated, user}` |

### Métodos de Utilidad

| Método | Descripción | Retorno |
|--------|-------------|---------|
| `updateUser(userData)` | Actualiza datos del usuario | `{success, message}` |
| `getToken()` | Obtiene token de autenticación | `string \| null` |
| `isTokenValid()` | Verifica validez del token | `boolean` |
| `debugSession()` | Muestra estado actual en consola | `void` |

## 💡 Ejemplos Prácticos

### Mostrar nombre en bienvenida

```jsx
const Welcome = () => {
  const sessionManager = SessionManager.getInstance();
  const userName = sessionManager.getUserName();

  return userName ? (
    <h1>¡Hola {userName}! 👋</h1>
  ) : (
    <h1>¡Bienvenido a SweetMatch!</h1>
  );
};
```

### Avatar con iniciales

```jsx
const Avatar = () => {
  const sessionManager = SessionManager.getInstance();
  const user = sessionManager.getCurrentUser();

  if (!user) return null;

  return (
    <div className="avatar">
      {user.foto ? (
        <img src={user.foto} alt={user.nombre} />
      ) : (
        <div className="avatar-placeholder">
          {sessionManager.getInitials()}
        </div>
      )}
    </div>
  );
};
```

### Protección de rutas

```jsx
import { Navigate } from 'react-router-dom';
import SessionManager from '../services/SessionManager';

const ProtectedRoute = ({ children }) => {
  const sessionManager = SessionManager.getInstance();
  
  return sessionManager.isAuthenticated() ? 
    children : 
    <Navigate to="/login" />;
};
```

## 🐛 Debugging

```javascript
// Mostrar estado completo de la sesión
sessionManager.debugSession();

// Verificar en consola del navegador
console.log('Usuario actual:', sessionManager.getCurrentUser());
console.log('Está autenticado:', sessionManager.isAuthenticated());
```

## 📝 Notas Importantes

1. **Singleton**: Siempre usa `getInstance()` para obtener la instancia
2. **Persistencia**: Los datos se guardan automáticamente en localStorage
3. **Reactividad**: Re-renderiza los componentes cuando cambian los datos
4. **Limpieza**: La sesión se limpia automáticamente en caso de errores
5. **Seguridad**: Los tokens se manejan de forma segura

## 🔄 Integración con sessionUtils.js

El SessionManager trabaja junto con `sessionUtils.js` que maneja la comunicación con el backend:

```javascript
import { handleTraditionalLogin } from '../services/sessionUtils';

// sessionUtils usa SessionManager internamente
const result = await handleTraditionalLogin(formData);
if (result.success) {
  // SessionManager ya tiene la sesión iniciada
  const userName = SessionManager.getInstance().getUserName();
}
```
