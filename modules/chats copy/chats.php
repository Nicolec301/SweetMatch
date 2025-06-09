<?php
// filepath: c:\xampp\htdocs\SweetMatchProto\modules\chats\chats.php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: ../login/login.html");
    exit();
}
$usuario = $_SESSION['usuario'];

// Incluir el archivo de conversaciones
require_once 'data/conversaciones.php';

// Obtener todas las conversaciones
$todas_conversaciones = obtener_todas_conversaciones();

// Verificar si se ha seleccionado una conversación específica
$conversacion_id = isset($_GET['id']) ? $_GET['id'] : 'sophia'; // Por defecto muestra la conversación con Sofía

// Obtener datos de la conversación seleccionada
$conversacion_actual = obtener_conversacion($conversacion_id);

// Si la conversación no existe, redirigir a la primera conversación
if ($conversacion_actual === null) {
    header('Location: chats.php?id=sophia');
    exit;
}

// Verificar si hay mensajes de confirmación o error
$mensaje_confirmacion = '';
$mensaje_error = '';
$clase_notificacion = '';

if (isset($_GET['success']) && $_GET['success'] === 'mensaje_enviado') {
    $mensaje_confirmacion = 'Mensaje enviado correctamente';
    $clase_notificacion = 'success';
} elseif (isset($_GET['error'])) {
    switch ($_GET['error']) {
        case 'mensaje_vacio':
            $mensaje_error = 'El mensaje no puede estar vacío';
            break;
        case 'error_guardado':
            $mensaje_error = 'Error al guardar el mensaje';
            break;
        default:
            $mensaje_error = 'Ha ocurrido un error al enviar el mensaje';
    }
    $clase_notificacion = 'error';
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="SweetMatch - Encuentra tu pareja ideal - Mensajes">
    <title>SweetMatch - Mensajes</title>
    <link rel="stylesheet" href="../../styles/styles.css">
    <link rel="stylesheet" href="../../styles/components/header.css">
    <link rel="stylesheet" href="../../styles/components/footer.css">
    <link rel="stylesheet" href="../En linea/styles/Linea.css">
    <link rel="stylesheet" href="styles/chat.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Preload critical assets -->
    <link rel="preload" href="../../images/logo.svg" as="image">
</head>

<body>
    <!-- Header común para todas las páginas SweetMatch -->
    <header class="logo">
        <div class="logo">
            <a href="../Perfil/perfil.php">
                <img src="../../images/logo.svg" alt="logo">
            </a>
        </div>
        <nav>
            <ul>
                <li><a href="../En linea/Linea.php">En línea</a></li>
                <li><a href="../Buscar/Busqueda.php">Buscar</a></li>
                <li><a href="../chats copy/chats.php">Mensajes</a></li>
            </ul>
        </nav>
        <div class="user-controls">
            <div class="user-profile">
                <a href="#" class="profile-pic">
                    <img src="../../uploads/<?php echo htmlspecialchars($usuario['foto']); ?>" alt="Foto de perfil">
                </a>
            </div>
            <div class="settings">
                <a href="#" id="settingsButton"><i class="fas fa-cog"></i></a>
                <div class="settings-menu" id="settingsMenu">
                    <a href="../../ayuda.php"><i class="fas fa-question-circle"></i>Ayuda</a>
                    <a href="../login/login.php"><i class="fas fa-sign-out-alt"></i>Salir</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="chat-container">
        <?php if (!empty($mensaje_confirmacion) || !empty($mensaje_error)): ?>
        <div class="notification <?php echo $clase_notificacion; ?>">
            <?php echo !empty($mensaje_confirmacion) ? htmlspecialchars($mensaje_confirmacion) : htmlspecialchars($mensaje_error); ?>
            <button class="close-notification">&times;</button>
        </div>
        <?php endif; ?>
        <section class="chat-interface glassmorphism">
            <!-- Chat List Sidebar -->
            <div class="chat-list">
                <h2>Mensajes</h2>
                <div class="search-bar">
                    <input type="text" placeholder="Buscar conversaciones...">
                    <button type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </button>
                </div>
                  <!-- Chat List Items -->
                <div class="conversation-list">
                    <?php foreach ($todas_conversaciones as $id => $conversacion): ?>
                    <div class="conversation-item <?php echo ($id === $conversacion_id) ? 'active' : ''; ?>" data-conversation="<?php echo htmlspecialchars($id); ?>">
                        <a href="chats.php?id=<?php echo htmlspecialchars($id); ?>" class="conversation-link">
                            <div class="conversation-avatar">
                                <img src="<?php echo htmlspecialchars($conversacion['imagen']); ?>" alt="Foto de <?php echo htmlspecialchars($conversacion['nombre']); ?>">
                            </div>
                            <div class="conversation-info">
                                <div class="conversation-name"><?php echo htmlspecialchars($conversacion['nombre']); ?></div>
                                <div class="conversation-preview"><?php echo htmlspecialchars($conversacion['vista_previa']); ?></div>
                            </div>
                            <div class="conversation-time"><?php echo htmlspecialchars($conversacion['tiempo_indicador']); ?></div>
                        </a>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Chat Content -->
            <div class="chat-content">                <div class="chat-header">
                    <div class="chat-contact">
                        <div class="contact-avatar">
                            <img src="<?php echo htmlspecialchars($conversacion_actual['imagen']); ?>" alt="Foto de <?php echo htmlspecialchars($conversacion_actual['nombre']); ?>">
                        </div>
                        <div class="contact-name"><?php echo htmlspecialchars($conversacion_actual['nombre']); ?></div>
                    </div>
                    <div class="chat-actions">
                        <button class="action-button" title="Videollamada">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z"/>
                            </svg>
                        </button>
                        <button class="action-button" title="Llamada">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                            </svg>
                        </button>
                        <button class="action-button" title="Más opciones">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                            </svg>
                        </button>
                    </div>
                </div>                <div class="messages-container">
                    <div class="message-date">
                        <span>Hoy</span>
                    </div>
                    
                    <?php foreach ($conversacion_actual['mensajes'] as $mensaje): ?>
                        <?php if ($mensaje['remitente']): ?>
                        <!-- Mensaje enviado por el usuario -->
                        <div class="message sent">
                            <div class="message-content">
                                <div class="message-bubble">
                                    <?php echo htmlspecialchars($mensaje['contenido']); ?>
                                </div>
                                <div class="message-time"><?php echo htmlspecialchars($mensaje['hora']); ?></div>
                                <div class="message-status">
                                    <?php if ($mensaje['leido']): ?>
                                    <img src="../../images/Visto.png" alt="Visto">
                                    <?php else: ?>
                                    <img src="../../images/Visto.png" alt="Enviado" style="opacity: 0.5;">
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                        <?php else: ?>
                        <!-- Mensaje recibido del contacto -->
                        <div class="message received">
                            <div class="message-avatar">
                                <img src="<?php echo htmlspecialchars($conversacion_actual['imagen']); ?>" alt="Foto de <?php echo htmlspecialchars($conversacion_actual['nombre']); ?>">
                            </div>
                            <div class="message-content">
                                <div class="message-sender"><?php echo htmlspecialchars($mensaje['emisor']); ?></div>
                                <div class="message-bubble">
                                    <?php echo htmlspecialchars($mensaje['contenido']); ?>
                                </div>
                                <div class="message-time"><?php echo htmlspecialchars($mensaje['hora']); ?></div>
                            </div>
                        </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>                <div class="message-input-container">
                    <form id="mensaje-form" action="enviar-mensaje.php" method="post" class="message-form">
                        <input type="hidden" name="conversacion_id" value="<?php echo htmlspecialchars($conversacion_id); ?>">
                        <button type="button" class="attachment-button" title="Adjuntar archivo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                            </svg>
                        </button>
                        <div class="message-input">
                            <textarea name="mensaje" placeholder="Escribe un mensaje..." required></textarea>
                        </div>
                        <button type="button" class="emoji-button" title="Emojis">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
                            </svg>
                        </button>
                        <button type="submit" class="send-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    </main>

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
