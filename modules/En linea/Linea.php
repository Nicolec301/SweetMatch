<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: ../login/login.html");
    exit();
}
$usuario = $_SESSION['usuario'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SweetMatch - Encuentra tu pareja ideal</title>
    <link rel="stylesheet" href="../En linea/styles/Linea.css">
    <link rel="stylesheet" href="../../styles/styles.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Barra de navegación superior -->
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

    <!-- Panel de Usuario -->
    <section class="user-panel">
        <div class="user-panel-photo">
            <img src="../../uploads/<?php echo htmlspecialchars($usuario['foto']); ?>" alt="Foto de perfil">
        </div>
        
        <div class="user-panel-content">
            <h2>Hola <?php echo htmlspecialchars($usuario['nombre']); ?></h2>
            <a href="../../modules/Perfil/SubirFotos.html" class="user-panel-next-step">
                <i class="fas fa-camera"></i> Siguiente Paso: Complete las preguntas de perfil
            </a>
        </div>
        
        <div class="user-panel-stats">
            <div class="user-stat">
                <div class="stat-circle-container">
                    <div class="stat-circle">
                        <div class="stat-number">51%</div>
                    </div>
                </div>
            </div>
            
            <div class="user-panel-icons">
                <div class="icon-stat">
                    <div class="icon-circle">
                        <i class="fas fa-comment"></i>
                    </div>
                    <span class="icon-stat-number">1</span>
                </div>
                
                <div class="icon-stat">
                    <div class="icon-circle">
                        <i class="fas fa-heart"></i>
                    </div>
                    <span class="icon-stat-number">2</span>
                </div>
                
                <div class="icon-stat">
                    <div class="icon-circle">
                        <i class="fas fa-eye"></i>
                    </div>
                    <span class="icon-stat-number">1</span>
                </div>
                
                <div class="icon-stat">
                    <div class="icon-circle">
                        <i class="fas fa-star"></i>
                    </div>
                    <span class="icon-stat-number">0</span>
                </div>
            </div>
        </div>
    </section>
   <!-- Sección de búsqueda -->
    <section class="search-section">
        <div class="search-container">
            <div class="search-fields">
                <div class="search-field">
                    <label for="gender">Buscando</label> 
                    <div class="select-container">
                        <select id="gender" name="gender">
                            <option value="hombre" <?php echo ($usuario['genero_busco'] == 'hombres') ? 'selected' : ''; ?>>Hombres</option>
                            <option value="mujer" <?php echo ($usuario['genero_busco'] == 'mujeres') ? 'selected' : ''; ?>>Mujeres</option>
                            <option value="todos" <?php echo ($usuario['genero_busco'] == 'todos') ? 'selected' : ''; ?>>Todos</option>
                        </select>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                
                <div class="search-field">
                    <label for="age">Edad</label>
                    <div class="age-range">
                        <div class="select-container">
                            <select id="age-min">
                                <option selected>20</option>
                                <option>21</option>
                                <option>22</option>
                                <option>23</option>
                                <option>24</option>
                                <option>25</option>
                            </select>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <span class="age-separator">-</span>
                        <div class="select-container">
                            <select id="age-max">
                                <option selected>25</option>
                                <option>26</option>
                                <option>27</option>
                                <option>28</option>
                                <option>29</option>
                                <option>30</option>
                            </select>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
                
                <div class="search-field">
                    <label for="country">País</label>
                    <div class="select-container">
                        <select id="country">
                            <option selected>Ecuador</option>
                            <option>Colombia</option>
                            <option>Perú</option>
                            <option>Brasil</option>
                        </select>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                
                <div class="search-field">
                    <label for="state">Estado/Provincia</label>
                    <div class="select-container">
                        <select id="state">
                            <option selected>Cualquier Estado</option>
                            <option>Pichincha</option>
                            <option>Guayas</option>
                            <option>Azuay</option>
                        </select>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                
                <div class="search-field">
                    <label for="city">Ciudad</label>
                    <div class="select-container">
                        <select id="city">
                            <option selected>Cualquier Ciudad</option>
                            <option>Quito</option>
                            <option>Guayaquil</option>
                            <option>Cuenca</option>
                        </select>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                            
                <div class="search-button">
                    <button type="button">BUSCAR</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Resultados de búsqueda -->
    <section class="search-results">
        <div class="results-header">
            <div class="results-count">Conectados</div>
            <div class="results-sort">
                <label for="sort-by">Ordenado por:</label>
                <div class="select-container">
                    <select id="sort-by">
                        <option selected>Afinidad</option>
                        <option>Fecha</option>
                        <option>Popularidad</option>
                    </select>
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
        </div>

<div class="profiles-grid">
    <!-- Perfil 1 -->
    <div class="profile-card">
        <div class="profile-photo">
            <img src="../../images/Fotos/chico1.1.jpg" alt="Perfil de Carlos">
            <div class="online-status online"></div>
        </div>
        <div class="profile-details">
            <h3>Carlos <i class="fas fa-shield-alt verified"></i></h3>
            <p>28 • Quito, Pichincha, Ecuador</p>
            <p class="search-preference">Buscando: Mujer 22 - 35</p>
            <p class="last-activity">En línea</p>
        </div>
        <div class="profile-icons">
            <i class="fas fa-heart"></i>
            <i class="fas fa-comment"></i>
            <i class="fas fa-camera"></i>
            <span class="photo-count">3</span>
        </div>
    </div>
    
    <!-- Perfil 2 -->
    <div class="profile-card">
        <div class="profile-photo">
            <img src="../../images/Fotos/chico3.3.jpg"  alt="Perfil de Miguel">
            <div class="online-status online"></div>
        </div>
        <div class="profile-details">
            <h3>Miguel <i class="fas fa-shield-alt verified"></i></h3>
            <p>32 • Guayaquil, Guayas, Ecuador</p>
            <p class="search-preference">Buscando: Mujer 25 - 38</p>
            <p class="last-activity">En línea</p>
        </div>
        <div class="profile-icons">
            <i class="fas fa-heart"></i>
            <i class="fas fa-comment"></i>
            <i class="fas fa-camera"></i>
            <span class="photo-count">2</span>
        </div>
    </div>
    
    <!-- Perfil 3 -->
    <div class="profile-card">
        <div class="profile-photo">
            <img src="../../images/Fotos/chico6.6.jpg"  alt="Perfil de Daniel">
            <div class="online-status online"></div>
        </div>
        <div class="profile-details">
            <h3>Daniel <i class="fas fa-shield-alt verified"></i></h3>
            <p>31 • Cuenca, Azuay, Ecuador</p>
            <p class="search-preference">Buscando: Mujer 24 - 32</p>
            <p class="last-activity">En línea</p>
        </div>
        <div class="profile-icons">
            <i class="fas fa-heart"></i>
            <i class="fas fa-comment"></i>
            <i class="fas fa-camera"></i>
            <span class="photo-count">4</span>
        </div>
    </div>
    
    <!-- Perfil 4 -->
    <div class="profile-card">
        <div class="profile-photo">
            <img src="../../images/Fotos/chico2.2.jpg" alt="Perfil de Mateo">
            <div class="online-status online"></div>
        </div>
        <div class="profile-details">
            <h3>Mateo <i class="fas fa-shield-alt verified"></i></h3>
            <p>26 • Manta, Manabí, Ecuador</p>
            <p class="search-preference">Buscando: Mujer 20 - 30</p>
            <p class="last-activity">En línea</p>
        </div>
        <div class="profile-icons">
            <i class="fas fa-heart"></i>
            <i class="fas fa-comment"></i>
            <i class="fas fa-camera"></i>
            <span class="photo-count">1</span>
        </div>
    </div>
    
    <!-- Perfil 5 -->
    <div class="profile-card">
        <div class="profile-photo">
            <img src="../../images/Fotos/chico5.5.jpg" alt="Perfil de Javier">
            <div class="online-status online"></div>
        </div>
        <div class="profile-details">
            <h3>Javier <i class="fas fa-shield-alt verified"></i></h3>
            <p>29 • Loja, Loja, Ecuador</p>
            <p class="search-preference">Buscando: Mujer 23 - 35</p>
            <p class="last-activity">En línea</p>
        </div>
        <div class="profile-icons">
            <i class="fas fa-heart"></i>
            <i class="fas fa-comment"></i>
            <i class="fas fa-camera"></i>
            <span class="photo-count">2</span>
        </div>
    </div>
    
    <!-- Perfil 6 -->
    <div class="profile-card">
        <div class="profile-photo">
            <img src="../../images/Fotos/chico4.4.jpg" alt="Perfil de Sebastián">
            <div class="online-status online"></div>
        </div>
        <div class="profile-details">
            <h3>Sebastián <i class="fas fa-shield-alt verified"></i></h3>
            <p>27 • Ambato, Tungurahua, Ecuador</p>
            <p class="search-preference">Buscando: Mujer 20 - 32</p>
            <p class="last-activity">En línea</p>
        </div>
        <div class="profile-icons">
            <i class="fas fa-heart"></i>
            <i class="fas fa-comment"></i>
            <i class="fas fa-camera"></i>
            <span class="photo-count">3</span>
        </div>
    </div>
</div>
    </section>
        <!-- Footer -->
    <footer id="contacto">
        <div class="footer-container">
            <div class="footer-col">
                <img src="../../images/logo.svg" alt="SweetMatch Logo" class="footer-logo">
                <p>Descubre a personas increíbles, crea conexiones auténticas y haz match con quien comparte tu vibra.
                </p>
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