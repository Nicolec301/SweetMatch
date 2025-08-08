/**
 * Ejemplo de uso del SessionManager - Patrón Singleton
 * 
 * Este archivo muestra cómo usar el SessionManager desde cualquier componente
 * para acceder a la información del usuario autenticado.
 */

import React, { useState, useEffect } from 'react';
import SessionManager from '../services/SessionManager';

const ExampleComponent = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Obtener la instancia singleton del SessionManager
    const sessionManager = SessionManager.getInstance();
    
    // Obtener información completa del usuario
    const info = sessionManager.getUserInfo();
    setUserInfo(info);

    // También puedes obtener datos específicos:
    const userName = sessionManager.getUserName();
    const userEmail = sessionManager.getUserEmail();
    const userId = sessionManager.getUserId();
    
    console.log('Datos del usuario:', {
      nombre: userName,
      email: userEmail,
      id: userId
    });

  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    const sessionManager = SessionManager.getInstance();
    const result = sessionManager.logout();
    
    if (result.success) {
      setUserInfo(null);
      alert(result.message);
    }
  };

  // Función para actualizar datos del usuario
  const handleUpdateUser = (newData) => {
    const sessionManager = SessionManager.getInstance();
    const result = sessionManager.updateUser(newData);
    
    if (result.success) {
      // Actualizar el estado local
      setUserInfo(sessionManager.getUserInfo());
      alert(result.message);
    }
  };

  return (
    <div className="example-component">
      <h2>Ejemplo de SessionManager</h2>
      
      {userInfo && userInfo.isAuthenticated ? (
        <div className="user-section">
          <h3>Usuario Autenticado:</h3>
          <p><strong>Nombre:</strong> {userInfo.user.nombre}</p>
          <p><strong>Email:</strong> {userInfo.user.email}</p>
          <p><strong>Iniciales:</strong> {userInfo.user.iniciales}</p>
          
          <div className="actions">
            <button onClick={handleLogout}>
              Cerrar Sesión
            </button>
            
            <button onClick={() => handleUpdateUser({ nombre: 'Nuevo Nombre' })}>
              Actualizar Nombre (Ejemplo)
            </button>
          </div>
        </div>
      ) : (
        <div className="guest-section">
          <p>No hay usuario autenticado</p>
        </div>
      )}

      <div className="usage-examples">
        <h3>Ejemplos de uso:</h3>
        <pre>{`
// Obtener instancia
const sessionManager = SessionManager.getInstance();

// Verificar autenticación
if (sessionManager.isAuthenticated()) {
  // Usuario está autenticado
}

// Obtener datos del usuario
const user = sessionManager.getCurrentUser();
const userName = sessionManager.getUserName();
const userEmail = sessionManager.getUserEmail();

// Iniciar sesión
sessionManager.login(userData, token);

// Cerrar sesión
sessionManager.logout();

// Actualizar usuario
sessionManager.updateUser({ nombre: 'Nuevo nombre' });
        `}</pre>
      </div>
    </div>
  );
};

export default ExampleComponent;
