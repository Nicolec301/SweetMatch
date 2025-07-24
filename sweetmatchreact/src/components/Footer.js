import React from 'react';

const Footer = () => {
  return (
    <footer id="contacto">
      <div className="footer-container">
        <div className="footer-col">
          <img src="/images/logo.svg" alt="SweetMatch Logo" className="footer-logo" />
          <p>Descubre a personas increíbles, crea conexiones auténticas y haz match con quien comparte tu vibra.</p>
        </div>
        <div className="footer-col">
          <h3>SÍGUENOS EN</h3>
          <div className="social-links">
            <a href="#" title="Facebook"><img src="/images/facebook.svg" alt="Facebook" /></a>
            <a href="#" title="Instagram"><img src="/images/instagram.svg" alt="Instagram" /></a>
            <a href="#" title="Twitter"><img src="/images/twitter.svg" alt="Twitter" /></a>
            <a href="#" title="LinkedIn"><img src="/images/linkedin.svg" alt="LinkedIn" /></a>
            <a href="#" title="YouTube"><img src="/images/youtube.svg" alt="YouTube" /></a>
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
