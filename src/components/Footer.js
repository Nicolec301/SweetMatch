import React from 'react';
import logo from '../images/logo.svg';
import facebook from '../images/facebook.svg';
import instagram from '../images/instagram.svg';
import twitter from '../images/twitter.svg';
import linkedin from '../images/linkedin.svg';
import youtube from '../images/youtube.svg';
import '../styles/components/footer.css';

const Footer = () => {
  return (
    <footer id="contacto">
      <div className="footer-container">
        <div className="footer-col">
          <img src={logo} alt="SweetMatch Logo" className="footer-logo" />
          <p>Descubre a personas increíbles, crea conexiones auténticas y haz match con quien comparte tu vibra.</p>
        </div>
        <div className="footer-col">
          <h3>SÍGUENOS EN</h3>
          <div className="social-links">
            <a href="/#" title="Facebook"><img src={facebook} alt="Facebook" /></a>
            <a href="/#" title="Instagram"><img src={instagram} alt="Instagram" /></a>
            <a href="/#" title="Twitter"><img src={twitter} alt="Twitter" /></a>
            <a href="/#" title="LinkedIn"><img src={linkedin} alt="LinkedIn" /></a>
            <a href="/#" title="YouTube"><img src={youtube} alt="YouTube" /></a>
          </div>
        </div>
        <div className="footer-col">
          <h3>INFORMACIÓN</h3>
          <div className="subscribe-form">
            <input type="email" placeholder="Introduce tu Email" />
            <button>→</button>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>&copy;2025 SweetMatch. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
