<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión - SweetMatch</title>
    <link rel="stylesheet" href="../../styles/styles.css">
    <link rel="stylesheet" href="../login/styles/formulario.css">
</head>
<body>
    <!-- Header -->
    <header>
        <div class="logo">
            <img src="../../images/logo.svg" alt="SweetMatch Logo">
        </div>
        <nav>
            <ul>
                <li><a href="../../SweetMatch.php">INICIO</a></li>
                <li><a href="../../SweetMatch.php#como-funciona">¿CÓMO FUNCIONA?</a></li>
                <li><a href="../../SweetMatch.php#experiencias">HISTORIAS</a></li>
                <li><a href="../../SweetMatch.php#contacto">CONTACTO</a></li>
            </ul>
        </nav>
    </header>

    <!-- Formulario de Login -->
    <div class="form-container">
        <div class="form-header">
            <img src="../../images/GifCora.webp" alt="Corazón" class="heart-icon">
            <h1>Iniciar Sesión en <span>SweetMatch</span></h1>
            <p>¡Bienvenido de nuevo al amor!</p>
        </div>
        <!-- Agregar después del form-header -->
        <?php if(isset($_GET['error'])): ?>
            <div class="alert alert-error">
                <?php 
                    switch($_GET['error']) {

                        case 'invalid':
                            echo 'Usuario o contraseña incorrectos';
                            break;
                    }
                ?>
            </div>
        <?php endif; ?>

        <form action="../../php/validacion_login.php" method="POST" class="sweet-form">
            <div class="form-section">
                <h2>Datos de acceso</h2>
                <div class="input-group">
                    <label for="email">Email o nombre de usuario:</label>
                    <input type="text" id="email" name="nombre" required>
                </div>

                <div class="input-group">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" required>
                </div>

                <div class="input-group" style="text-align: right;">
                    <a href="#" style="color: var(--primary);">¿Olvidaste tu contraseña?</a>
                </div>

                <div class="submit-group">
                    <button type="submit" class="btn-primary">Iniciar Sesión</button>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <p>¿No tienes cuenta? <a href="../crearCuenta/CrearCuenta.html" style="color: var(--primary); font-weight: bold;">Regístrate aquí</a></p>
                </div>
            </div>
        </form>
    </div>

    <!-- Footer -->
    <footer id="contacto">
        <div class="footer-container">
            <div class="footer-col">
                <img src="../../images/logo.svg" alt="SweetMatch Logo" class="footer-logo">
                <p>Descubre a personas increíbles, crea conexiones auténticas y haz match con quien comparte tu vibra.</p>
            </div>
            <div class="footer-col">
                <h3>SÍGUENOS EN</h3>
                <div class="social-links">
                    <a href="#" title="Facebook"><img src="../../images/facebook.svg" alt="Facebook"></a>
                    <a href="#" title="Instagram"><img src="../../images/instagram.svg" alt="Instagram"></a>
                    <a href="#" title="Twitter"><img src="../../images/twitter.svg" alt="Twitter"></a>
                    <a href="#" title="LinkedIn"><img src="../../images/linkedin.svg" alt="LinkedIn"></a>
                    <a href="#" title="YouTube"><img src="../../images/youtube.svg" alt="YouTube"></a>
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