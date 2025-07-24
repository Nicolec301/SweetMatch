import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section id="inicio" className="hero" aria-labelledby="hero-title">
        <div className="hero-content glass">
          <h1 id="hero-title">Conecta con Tu Match Ideal</h1>
          <p>En SweetMatch, creemos en el poder del amor verdadero.<br />
            Descubre conexiones auténticas y construye una historia
            de amor que perdurará para siempre.</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn-primary focus-visible" aria-label="Encuentra el amor">
              ❤️ Encuentra el amor
            </Link>
            <button type="button" className="btn-secondary focus-visible" aria-label="Conócenos más">ℹ️ Conócenos más</button>
          </div>
        </div>
        <div className="hero-images">
          <div className="slider" aria-label="Galería de imágenes" aria-live="polite">
            <img src="/images/I_Foto0.jpg" alt="Pareja feliz en una cita romántica" loading="lazy" />
            <img src="/images/I_Foto1.jpg" alt="Disfrutando juntos en el parque" loading="lazy" />
            <img src="/images/I_Foto2.jpg" alt="Sonrisas bajo el sol en la playa" loading="lazy" />
            <img src="/images/I_Foto3.jpg" alt="Celebrando su aniversario con alegría" loading="lazy" />
            <img src="/images/I_Foto4.jpg" alt="Puesta de sol en una cita especial" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Perfiles Destacados */}
      <section id="perfiles" className="section-light glassmorphism slide-up">
        <div className="section-header">
          <div className="section-title">
            <h2 className="gradient-text">Perfiles destacados</h2>
            <p>Explora perfiles destacados que comparten tus intereses y valores. ¿Quién sabe? Tu próxima cita podría estar a solo un clic.</p>
          </div>
        </div>

        <div className="loading" style={{ display: 'none' }} aria-hidden="true"></div>

        <div className="profiles-container" aria-label="Perfiles destacados">
          <div className="profile-card" tabIndex="0">
            <div className="profile-image-wrapper">
              <img src="/images/andres.png" alt="" aria-hidden="true" />
            </div>
            <div className="profile-info">
              <h3>ANDRÉS, 28 AÑOS</h3>
              <p>Apasionado de la fotografía y los viajes.</p>
            </div>
            <span className="sr-only">Andrés, 28 años, apasionado de la fotografía y los viajes.</span>
          </div>

          <div className="profile-card" tabIndex="0">
            <div className="profile-image-wrapper">
              <img src="/images/Sofia.png" alt="" aria-hidden="true" />
            </div>
            <div className="profile-info">
              <h3>SOFÍA, 27 AÑOS</h3>
              <p>Apasionada por la ciencia y el arte.</p>
            </div>
            <span className="sr-only">Sofía, 27 años, apasionada por la ciencia y el arte.</span>
          </div>

          <div className="profile-card" tabIndex="0">
            <div className="profile-image-wrapper">
              <img src="/images/tomas.png" alt="" aria-hidden="true" />
            </div>
            <div className="profile-info">
              <h3>TOMÁS, 32 AÑOS</h3>
              <p>Apasionado de la tecnología y el cine.</p>
            </div>
            <span className="sr-only">Tomás, 32 años, apasionado de la tecnología y el cine.</span>
          </div>

          <div className="profile-card" tabIndex="0">
            <div className="profile-image-wrapper">
              <img src="/images/laura.png" alt="" aria-hidden="true" />
            </div>
            <div className="profile-info">
              <h3>LAURA, 29 AÑOS</h3>
              <p>Le apasiona el baile y la gastronomía.</p>
            </div>
            <span className="sr-only">Laura, 29 años, le apasiona el baile y la gastronomía.</span>
          </div>
        </div>
      </section>

      {/* Testimonios/Experiencias */}
      <section id="experiencias" className="section-light glassmorphism slide-up">
        <div className="section-header">
          <div className="section-title">
            <h2>Experiencias</h2>
            <p>Aprende de sus experiencias y atrévete a ser parte de esta historia. ¡Destácate y aumenta tus posibilidades de encontrar a tu persona especial!</p>
          </div>
        </div>
        <div className="section-subtitle">
          <h2>¿Quieres compartir tu historia?</h2>
          <p>Contáctanos y permítenos ser parte de tu camino hacia el amor verdadero. ¡Estamos aquí para ayudarte!</p>
        </div>
        <div className="testimonials" aria-label="Testimonios de usuarios">
          <div className="testimonial">
            <img src="/images/JessicaMark.png" alt="Jessica y Mark" className="testimonial-image" />
            <div className="testimonial-content">
              <p>"Gracias a SweetMatch, conocí a mi mejor amigo y compañero de vida. Realmente se preocupan por ayudar a las personas a encontrar el amor. ¡Si estás aquí, estás en el lugar correcto!"</p>
              <h4>— Jessica & Mark</h4>
            </div>
            <img src="/images/Escribir.png" alt="" className="heart-icon" aria-hidden="true" />
          </div>
          <div className="testimonial">
            <img src="/images/CarlosAna.png" alt="Carlos y Ana" className="testimonial-image" />
            <div className="testimonial-content">
              <p>"Encontré a alguien que realmente entiende y comparte mis sueños. SweetMatch me ayudó a dar el primer paso."</p>
              <h4>— Carlos & Ana</h4>
            </div>
            <img src="/images/Escribir.png" alt="" className="heart-icon" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Por qué elegir SweetMatch */}
      <section id="por-que-elegirnos" className="section-light glassmorphism slide-up">
        <div className="section-header">
          <div className="section-title">
            <h2>¿Por qué elegir SweetMatch?</h2>
          </div>
        </div>
        <div className="feature-container" aria-label="Características destacadas">
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">✓</div>
            <h3>Perfiles Verificados</h3>
            <p>Garantizamos que nuestros usuarios son reales, brindando seguridad y confianza en cada conexión.</p>
          </div>
          <div className="feature-card neomorphic">
            <div className="feature-icon" aria-hidden="true">🔒</div>
            <h3>Comunicación Segura</h3>
            <p>Chatea de forma segura y privada con otros miembros de la comunidad.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">👥</div>
            <h3>Soporte Personalizado</h3>
            <p>Nuestro equipo de soporte está disponible para ayudarte en cada paso del camino.</p>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section id="como-funciona" className="section-light glassmorphism slide-up">
        <div className="section-header">
          <div className="section-title">
            <h2>¿Cómo Funciona?</h2>
          </div>
        </div>
        <div className="steps-container" aria-label="Proceso en tres pasos">
          <div className="step-card">
            <div className="step-number" aria-hidden="true">1</div>
            <h3>CREA UN PERFIL</h3>
            <p>Crea tu propio perfil para empezar a conectar con personas afines.</p>
            <Link to="/login" className="cta-link focus-visible" aria-label="Empezar a crear tu perfil">EMPEZAR</Link>
          </div>
          <div className="step-card">
            <div className="step-number" aria-hidden="true">2</div>
            <h3>ENCUENTRA MATCHES</h3>
            <p>Explora y encuentra personas compatibles con tus intereses y estilo de vida.</p>
          </div>
          <div className="step-card">
            <div className="step-number" aria-hidden="true">3</div>
            <h3>EMPIEZA A SALIR</h3>
            <p>Conversa, conoce y vive nuevas experiencias junto a tus matches.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
