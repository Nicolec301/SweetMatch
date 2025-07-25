import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';
import '../styles/components/header.css';

const Header = () => {
  return (
    <header>
      <div className="logo">
        <img src={logo} alt="SweetMatch Logo" />
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
    </header>
  );
};

export default Header;
