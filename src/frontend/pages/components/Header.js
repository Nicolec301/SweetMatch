import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/logo.svg';
import SessionManager from '../../../services/SessionManager';
import UserMenu from './UserMenu/UserMenu';
import '../../styles/components/header.css';

const Header = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Usar SessionManager para obtener información del usuario
    const sessionManager = SessionManager.getInstance();
    const info = sessionManager.getUserInfo();
    setUserInfo(info);
  }, [location]); // Re-verificar cuando cambie la ubicación

  // NOTA: Header ahora se muestra en todas las páginas incluyendo login y register
  // const noHeaderPages = ['/login', '/register'];
  // if (noHeaderPages.includes(location.pathname)) {
  //   return null;
  // }

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="SweetMatch Logo" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`} aria-label="Navegación principal">
          <ul className="nav-list">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActivePage('/') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">INICIO</span>
              </Link>
            </li>
            {userInfo && userInfo.isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link 
                    to="/busqueda" 
                    className={`nav-link ${isActivePage('/busqueda') ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="nav-icon">🔍</span>
                    <span className="nav-text">BUSCAR</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/en-linea" 
                    className={`nav-link ${isActivePage('/en-linea') ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="nav-icon">🟢</span>
                    <span className="nav-text">EN LÍNEA</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/chat" 
                    className={`nav-link ${isActivePage('/chat') ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="nav-icon">💬</span>
                    <span className="nav-text">MENSAJES</span>
                    <span className="notification-badge">3</span>
                  </Link>
                </li>
              </>
            )}
            {(!userInfo || !userInfo.isAuthenticated) && (
              <>
                <li className="nav-item">
                  <a href="/#como-funciona" className="nav-link">
                    <span className="nav-text">¿CÓMO FUNCIONA?</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/#experiencias" className="nav-link">
                    <span className="nav-text">HISTORIAS</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/#por-que-elegirnos" className="nav-link">
                    <span className="nav-text">ACERCA DE</span>
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* User Section */}
        <div className="user-section">
          {userInfo && userInfo.isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="register-btn">
                Registrarse
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className={`mobile-menu-toggle ${isMenuOpen ? 'toggle-open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Abrir menú móvil"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </header>
  );
};

export default Header;
