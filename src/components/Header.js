import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.svg';
import { isAuthenticated, getActiveSession, logout } from '../backend/utils/session';
import '../styles/components/header.css';
import '../styles/components/user-menu.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (isAuthenticated()) {
      setUser(getActiveSession());
    }
  }, []);
  
  const handleLogout = () => {
    const result = logout();
    if (result.success) {
      setUser(null);
      alert('Has cerrado sesión correctamente.');
      navigate('/');
    }
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="SweetMatch Logo" />
        </Link>
      </div>
      <nav aria-label="Navegación principal">
        <ul>
          <li><Link to="/" className="focus-visible">INICIO</Link></li>
          <li><a href="/#como-funciona" className="focus-visible">¿CÓMO FUNCIONA?</a></li>
          <li><a href="/#experiencias" className="focus-visible">HISTORIAS</a></li>
          <li><a href="/#por-que-elegirnos" className="focus-visible">ACERCA DE</a></li>
          <li><a href="/#contacto" className="focus-visible">CONTACTO</a></li>
        </ul>
      </nav>
      
      <div className="user-menu">
        {user ? (
          <div className="user-profile">
            <div className="user-info">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">{user.name.charAt(0)}</div>
              )}
              <span className="user-name">{user.name}</span>
            </div>
            <div className="user-dropdown">
              <ul>
                <li><Link to="/profile">Mi Perfil</Link></li>
                <li><Link to="/matches">Mis Matches</Link></li>
                <li><Link to="/messages">Mensajes</Link></li>
                <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-login">Iniciar Sesión</Link>
            <Link to="/register" className="btn-register">Registrarse</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
