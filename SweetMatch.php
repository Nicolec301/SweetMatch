<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="SweetMatch - Encuentra tu pareja ideal">
    <title>SweetMatch - Conecta con tu Match Ideal</title>
    <link rel="stylesheet" href="styles/styles.css">
    <link rel="stylesheet" href="styles/components/header.css">
    <link rel="stylesheet" href="styles/components/footer.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <!-- Preload critical assets -->
    <link rel="preload" href="images/logo.svg" as="image">
</head>

<body>

    <!-- Header -->
    <!-- Header común para todas las páginas SweetMatch -->
    <header>
        <div class="logo">
            <img src="images/logo.svg" alt="SweetMatch Logo">
        </div>
        <nav aria-label="Navegación principal">
            <ul>
                <li><a href="SweetMatch.php" class="focus-visible">INICIO</a></li>
                <li><a href="SweetMatch.php#como-funciona" class="focus-visible">¿CÓMO FUNCIONA?</a></li>
                <li><a href="SweetMatch.php#experiencias" class="focus-visible">HISTORIAS</a></li>
                <li><a href="SweetMatch.php#por-que-elegirnos" class="focus-visible">ACERCA DE</a></li>
                <li><a href="SweetMatch.php#contacto" class="focus-visible">CONTACTO</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section id="inicio" class="hero" role="region" aria-labelledby="hero-title">
        <div class="hero-content glass">
            <h1 id="hero-title">Conecta con Tu Match Ideal</h1>
            <p>En SweetMatch, creemos en el poder del amor verdadero.<br>
                Descubre conexiones auténticas y construye una historia
                de amor que perdurará para siempre.</p>
            <div class="cta-buttons">
                <a href="modules/login/login.php" class="btn-primary focus-visible" aria-label="Encuentra el amor">
                    ❤️ Encuentra el amor
                </a>
                <button type="button" class="btn-secondary focus-visible" aria-label="Conócenos más">ℹ️ Conócenos
                    más</button>
            </div>
        </div>
        <div class="hero-images">
            <div class="slider" aria-label="Galería de imágenes" aria-live="polite">
                <img src="images/I_Foto0.jpg" alt="Pareja feliz en una cita romántica" loading="lazy">
                <img src="images/I_Foto1.jpg" alt="Disfrutando juntos en el parque" loading="lazy">
                <img src="images/I_Foto2.jpg" alt="Sonrisas bajo el sol en la playa" loading="lazy">
                <img src="images/I_Foto3.jpg" alt="Celebrando su aniversario con alegría" loading="lazy">
                <img src="images/I_Foto4.jpg" alt="Puesta de sol en una cita especial" loading="lazy">
            </div>
        </div>
    </section>


    <!-- Perfiles Destacados -->
    <section id="perfiles" class="section-light glassmorphism slide-up">
        <div class="section-header">
            <div class="section-title">
                <h2 class="gradient-text">Perfiles destacados</h2>
                <p>Explora perfiles destacados que comparten tus intereses y valores. ¿Quién sabe? Tu
                    próxima cita podría estar a solo un clic.</p>
            </div>
        </div>

        <!-- Loading indicator (oculto por defecto) -->
        <div class="loading" style="display: none;" aria-hidden="true"></div>

        <div class="profiles-container" aria-label="Perfiles destacados">
            <div class="profile-card" tabindex="0">
                <div class="profile-image-wrapper">
                    <img src="images/andres.png" alt="" aria-hidden="true">
                </div>
                <div class="profile-info">
                    <h3>ANDRÉS, 28 AÑOS</h3>
                    <p>Apasionado de la fotografía y los viajes.</p>
                </div>
                <span class="sr-only">Andrés, 28 años, apasionado de la fotografía y los viajes.</span>
            </div>

            <div class="profile-card" tabindex="0">
                <div class="profile-image-wrapper">
                    <img src="images/Sofia.png" alt="" aria-hidden="true">
                </div>
                <div class="profile-info">
                    <h3>SOFÍA, 27 AÑOS</h3>
                    <p>Apasionada por la ciencia y el arte.</p>
                </div>
                <span class="sr-only">Sofía, 27 años, apasionada por la ciencia y el arte.</span>
            </div>

            <div class="profile-card" tabindex="0">
                <div class="profile-image-wrapper">
                    <img src="images/tomas.png" alt="" aria-hidden="true">
                </div>
                <div class="profile-info">
                    <h3>TOMÁS, 32 AÑOS</h3>
                    <p>Apasionado de la tecnología y el cine.</p>
                </div>
                <span class="sr-only">Tomás, 32 años, apasionado de la tecnología y el cine.</span>
            </div>

            <div class="profile-card" tabindex="0">
                <div class="profile-image-wrapper">
                    <img src="images/laura.png" alt="" aria-hidden="true">
                </div>
                <div class="profile-info">
                    <h3>LAURA, 29 AÑOS</h3>
                    <p>Le apasiona el baile y la gastronomía.</p>
                </div>
                <span class="sr-only">Laura, 29 años, le apasiona el baile y la gastronomía.</span>
            </div>
        </div>
    </section>

    <!-- Testimonios/Experiencias -->
    <section id="experiencias" class="section-light glassmorphism slide-up">
        <div class="section-header">
            <div class="section-title">
                <h2>Experiencias</h2>
                <p>Aprende de sus experiencias y atrévete a ser parte de esta historia. ¡Destácate y
                    aumenta tus posibilidades de encontrar a tu persona especial!</p>
            </div>
        </div>
        <div class="section-subtitle">
            <h2>¿Quieres compartir tu historia?</h2>
            <p>Contáctanos y permítenos ser parte de tu camino hacia el amor verdadero. ¡Estamos
                aquí para ayudarte!</p>
        </div>
        <div class="testimonials" aria-label="Testimonios de usuarios">
            <div class="testimonial">
                <img src="images/JessicaMark.png" alt="Jessica y Mark" class="testimonial-image">
                <div class="testimonial-content">
                    <p>"Gracias a SweetMatch, conocí a mi mejor amigo y compañero de vida. Realmente se preocupan por
                        ayudar a las personas a encontrar el amor. ¡Si estás aquí, estás en el lugar correcto!"</p>
                    <h4>— Jessica & Mark</h4>
                </div>
                <img src="images/Escribir.png" alt="" class="heart-icon" aria-hidden="true">
            </div>
            <div class="testimonial">
                <img src="images/CarlosAna.png" alt="Carlos y Ana" class="testimonial-image">
                <div class="testimonial-content">
                    <p>"Encontré a alguien que realmente entiende y comparte mis sueños. SweetMatch me ayudó a dar el
                        primer paso."</p>
                    <h4>— Carlos & Ana</h4>
                </div>
                <img src="images/Escribir.png" alt="" class="heart-icon" aria-hidden="true">
            </div>
        </div>
    </section>

    <!-- Por qué elegir SweetMatch -->
    <section id="por-que-elegirnos" class="section-light glassmorphism slide-up">
        <div class="section-header">
            <div class="section-title">
                <h2>¿Por qué elegir SweetMatch?</h2>
            </div>
        </div>
        <div class="feature-container" aria-label="Características destacadas">
            <div class="feature-card">
                <div class="feature-icon" aria-hidden="true">✓</div>
                <h3>Perfiles Verificados</h3>
                <p>Garantizamos que nuestros usuarios son reales, brindando seguridad y confianza en cada conexión.</p>
            </div>
            <div class="feature-card neomorphic">
                <div class="feature-icon" aria-hidden="true">🔒</div>
                <h3>Comunicación Segura</h3>
                <p>Chatea de forma segura y privada con otros miembros de la comunidad.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon" aria-hidden="true">👥</div>
                <h3>Soporte Personalizado</h3>
                <p>Nuestro equipo de soporte está disponible para ayudarte en cada paso del camino.</p>
            </div>
        </div>
    </section>

    <!-- Cómo Funciona -->
    <section id="como-funciona" class="section-light glassmorphism slide-up">
        <div class="section-header">
            <div class="section-title">
                <h2>¿Cómo Funciona?</h2>
            </div>
        </div>
        <div class="steps-container" aria-label="Proceso en tres pasos">
            <div class="step-card">
                <div class="step-number" aria-hidden="true">1</div>
                <h3>CREA UN PERFIL</h3>
                <p>Crea tu propio perfil para empezar a conectar con personas afines.</p>
                <a href="modules/login/login.php" class="cta-link focus-visible"
                    aria-label="Empezar a crear tu perfil">EMPEZAR</a>
            </div>
            <div class="step-card">
                <div class="step-number" aria-hidden="true">2</div>
                <h3>ENCUENTRA MATCHES</h3>
                <p>Explora y encuentra personas compatibles con tus intereses y estilo de vida.</p>
            </div>
            <div class="step-card">
                <div class="step-number" aria-hidden="true">3</div>
                <h3>EMPIEZA A SALIR</h3>
                <p>Conversa, conoce y vive nuevas experiencias junto a tus matches.</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer id="contacto">
        <div class="footer-container">
            <div class="footer-col">
                <img src="images/logo.svg" alt="SweetMatch Logo" class="footer-logo">
                <p>Descubre a personas increíbles, crea conexiones auténticas y haz match con quien comparte tu vibra.
                </p>
            </div>
            <div class="footer-col">
                <h3>SÍGUENOS EN</h3>
                <div class="social-links">
                    <a href="#" title="Facebook"><img src="images/facebook.svg" alt="Facebook"></a>
                    <a href="#" title="Instagram"><img src="images/instagram.svg" alt="Instagram"></a>
                    <a href="#" title="Twitter"><img src="images/twitter.svg" alt="Twitter"></a>
                    <a href="#" title="LinkedIn"><img src="images/linkedin.svg" alt="LinkedIn"></a>
                    <a href="#" title="YouTube"><img src="images/youtube.svg" alt="YouTube"></a>
                </div>
            </div>
            <div class="footer-col">
                <h3>INFORMACIÓN</h3>
                <div class="subscribe-form">
                    <input type="email" placeholder="Introduce tu Email">
                    <button>→</button>
                </div>
            </div>
        </div>
        <div class="copyright">
            <p>&copy;2025 SweetMatch. Todos los derechos reservados.</p>
        </div>
    </footer>

</body>

</html>