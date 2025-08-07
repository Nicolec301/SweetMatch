-- SweetMatch Database Schema
-- Esquema simple para PostgreSQL (no para producción)

-- Eliminar tablas existentes si existen (para desarrollo)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS user_interest CASCADE;
DROP TABLE IF EXISTS interest CASCADE;
DROP TABLE IF EXISTS user_photos CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INTEGER,
    bio TEXT,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de fotos de usuarios
CREATE TABLE user_photos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de intereses
CREATE TABLE interest (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación usuario-intereses
CREATE TABLE user_interest (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    interest_id INTEGER REFERENCES interest(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, interest_id)
);

-- Tabla de matches
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user1_id, user2_id)
);

-- Tabla de conversaciones
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_user_photos_user_id ON user_photos(user_id);
CREATE INDEX idx_user_interest_user_id ON user_interest(user_id);
CREATE INDEX idx_user_interest_interest_id ON user_interest(interest_id);
CREATE INDEX idx_matches_user1_id ON matches(user1_id);
CREATE INDEX idx_matches_user2_id ON matches(user2_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- Datos de ejemplo para intereses
INSERT INTO interest (name) VALUES 
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
INSERT INTO users (name, email, password, age, bio, location) VALUES 
    ('Ana García', 'ana@example.com', 'password123', 25, 'Me encanta viajar y conocer nuevas culturas', 'Madrid'),
    ('Carlos López', 'carlos@example.com', 'password123', 28, 'Aficionado a la música y los deportes', 'Barcelona'),
    ('María Rodríguez', 'maria@example.com', 'password123', 24, 'Amante del arte y la fotografía', 'Valencia'),
    ('David Martín', 'david@example.com', 'password123', 30, 'Chef profesional y aventurero', 'Sevilla'),
    ('Laura Fernández', 'laura@example.com', 'password123', 26, 'Lectora empedernida y tecnóloga', 'Bilbao');

-- Fotos de ejemplo (usando las imágenes que tienes en public/images/Fotos/)
INSERT INTO user_photos (user_id, photo_url, is_primary) VALUES 
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
INSERT INTO user_interest (user_id, interest_id) VALUES 
    (1, 4), (1, 9), (1, 10), -- Ana: Viajes, Naturaleza, Fotografía
    (2, 1), (2, 2), (2, 8),  -- Carlos: Música, Deportes, Tecnología
    (3, 7), (3, 10), (3, 6), -- María: Arte, Fotografía, Lectura
    (4, 5), (4, 4), (4, 9),  -- David: Cocina, Viajes, Naturaleza
    (5, 6), (5, 8), (5, 3);  -- Laura: Lectura, Tecnología, Cine

-- Matches de ejemplo
INSERT INTO matches (user1_id, user2_id) VALUES 
    (1, 2),
    (1, 4),
    (2, 3),
    (3, 5);

-- Conversaciones de ejemplo
INSERT INTO conversations (match_id) VALUES 
    (1), -- Ana y Carlos
    (2), -- Ana y David
    (3), -- Carlos y María
    (4); -- María y Laura

-- Mensajes de ejemplo
INSERT INTO messages (conversation_id, sender_id, content) VALUES 
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

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();