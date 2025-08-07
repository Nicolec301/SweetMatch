import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/logo.svg';
import { isAuthenticated, getActiveSession, logout } from '../../../services/sessionUtils';
import '../../styles/components/header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (isAuthenticated()) {
      setUser(getActiveSession());
    }
  }, []);

  // NOTA: Header ahora se muestra en todas las páginas incluyendo login y register
  // const noHeaderPages = ['/login', '/register'];
  // if (noHeaderPages.includes(location.pathname)) {
  //   return null;
  // }
  
  const handleLogout = () => {
    const result = logout();
    if (result.success) {
      setUser(null);
      alert('Has cerrado sesión correctamente.');
      navigate('/');
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
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
            {user && (
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
            {!user && (
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

        {/* User Menu */}
        <div className="user-section">
          {user ? (
            <div className="user-menu">
              <button 
                className="user-profile-btn"
                onClick={toggleUserMenu}
                aria-label="Abrir menú de usuario"
              >
                <div className="user-avatar-container">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="user-avatar" />
                  ) : (
                    <div className="default-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="online-indicator"></div>
                </div>
                <span className="user-name">{user.name || 'Usuario'}</span>
                <svg className={`dropdown-arrow ${isUserMenuOpen ? 'rotated' : ''}`} width="12" height="12" viewBox="0 0 12 12">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className={`user-dropdown ${isUserMenuOpen ? 'dropdown-open' : ''}`}>
                <div className="dropdown-header">
                  <div className="user-info-card">
                    <div className="user-avatar-large">
                      {user.picture ? (
                        <img src={user.picture} alt={user.name} />
                      ) : (
                        <div className="default-avatar-large">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="user-details">
                      <h4>{user.name || 'Usuario'}</h4>
                      <p>{user.email || 'usuario@email.com'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-menu">
                  <Link to="/perfil" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <span className="item-icon">👤</span>
                    <span className="item-text">Mi Perfil</span>
                  </Link>
                  
                  <Link to="/busqueda" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <span className="item-icon">💖</span>
                    <span className="item-text">Mis Matches</span>
                    <span className="item-badge">2 nuevos</span>
                  </Link>
                  
                  <Link to="/chat" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <span className="item-icon">💬</span>
                    <span className="item-text">Mensajes</span>
                    <span className="item-badge">3</span>
                  </Link>

                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="item-icon">🚪</span>
                    <span className="item-text">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
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
