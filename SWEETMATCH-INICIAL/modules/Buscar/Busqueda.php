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
    <link rel="stylesheet" href="../Buscar/styles/Busqueda.css">
    <link rel="stylesheet" href="../../styles/styles.css">
    <link rel="stylesheet" href="../En linea/styles/Linea.css">

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
                        <select id="gender">
                            <option selected>Hombre</option>
                            <option>Mujer</option>
                            <option>Todos</option>
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

<div class="container">
        <header class="search-header">
            <h1>Búsqueda Avanzada</h1>
        </header>

        <main class="search-form">
            <!-- Sección: Soy un/una -->
            <div class="form-section">
                <div class="form-row">
                    <div class="form-group">
                        <label for="gender">Soy un/una</label>
                        <select id="gender" class="form-select">
                            <option value="mujer">Mujer</option>
                            <option value="hombre">Hombre</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="looking-for">Buscando</label>
                        <select id="looking-for" class="form-select">
                            <option value="hombre">Hombre</option>
                            <option value="mujer">Mujer</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Edad</label>
                        <div class="age-range">
                            <select id="age-from" class="form-select age-select">
                                <option value="18">18</option>
                                <option value="20" selected>20</option>
                                <option value="25">25</option>
                                <option value="30">30</option>
                                <option value="35">35</option>
                                <option value="40">40</option>
                            </select>
                            <span class="age-divider">-</span>
                            <select id="age-to" class="form-select age-select">
                                <option value="25" selected>25</option>
                                <option value="30">30</option>
                                <option value="35">35</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                                <option value="60">60</option>
                                <option value="99">99</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="recent-activity">Recién Activos</label>
                        <select id="recent-activity" class="form-select">
                            <option value="hoy">Hoy</option>
                            <option value="semana">Esta semana</option>
                            <option value="mes">Este mes</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="order-by">Ordenar resultados por:</label>
                        <select id="order-by" class="form-select">
                            <option value="nuevo">Nuevo</option>
                            <option value="ultimo-acceso">Último acceso</option>
                            <option value="distancia">Distancia</option>
                            <option value="compatibilidad">Compatibilidad</option>
                        </select>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="has-photo" checked>
                            <label for="has-photo">¿Tiene foto?</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="verified-users">
                            <label for="verified-users">¿Mostrar solo usuarios verificados?</label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sección: Que viva en -->
            <div class="form-section location-section">
                <div class="location-tabs">
                    <button type="button" class="tab-button active" onclick="showTab('single-country')">Un solo país</button>
                    <button type="button" class="tab-button" onclick="showTab('multiple-countries')">Varios países</button>
                </div>

                <div id="single-country" class="tab-content active">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="country">País</label>
                            <select id="country" class="form-select">
                                <option value="ecuador" selected>Ecuador</option>
                                <option value="colombia">Colombia</option>
                                <option value="peru">Perú</option>
                                <option value="venezuela">Venezuela</option>
                                <option value="brasil">Brasil</option>
                                <option value="argentina">Argentina</option>
                                <option value="chile">Chile</option>
                                <option value="mexico">México</option>
                                <option value="espana">España</option>
                                <option value="usa">Estados Unidos</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="state">Estado/Provincia</label>
                            <select id="state" class="form-select">
                                <option value="cualquier-estado">Cualquier Estado</option>
                                <option value="pichincha">Pichincha</option>
                                <option value="guayas">Guayas</option>
                                <option value="azuay">Azuay</option>
                                <option value="manabi">Manabí</option>
                                <option value="tungurahua">Tungurahua</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="city">Ciudad</label>
                            <select id="city" class="form-select">
                                <option value="cualquier-ciudad">Cualquier Ciudad</option>
                                <option value="quito">Quito</option>
                                <option value="guayaquil">Guayaquil</option>
                                <option value="cuenca">Cuenca</option>
                                <option value="ambato">Ambato</option>
                                <option value="manta">Manta</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div id="multiple-countries" class="tab-content">
                    <div class="form-group">
                        <label>Selecciona varios países:</label>
                        <div class="checkbox-grid">
                            <div class="checkbox-item">
                                <input type="checkbox" id="country-ecuador">
                                <label for="country-ecuador">Ecuador</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="country-colombia">
                                <label for="country-colombia">Colombia</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="country-peru">
                                <label for="country-peru">Perú</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="country-venezuela">
                                <label for="country-venezuela">Venezuela</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="country-brasil">
                                <label for="country-brasil">Brasil</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="country-argentina">
                                <label for="country-argentina">Argentina</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sección: Buscando a -->
            <div class="form-section">
                <h3 class="section-title">Buscando a</h3>
                <div class="relationship-types">
                    <div class="checkbox-item checked">
                        <input type="checkbox" id="correspondence" checked>
                        <label for="correspondence">Amigo por correspondencia</label>
                    </div>
                    <div class="checkbox-item checked">
                        <input type="checkbox" id="friendship" checked>
                        <label for="friendship">Amistad</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="romance">
                        <label for="romance">Romance-citas</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="long-term">
                        <label for="long-term">Relación a largo plazo</label>
                    </div>
                </div>
            </div>

            <!-- Sección: Su apariencia es -->
            <div class="form-section">
                <h3 class="section-title">Su apariencia es</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Altura:</label>
                        <div class="filter-options">
                            <span class="filter-label">Entre</span>
                            <select class="form-select inline-select">
                                <option value="cualquiera">Cualquiera</option>
                                <option value="150">150 cm</option>
                                <option value="155">155 cm</option>
                                <option value="160">160 cm</option>
                                <option value="165">165 cm</option>
                                <option value="170">170 cm</option>
                                <option value="175">175 cm</option>
                                <option value="180">180 cm</option>
                                <option value="185">185 cm</option>
                                <option value="190">190 cm</option>
                            </select>
                            <span class="filter-label">y</span>
                            <select class="form-select inline-select">
                                <option value="cualquiera">Cualquiera</option>
                                <option value="160">160 cm</option>
                                <option value="165">165 cm</option>
                                <option value="170">170 cm</option>
                                <option value="175">175 cm</option>
                                <option value="180">180 cm</option>
                                <option value="185">185 cm</option>
                                <option value="190">190 cm</option>
                                <option value="195">195 cm</option>
                                <option value="200">200 cm</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Peso:</label>
                        <div class="filter-options">
                            <span class="filter-label">Entre</span>
                            <select class="form-select inline-select">
                                <option value="cualquiera">Cualquiera</option>
                                <option value="45">45 kg</option>
                                <option value="50">50 kg</option>
                                <option value="55">55 kg</option>
                                <option value="60">60 kg</option>
                                <option value="65">65 kg</option>
                                <option value="70">70 kg</option>
                                <option value="75">75 kg</option>
                                <option value="80">80 kg</option>
                                <option value="85">85 kg</option>
                                <option value="90">90 kg</option>
                            </select>
                            <span class="filter-label">y</span>
                            <select class="form-select inline-select">
                                <option value="cualquiera">Cualquiera</option>
                                <option value="55">55 kg</option>
                                <option value="60">60 kg</option>
                                <option value="65">65 kg</option>
                                <option value="70">70 kg</option>
                                <option value="75">75 kg</option>
                                <option value="80">80 kg</option>
                                <option value="85">85 kg</option>
                                <option value="90">90 kg</option>
                                <option value="95">95 kg</option>
                                <option value="100">100 kg</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipo de cuerpo:</label>
                        <select class="form-select">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="delgado">Delgado</option>
                            <option value="atletico">Atlético</option>
                            <option value="promedio">Promedio</option>
                            <option value="corpulento">Corpulento</option>
                            <option value="extra">Extra</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Su origen étnico es:</label>
                        <select class="form-select">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="mestizo">Mestizo</option>
                            <option value="blanco">Blanco</option>
                            <option value="indigena">Indígena</option>
                            <option value="afroecuatoriano">Afroecuatoriano</option>
                            <option value="asiatico">Asiático</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Considera su apariencia física como:</label>
                        <select class="form-select">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="muy-atractivo">Muy atractivo</option>
                            <option value="atractivo">Atractivo</option>
                            <option value="promedio">Promedio</option>
                            <option value="modesto">Modesto</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Color de cabello:</label>
                        <select class="form-select">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="negro">Negro</option>
                            <option value="castano">Castaño</option>
                            <option value="rubio">Rubio</option>
                            <option value="pelirrojo">Pelirrojo</option>
                            <option value="canoso">Canoso</option>
                            <option value="calvo">Calvo</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Sección: Su estilo de vida -->
            <div class="form-section">
                <h3 class="section-title">Su estilo de vida</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>¿Fuma?</label>
                        <select class="form-select">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="no">No</option>
                            <option value="ocasionalmente">Ocasionalmente</option>
                            <option value="si">Sí</option>
                            <option value="tratando-dejar">Tratando de dejar</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>¿Bebe?</label>
                        <select class="form-select">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="no">No</option>
                            <option value="ocasionalmente">Ocasionalmente</option>
                            <option value="socialmente">Socialmente</option>
                            <option value="regularmente">Regularmente</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Dispuesto/a a trasladarse:</label>
                        <select class="form-select">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="no">No</option>
                            <option value="dentro-pais">Dentro del país</option>
                            <option value="otro-pais">A otro país</option>
                            <option value="cualquier-lugar">A cualquier lugar</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Estado civil:</label>
                        <select class="form-select">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="soltero">Soltero</option>
                            <option value="divorciado">Divorciado</option>
                            <option value="viudo">Viudo</option>
                            <option value="separado">Separado</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Sección: Su origen / Valores culturales -->
            <div class="form-section">
                <h3 class="section-title">Su origen / Valores culturales</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Nacionalidad:</label>
                        <select class="form-select">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="ecuatoriana">Ecuatoriana</option>
                            <option value="colombiana">Colombiana</option>
                            <option value="peruana">Peruana</option>
                            <option value="venezolana">Venezolana</option>
                            <option value="brasilena">Brasileña</option>
                            <option value="argentina">Argentina</option>
                            <option value="chilena">Chilena</option>
                            <option value="mexicana">Mexicana</option>
                            <option value="espanola">Española</option>
                            <option value="estadounidense">Estadounidense</option>
                            <option value="otra">Otra</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Idiomas que habla:</label>
                        <select class="form-select">
                            <option value="cualquier-idioma">Cualquier idioma</option>
                            <option value="espanol">Español</option>
                            <option value="ingles">Inglés</option>
                            <option value="portugues">Portugués</option>
                            <option value="frances">Francés</option>
                            <option value="italiano">Italiano</option>
                            <option value="aleman">Alemán</option>
                            <option value="quechua">Quechua</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Religión:</label>
                        <select class="form-select">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="catolica">Católica</option>
                            <option value="cristiana">Cristiana</option>
                            <option value="evangelica">Evangélica</option>
                            <option value="judia">Judía</option>
                            <option value="musulmana">Musulmana</option>
                            <option value="budista">Budista</option>
                            <option value="hinduista">Hinduista</option>
                            <option value="atea">Atea</option>
                            <option value="agnostica">Agnóstica</option>
                            <option value="espiritual">Espiritual</option>
                            <option value="otra">Otra</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Sección: Guardar búsqueda -->
            <div class="form-section">
                <h3 class="section-title">Guardar búsqueda como</h3>
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" id="save-search" class="form-input" placeholder="Nombre de la búsqueda" maxlength="50">
                        <small class="form-help">Máximo 50 letras</small>
                    </div>
                </div>
            </div>
        </main>
    </div>
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


    