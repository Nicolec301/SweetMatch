-- =============================================================
-- SweetMatch - Esquema Completo de Base de Datos
-- Fecha: 2025-08-11
-- Versión: 1.0 Consolidada
-- Uso: psql -U postgres -d sweetmatch -f sweetmatch_database_complete.sql
-- Descripción: Esquema completo para la aplicación de citas SweetMatch
-- =============================================================

-- Iniciar transacción
BEGIN;

-- =============================================================
-- ELIMINACIÓN DE TABLAS EXISTENTES (PARA DESARROLLO)
-- =============================================================
DROP TABLE IF EXISTS mensajes CASCADE;
DROP TABLE IF EXISTS conversaciones CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS usuario_intereses CASCADE;
DROP TABLE IF EXISTS intereses CASCADE;
DROP TABLE IF EXISTS usuario_fotos CASCADE;
DROP TABLE IF EXISTS usuario_configuracion CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- =============================================================
-- FUNCIONES AUXILIARES
-- =============================================================

-- Función para actualizar timestamps automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar timestamp de conversación al insertar mensajes
CREATE OR REPLACE FUNCTION actualizar_conversacion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversaciones
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.conversacion_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- TABLA: usuarios
-- =============================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    -- Información básica
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    edad INTEGER,
    descripcion TEXT,
    -- Información de perfil detallado
    ubicacion VARCHAR(255),
    trabajo VARCHAR(255),
    educacion VARCHAR(255),
    altura VARCHAR(20), -- e.g., "1.65m", "5'7""
    signo VARCHAR(50), -- e.g., "Leo", "Aries"
    fumador VARCHAR(20) DEFAULT 'No', -- "No", "Sí", "Ocasionalmente"
    bebe VARCHAR(30) DEFAULT 'No', -- "No", "Sí", "Ocasionalmente", "Socialmente"
    mascotas TEXT, -- Información sobre mascotas
    hijos TEXT DEFAULT 'No tengo', -- Información sobre hijos
    religion VARCHAR(100), -- Religión o creencias
    politica VARCHAR(100), -- Orientación política
    -- Estado y verificación
    verificada BOOLEAN DEFAULT FALSE,
    perfil_completado BOOLEAN DEFAULT FALSE,
    -- Metadatos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_ubicacion ON usuarios(ubicacion);
CREATE INDEX idx_usuarios_perfil_completado ON usuarios(perfil_completado);
CREATE INDEX idx_usuarios_edad ON usuarios(edad);

-- Trigger para updated_at en usuarios
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- TABLA: usuario_configuracion
-- =============================================================
CREATE TABLE usuario_configuracion (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    -- Configuraciones de privacidad
    mostrar_edad BOOLEAN DEFAULT TRUE,
    mostrar_ubicacion BOOLEAN DEFAULT TRUE,
    mostrar_trabajo BOOLEAN DEFAULT TRUE,
    perfil_publico BOOLEAN DEFAULT TRUE,
    notificaciones BOOLEAN DEFAULT TRUE,
    mostrar_en_linea BOOLEAN DEFAULT TRUE,
    -- Metadatos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para usuario_configuracion
CREATE INDEX idx_usuario_configuracion_usuario_id ON usuario_configuracion(usuario_id);

-- Trigger para updated_at en usuario_configuracion
CREATE TRIGGER update_usuario_configuracion_updated_at
    BEFORE UPDATE ON usuario_configuracion
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- TABLA: usuario_fotos
-- =============================================================
CREATE TABLE usuario_fotos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para usuario_fotos
CREATE INDEX idx_usuario_fotos_usuario_id ON usuario_fotos(usuario_id);
CREATE INDEX idx_usuario_fotos_principal ON usuario_fotos(es_principal);

-- =============================================================
-- TABLA: intereses
-- =============================================================
CREATE TABLE intereses (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- TABLA: usuario_intereses (relación muchos a muchos)
-- =============================================================
CREATE TABLE usuario_intereses (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    interes_id INTEGER NOT NULL REFERENCES intereses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, interes_id)
);

-- Índices para usuario_intereses
CREATE INDEX idx_usuario_intereses_usuario_id ON usuario_intereses(usuario_id);
CREATE INDEX idx_usuario_intereses_interes_id ON usuario_intereses(interes_id);

-- =============================================================
-- TABLA: matches
-- =============================================================
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    usuario1_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    usuario2_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Constraints
    CHECK (usuario1_id <> usuario2_id)
);

-- Índices para matches
CREATE INDEX idx_matches_usuario1_id ON matches(usuario1_id);
CREATE INDEX idx_matches_usuario2_id ON matches(usuario2_id);
CREATE INDEX idx_matches_fecha ON matches(fecha_match);

-- Índice único para evitar matches duplicados (orden canónico)
CREATE UNIQUE INDEX idx_matches_unique_pair 
ON matches (LEAST(usuario1_id, usuario2_id), GREATEST(usuario1_id, usuario2_id));

-- =============================================================
-- TABLA: conversaciones
-- =============================================================
CREATE TABLE conversaciones (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para conversaciones
CREATE INDEX idx_conversaciones_match_id ON conversaciones(match_id);
CREATE INDEX idx_conversaciones_updated_at ON conversaciones(updated_at);

-- Trigger para updated_at en conversaciones
CREATE TRIGGER update_conversaciones_updated_at
    BEFORE UPDATE ON conversaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- TABLA: mensajes
-- =============================================================
CREATE TABLE mensajes (
    id SERIAL PRIMARY KEY,
    conversacion_id INTEGER NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
    remitente_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP NULL,
    -- Campos adicionales
    leido BOOLEAN DEFAULT FALSE,
    tipo VARCHAR(20) DEFAULT 'texto' CHECK (tipo IN ('texto', 'imagen', 'archivo'))
);

-- Índices para mensajes
CREATE INDEX idx_mensajes_conversacion_id ON mensajes(conversacion_id);
CREATE INDEX idx_mensajes_remitente_id ON mensajes(remitente_id);
CREATE INDEX idx_mensajes_fecha_envio ON mensajes(fecha_envio);
CREATE INDEX idx_mensajes_leido ON mensajes(leido);

-- Trigger para actualizar timestamp de conversación al insertar mensajes
CREATE TRIGGER trigger_actualizar_conversacion
    AFTER INSERT ON mensajes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_conversacion_timestamp();

-- =============================================================
-- VISTAS ÚTILES
-- =============================================================

-- Vista para conversaciones con información de usuarios
CREATE OR REPLACE VIEW vw_conversaciones_usuarios AS
SELECT 
    c.id AS conversacion_id,
    c.match_id,
    m.usuario1_id,
    m.usuario2_id,
    u1.nombre AS usuario1_nombre,
    u1.email AS usuario1_email,
    u2.nombre AS usuario2_nombre,
    u2.email AS usuario2_email,
    c.created_at,
    c.updated_at,
    (SELECT COUNT(*) FROM mensajes WHERE conversacion_id = c.id) AS total_mensajes,
    (SELECT COUNT(*) FROM mensajes WHERE conversacion_id = c.id AND leido = false) AS mensajes_no_leidos
FROM conversaciones c
JOIN matches m ON m.id = c.match_id
JOIN usuarios u1 ON u1.id = m.usuario1_id
JOIN usuarios u2 ON u2.id = m.usuario2_id;

-- =============================================================
-- DATOS INICIALES
-- =============================================================

-- Insertar intereses básicos
INSERT INTO intereses (nombre) VALUES 
    ('Música'),
    ('Deportes'),
    ('Cine'),
    ('Viajes'),
    ('Cocina'),
    ('Lectura'),
    ('Arte'),
    ('Tecnología'),
    ('Naturaleza'),
    ('Fotografía'),
    ('Baile'),
    ('Ejercicio'),
    ('Yoga'),
    ('Senderismo'),
    ('Gaming'),
    ('Mascotas'),
    ('Moda'),
    ('Teatro'),
    ('Historia'),
    ('Ciencia');

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (
    nombre, email, password, edad, descripcion, ubicacion,
    trabajo, educacion, altura, signo, fumador, bebe, 
    mascotas, hijos, religion, politica, verificada, perfil_completado
) VALUES 
    (
        'Ana García', 'ana@example.com', '$2b$10$hashedpassword1', 25, 
        'Me encanta viajar y conocer nuevas culturas. Siempre buscando aventuras y buenos momentos.', 'Madrid, España',
        'Diseñadora Gráfica', 'Universidad Complutense de Madrid', '1.65m', 'Leo', 
        'No', 'Ocasionalmente', 'Me encantan los perros', 
        'No tengo, pero me gustarían en el futuro', 'Católica', 'Liberal', true, true
    ),
    (
        'Carlos López', 'carlos@example.com', '$2b$10$hashedpassword2', 28, 
        'Desarrollador apasionado por la tecnología. Aficionado a la música rock y los deportes extremos.', 'Barcelona, España',
        'Ingeniero de Software', 'Universidad Politécnica de Cataluña', '1.78m', 'Aries', 
        'No', 'Socialmente', 'Tengo un gato llamado Pixel', 
        'No tengo ni planeo tener', 'Agnóstico', 'Progresista', true, true
    ),
    (
        'María Rodríguez', 'maria@example.com', '$2b$10$hashedpassword3', 24, 
        'Fotógrafa y artista. Amo capturar momentos únicos y expresar emociones a través del arte.', 'Valencia, España',
        'Fotógrafa Freelance', 'Bellas Artes - Universidad Politécnica de Valencia', '1.62m', 'Piscis', 
        'Ocasionalmente', 'Sí', 'Me gustan todos los animales', 
        'Quiero tener hijos en el futuro', 'Espiritual', 'Liberal', true, true
    ),
    (
        'David Martín', 'david@example.com', '$2b$10$hashedpassword4', 30, 
        'Chef ejecutivo con pasión por la gastronomía internacional. Me encanta viajar y probar nuevos sabores.', 'Sevilla, España',
        'Chef Ejecutivo', 'Escuela de Hostelería de Sevilla', '1.82m', 'Tauro', 
        'No', 'Ocasionalmente', 'No tengo mascotas por el trabajo', 
        'Tengo un hijo de 5 años, es mi mundo', 'Católico', 'Moderado', true, true
    ),
    (
        'Laura Fernández', 'laura@example.com', '$2b$10$hashedpassword5', 26, 
        'Desarrolladora full-stack y lectora empedernida. Siempre aprendiendo cosas nuevas.', 'Bilbao, España',
        'Desarrolladora Full Stack', 'Universidad del País Vasco', '1.68m', 'Virgo', 
        'No', 'No', 'Tengo dos golden retrievers', 
        'No tengo, pero estoy abierta a la idea', 'Atea', 'Progresista', true, true
    );

-- Insertar configuraciones de privacidad para los usuarios
INSERT INTO usuario_configuracion (
    usuario_id, mostrar_edad, mostrar_ubicacion, mostrar_trabajo, 
    perfil_publico, notificaciones, mostrar_en_linea
) VALUES 
    (1, true, true, true, true, true, true),    -- Ana: perfil completamente público
    (2, true, false, true, true, true, false),  -- Carlos: no muestra ubicación ni estado en línea
    (3, false, true, false, true, false, true), -- María: no muestra edad ni trabajo, sin notificaciones
    (4, true, true, true, true, true, true),    -- David: perfil completamente público
    (5, true, true, true, false, true, false);  -- Laura: perfil no público, no muestra estado en línea

-- Insertar fotos de ejemplo (usando las imágenes disponibles)
INSERT INTO usuario_fotos (usuario_id, url, es_principal) VALUES 
    (1, '/images/Fotos/chico1.jpg', true),
    (1, '/images/Fotos/chico1.1.jpg', false),
    (2, '/images/Fotos/chico2.jpg', true),
    (2, '/images/Fotos/chico2.2.jpg', false),
    (3, '/images/Fotos/chico3.jpg', true),
    (3, '/images/Fotos/chico3.3.jpg', false),
    (4, '/images/Fotos/chico4.jpg', true),
    (4, '/images/Fotos/chico4.4.jpg', false),
    (5, '/images/Fotos/chico5.jpg', true),
    (5, '/images/Fotos/chico5.5.jpg', false);

-- Insertar intereses de usuarios
INSERT INTO usuario_intereses (usuario_id, interes_id) VALUES 
    -- Ana (id=1): Viajes, Naturaleza, Fotografía, Arte
    (1, 4), (1, 9), (1, 10), (1, 7),
    -- Carlos (id=2): Música, Deportes, Tecnología, Gaming
    (2, 1), (2, 2), (2, 8), (2, 15),
    -- María (id=3): Arte, Fotografía, Lectura, Teatro
    (3, 7), (3, 10), (3, 6), (3, 18),
    -- David (id=4): Cocina, Viajes, Naturaleza, Historia
    (4, 5), (4, 4), (4, 9), (4, 19),
    -- Laura (id=5): Lectura, Tecnología, Cine, Ciencia
    (5, 6), (5, 8), (5, 3), (5, 20);

-- Insertar matches de ejemplo
INSERT INTO matches (usuario1_id, usuario2_id) VALUES 
    (1, 2), -- Ana y Carlos
    (1, 4), -- Ana y David
    (2, 3), -- Carlos y María
    (3, 5), -- María y Laura
    (2, 5); -- Carlos y Laura

-- Insertar conversaciones basadas en los matches
INSERT INTO conversaciones (match_id) VALUES 
    (1), -- Ana y Carlos
    (2), -- Ana y David
    (3), -- Carlos y María
    (4), -- María y Laura
    (5); -- Carlos y Laura

-- Insertar mensajes de ejemplo
INSERT INTO mensajes (conversacion_id, remitente_id, contenido, fecha_envio, leido, tipo) VALUES 
    -- Conversación 1: Ana y Carlos
    (1, 1, '¡Hola Carlos! Me encanta tu perfil, especialmente que seas desarrollador 😊', CURRENT_TIMESTAMP - INTERVAL '2 hours', true, 'texto'),
    (1, 2, '¡Hola Ana! Gracias, el tuyo también me parece muy interesante. Me encanta que viajes tanto', CURRENT_TIMESTAMP - INTERVAL '1 hour 50 minutes', true, 'texto'),
    (1, 1, '¿Te gusta viajar? Veo que también te interesa la tecnología', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes', true, 'texto'),
    (1, 2, 'Sí, es una de mis pasiones aunque no viajo tanto como me gustaría. ¿Cuál ha sido tu último destino?', CURRENT_TIMESTAMP - INTERVAL '1 hour 15 minutes', false, 'texto'),
    
    -- Conversación 2: Ana y David
    (2, 1, 'Hola David! Veo que eres chef, eso debe ser increíble 👨‍🍳', CURRENT_TIMESTAMP - INTERVAL '3 hours', true, 'texto'),
    (2, 4, '¡Hola Ana! Sí, me encanta cocinar. Es genial poder crear experiencias a través de la comida', CURRENT_TIMESTAMP - INTERVAL '2 hours 45 minutes', true, 'texto'),
    (2, 1, '¿Cuál es tu plato favorito para cocinar?', CURRENT_TIMESTAMP - INTERVAL '2 hours 30 minutes', false, 'texto'),
    
    -- Conversación 3: Carlos y María
    (3, 2, '¡Hola María! Me gusta mucho tu trabajo como fotógrafa', CURRENT_TIMESTAMP - INTERVAL '4 hours', true, 'texto'),
    (3, 3, 'Gracias Carlos! Veo que te gusta la música, ¿tocas algún instrumento?', CURRENT_TIMESTAMP - INTERVAL '3 hours 30 minutes', true, 'texto'),
    (3, 2, 'Sí, toco un poco la guitarra. Nada profesional, pero me relaja', CURRENT_TIMESTAMP - INTERVAL '3 hours 15 minutes', false, 'texto'),
    
    -- Conversación 4: María y Laura
    (4, 3, 'Hola Laura! ¿Qué estás leyendo últimamente? 📚', CURRENT_TIMESTAMP - INTERVAL '1 day', true, 'texto'),
    (4, 5, '¡Hola María! Acabo de terminar un libro sobre desarrollo web muy interesante. ¿Y tú qué tal con la fotografía?', CURRENT_TIMESTAMP - INTERVAL '23 hours', true, 'texto'),
    (4, 3, 'Muy bien! Estoy trabajando en un proyecto de retratos urbanos', CURRENT_TIMESTAMP - INTERVAL '22 hours 30 minutes', false, 'texto'),
    
    -- Conversación 5: Carlos y Laura
    (5, 2, 'Hola Laura! Veo que también eres desarrolladora 💻', CURRENT_TIMESTAMP - INTERVAL '6 hours', true, 'texto'),
    (5, 5, '¡Hola Carlos! Sí, qué casualidad. ¿En qué tecnologías trabajas?', CURRENT_TIMESTAMP - INTERVAL '5 hours 45 minutes', false, 'texto');

-- Confirmar transacción
COMMIT;

-- =============================================================
-- VERIFICACIÓN FINAL
-- =============================================================

-- Mostrar resumen de datos creados
SELECT 'Usuarios' as tabla, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'Intereses', COUNT(*) FROM intereses
UNION ALL
SELECT 'Usuario_Intereses', COUNT(*) FROM usuario_intereses
UNION ALL
SELECT 'Usuario_Fotos', COUNT(*) FROM usuario_fotos
UNION ALL
SELECT 'Usuario_Configuracion', COUNT(*) FROM usuario_configuracion
UNION ALL
SELECT 'Matches', COUNT(*) FROM matches
UNION ALL
SELECT 'Conversaciones', COUNT(*) FROM conversaciones
UNION ALL
SELECT 'Mensajes', COUNT(*) FROM mensajes;

-- Mostrar conversaciones activas
SELECT 
    c.id as conversacion_id,
    u1.nombre as usuario1,
    u2.nombre as usuario2,
    COUNT(m.id) as total_mensajes,
    MAX(m.fecha_envio) as ultimo_mensaje
FROM conversaciones c
JOIN matches ma ON c.match_id = ma.id
JOIN usuarios u1 ON ma.usuario1_id = u1.id
JOIN usuarios u2 ON ma.usuario2_id = u2.id
LEFT JOIN mensajes m ON c.id = m.conversacion_id
GROUP BY c.id, u1.nombre, u2.nombre
ORDER BY ultimo_mensaje DESC;

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Base de datos SweetMatch creada exitosamente!';
    RAISE NOTICE '📊 Se han insertado datos de ejemplo para testing';
    RAISE NOTICE '🔧 Todas las tablas, índices y triggers están configurados';
END $$;
