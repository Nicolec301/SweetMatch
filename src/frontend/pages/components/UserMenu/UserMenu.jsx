import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SessionManager from '../../../../backend/services/SessionManager';
import { logout } from '../../../../backend/services/sessionUtils';
import './UserMenu.css';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Obtener información del usuario
    const sessionManager = SessionManager.getInstance();
    const info = sessionManager.getUserInfo();
    setUserInfo(info);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  // Si no hay usuario autenticado, no mostrar nada
  if (!userInfo || !userInfo.isAuthenticated) {
    return null;
  }

  const { user } = userInfo;
  const sessionManager = SessionManager.getInstance();

  return (
    <div className="user-menu">
      <div className="user-avatar" onClick={toggleMenu}>
        <div className="user-status"></div>
        {user.foto ? (
          <img src={user.foto} alt="Usuario" className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">
            {sessionManager.getInitials()}
          </div>
        )}
        <span className="user-name">Usuario</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="user-dropdown">
          <div className="user-info">
            <div className="user-avatar-large">
              {user.foto ? (
                <img src={user.foto} alt="Usuario" className="avatar-image-large" />
              ) : (
                <div className="avatar-placeholder-large">
                  {sessionManager.getInitials()}
                </div>
              )}
            </div>
            <div className="user-details">
              <h3>{user.nombre}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="menu-divider"></div>

          <div className="menu-items">
            <Link 
              to="/perfil" 
              className="menu-item"
              onClick={handleMenuItemClick}
            >
              <span className="menu-icon">👤</span>
              <span>Mi Perfil</span>
            </Link>

            <Link 
              to="/matches" 
              className="menu-item"
              onClick={handleMenuItemClick}
            >
              <span className="menu-icon">💕</span>
              <span>Mis Matches</span>
              <span className="badge">2 nuevos</span>
            </Link>

            <Link 
              to="/messages" 
              className="menu-item"
              onClick={handleMenuItemClick}
            >
              <span className="menu-icon">💬</span>
              <span>Mensajes</span>
              <span className="badge">3</span>
            </Link>

            <div className="menu-divider"></div>

            <button 
              className="menu-item logout-item"
              onClick={handleLogout}
            >
              <span className="menu-icon">🔐</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el menú al hacer click fuera */}
      {isOpen && (
        <div 
          className="menu-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default UserMenu;
