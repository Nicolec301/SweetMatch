-- SweetMatch Database Schema
-- Esquema simple para PostgreSQL (no para producción)

-- Eliminar tablas existentes si existen (para desarrollo)
DROP TABLE IF EXISTS mensajes CASCADE;
DROP TABLE IF EXISTS conversaciones CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS usuario_intereses CASCADE;
DROP TABLE IF EXISTS intereses CASCADE;
DROP TABLE IF EXISTS usuario_fotos CASCADE;
DROP TABLE IF EXISTS usuario_configuracion CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    edad INTEGER,
    descripcion TEXT,
    ubicacion VARCHAR(100),
    -- Campos de perfil detallado
    trabajo VARCHAR(150),
    educacion VARCHAR(150),
    altura VARCHAR(20), -- e.g., "1.65m", "5'7\""
    signo VARCHAR(20), -- e.g., "Leo", "Aries"
    fumador VARCHAR(20), -- "No", "Sí", "Ocasionalmente"
    bebe VARCHAR(30), -- "No", "Sí", "Ocasionalmente", "Socialmente"
    mascotas TEXT, -- Descripción de preferencias con mascotas
    hijos TEXT, -- Información sobre hijos e intenciones
    religion VARCHAR(50), -- Religión o creencias
    politica VARCHAR(50), -- Orientación política
    verificada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de configuración de privacidad del usuario
CREATE TABLE usuario_configuracion (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    mostrar_edad BOOLEAN DEFAULT TRUE,
    mostrar_ubicacion BOOLEAN DEFAULT TRUE,
    mostrar_trabajo BOOLEAN DEFAULT TRUE,
    perfil_publico BOOLEAN DEFAULT TRUE,
    notificaciones BOOLEAN DEFAULT TRUE,
    mostrar_en_linea BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id)
);

-- Tabla de fotos de usuarios
CREATE TABLE usuario_fotos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    url_foto VARCHAR(500) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de intereses
CREATE TABLE intereses (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación usuario-intereses
CREATE TABLE usuario_intereses (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    interes_id INTEGER REFERENCES intereses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, interes_id)
);

-- Tabla de matches
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    usuario1_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    usuario2_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario1_id, usuario2_id)
);

-- Tabla de conversaciones
CREATE TABLE conversaciones (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes
CREATE TABLE mensajes (
    id SERIAL PRIMARY KEY,
    conversacion_id INTEGER REFERENCES conversaciones(id) ON DELETE CASCADE,
    remitente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP NULL
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_usuario_configuracion_usuario_id ON usuario_configuracion(usuario_id);
CREATE INDEX idx_usuario_fotos_usuario_id ON usuario_fotos(usuario_id);
CREATE INDEX idx_usuario_intereses_usuario_id ON usuario_intereses(usuario_id);
CREATE INDEX idx_usuario_intereses_interes_id ON usuario_intereses(interes_id);
CREATE INDEX idx_matches_usuario1_id ON matches(usuario1_id);
CREATE INDEX idx_matches_usuario2_id ON matches(usuario2_id);
CREATE INDEX idx_mensajes_conversacion_id ON mensajes(conversacion_id);
CREATE INDEX idx_mensajes_remitente_id ON mensajes(remitente_id);

-- Datos de ejemplo para intereses
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
    ('Fotografía');

-- Usuarios de ejemplo
INSERT INTO usuarios (
    nombre, email, password, edad, descripcion, ubicacion,
    trabajo, educacion, altura, signo, fumador, bebe, 
    mascotas, hijos, religion, politica, verificada
) VALUES 
    (
        'Ana García', 'ana@example.com', 'password123', 25, 
        'Me encanta viajar y conocer nuevas culturas', 'Madrid',
        'Diseñadora Gráfica', 'Universidad de Madrid', '1.65m', 'Leo', 
        'No', 'Ocasionalmente', 'Me encantan los perros', 
        'No tengo, pero me gustarían en el futuro', 'Católica', 'Liberal', true
    ),
    (
        'Carlos López', 'carlos@example.com', 'password123', 28, 
        'Aficionado a la música y los deportes', 'Barcelona',
        'Ingeniero de Software', 'Universidad Politécnica de Cataluña', '1.78m', 'Aries', 
        'No', 'Socialmente', 'Tengo un gato', 
        'No tengo ni quiero tener', 'Agnóstico', 'Progresista', true
    ),
    (
        'María Rodríguez', 'maria@example.com', 'password123', 24, 
        'Amante del arte y la fotografía', 'Valencia',
        'Fotógrafa Freelance', 'Bellas Artes Universidad de Valencia', '1.62m', 'Piscis', 
        'Ocasionalmente', 'Sí', 'Me gustan todos los animales', 
        'Quiero tener hijos en el futuro', 'Espiritual', 'Liberal', false
    ),
    (
        'David Martín', 'david@example.com', 'password123', 30, 
        'Chef profesional y aventurero', 'Sevilla',
        'Chef Ejecutivo', 'Escuela de Hostelería de Sevilla', '1.82m', 'Tauro', 
        'No', 'Ocasionalmente', 'No tengo mascotas por trabajo', 
        'Tengo un hijo, me encantan los niños', 'Católico', 'Moderado', true
    ),
    (
        'Laura Fernández', 'laura@example.com', 'password123', 26, 
        'Lectora empedernida y tecnóloga', 'Bilbao',
        'Desarrolladora Full Stack', 'Universidad del País Vasco', '1.68m', 'Virgo', 
        'No', 'No', 'Tengo dos perros', 
        'No tengo, estoy abierta a la idea', 'Atea', 'Progresista', true
    );

-- Configuraciones de privacidad de ejemplo
INSERT INTO usuario_configuracion (
    usuario_id, mostrar_edad, mostrar_ubicacion, mostrar_trabajo, 
    perfil_publico, notificaciones, mostrar_en_linea
) VALUES 
    (1, true, true, true, true, true, true),    -- Ana: perfil completamente público
    (2, true, false, true, true, true, false),  -- Carlos: no muestra ubicación ni estado en línea
    (3, false, true, false, true, false, true), -- María: no muestra edad ni trabajo, sin notificaciones
    (4, true, true, true, true, true, true),    -- David: perfil completamente público
    (5, true, true, true, false, true, false);  -- Laura: perfil no público, no muestra estado en línea

-- Fotos de ejemplo (usando las imágenes que tienes en public/images/Fotos/)
INSERT INTO usuario_fotos (usuario_id, url_foto, es_principal) VALUES 
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

-- Intereses de usuarios de ejemplo
INSERT INTO usuario_intereses (usuario_id, interes_id) VALUES 
    (1, 4), (1, 9), (1, 10), -- Ana: Viajes, Naturaleza, Fotografía
    (2, 1), (2, 2), (2, 8),  -- Carlos: Música, Deportes, Tecnología
    (3, 7), (3, 10), (3, 6), -- María: Arte, Fotografía, Lectura
    (4, 5), (4, 4), (4, 9),  -- David: Cocina, Viajes, Naturaleza
    (5, 6), (5, 8), (5, 3);  -- Laura: Lectura, Tecnología, Cine

-- Matches de ejemplo
INSERT INTO matches (usuario1_id, usuario2_id) VALUES 
    (1, 2),
    (1, 4),
    (2, 3),
    (3, 5);

-- Conversaciones de ejemplo
INSERT INTO conversaciones (match_id) VALUES 
    (1), -- Ana y Carlos
    (2), -- Ana y David
    (3), -- Carlos y María
    (4); -- María y Laura

-- Mensajes de ejemplo
INSERT INTO mensajes (conversacion_id, remitente_id, contenido) VALUES 
    (1, 1, '¡Hola Carlos! Me encanta tu perfil'),
    (1, 2, 'Hola Ana, gracias! También me gusta el tuyo'),
    (1, 1, '¿Te gusta viajar? Veo que también te interesa'),
    (1, 2, 'Sí, es una de mis pasiones. ¿Cuál ha sido tu último viaje?'),
    
    (2, 1, 'Hola David! Veo que eres chef'),
    (2, 4, '¡Hola Ana! Sí, me encanta cocinar. ¿Y tú cocinas?'),
    
    (3, 2, '¡Hola María! Me gusta tu arte'),
    (3, 3, 'Gracias Carlos! ¿También te gusta el arte?'),
    
    (4, 3, 'Hola Laura! ¿Qué estás leyendo últimamente?'),
    (4, 5, '¡Hola María! Acabo de terminar un libro de tecnología muy interesante');

-- Trigger para actualizar updated_at en users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuario_configuracion_updated_at BEFORE UPDATE ON usuario_configuracion
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversaciones_updated_at BEFORE UPDATE ON conversaciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();