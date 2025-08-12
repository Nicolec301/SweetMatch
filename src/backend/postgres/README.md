# 🐘 PostgreSQL - Base de Datos de SweetMatch

Esta carpeta contiene los scripts SQL, configuraciones y documentación de la base de datos PostgreSQL que alimenta la aplicación SweetMatch.

## 📁 Estructura de PostgreSQL

```
postgres/
└── 📄 sweetmatch_database_complete.sql    # Script completo de creación de BD
```

---

## 🗄️ sweetmatch_database_complete.sql

**Propósito**: Script SQL completo que contiene toda la estructura de base de datos de SweetMatch, incluyendo tablas, índices, triggers, funciones y datos iniciales.

### **Extensiones PostgreSQL utilizadas**:

```sql
-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- Para generación de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- Para funciones de encriptación
CREATE EXTENSION IF NOT EXISTS "postgis";       -- Para datos geoespaciales
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- Para búsqueda de texto difuso
CREATE EXTENSION IF NOT EXISTS "unaccent";      -- Para búsqueda sin acentos
```

---

## 📊 Esquema de Base de Datos

### **Diagrama Entidad-Relación**:
```
┌─────────────┐       ┌─────────────────┐       ┌──────────────┐
│   USERS     │◄──────┤  USER_PHOTOS    │       │  INTERESTS   │
│             │ 1:N   │                 │       │              │
│ • id (PK)   │       │ • id (PK)       │       │ • id (PK)    │
│ • email     │       │ • user_id (FK)  │       │ • nombre     │
│ • nombre    │       │ • url           │       │ • categoria  │
│ • edad      │       │ • es_principal  │       │ • popularidad│
│ • genero    │       └─────────────────┘       └──────────────┘
│ • ubicacion │                                        ▲
│ • activo    │                                        │ N:M
└─────────────┘                                        │
       ▲                                        ┌──────────────┐
       │ N:M                                   │USER_INTERESTS│
       │                                       │              │
┌─────────────┐       ┌─────────────────┐     │ • user_id    │
│   MATCHES   │       │ CONVERSATIONS   │     │ • interest_id│
│             │       │                 │     └──────────────┘
│ • id (PK)   │       │ • id (PK)       │
│ • user_id   │       │ • participant1  │
│ • target_id │       │ • participant2  │
│ • action    │       │ • created_at    │
│ • status    │       └─────────────────┘
│ • created_at│               ▲
└─────────────┘               │ 1:N
                               │
                        ┌─────────────────┐
                        │    MESSAGES     │
                        │                 │
                        │ • id (PK)       │
                        │ • conversation  │
                        │ • sender_id     │
                        │ • content       │
                        │ • read_at       │
                        │ • created_at    │
                        └─────────────────┘
```

---

## 🏗️ Estructura de Tablas

### **1. Tabla USERS** - Usuarios principales
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- NULL para Google OAuth
    google_id VARCHAR(255) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    fecha_nacimiento DATE NOT NULL,
    edad INTEGER GENERATED ALWAYS AS (
        DATE_PART('year', AGE(fecha_nacimiento))
    ) STORED,
    genero VARCHAR(20) NOT NULL CHECK (genero IN ('male', 'female', 'non-binary')),
    descripcion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Colombia',
    coordenadas GEOMETRY(POINT, 4326), -- WGS84 para GPS
    altura INTEGER CHECK (altura BETWEEN 120 AND 250), -- cm
    peso INTEGER CHECK (peso BETWEEN 40 AND 300), -- kg
    educacion VARCHAR(50),
    profesion VARCHAR(100),
    tipo_relacion VARCHAR(20) DEFAULT 'serious' 
        CHECK (tipo_relacion IN ('casual', 'serious', 'friendship')),
    estado_civil VARCHAR(20) DEFAULT 'single'
        CHECK (estado_civil IN ('single', 'divorced', 'widowed')),
    tiene_hijos BOOLEAN DEFAULT FALSE,
    quiere_hijos BOOLEAN,
    fuma BOOLEAN DEFAULT FALSE,
    bebe VARCHAR(20) DEFAULT 'socially' 
        CHECK (bebe IN ('never', 'socially', 'regularly')),
    religion VARCHAR(50),
    idiomas TEXT[], -- Array de idiomas: ['español', 'inglés']
    configuracion_privacidad JSONB DEFAULT '{
        "mostrar_edad": true,
        "mostrar_ubicacion": true,
        "mostrar_ultima_conexion": true,
        "permitir_mensajes": true
    }',
    configuracion_notificaciones JSONB DEFAULT '{
        "nuevos_matches": true,
        "nuevos_mensajes": true,
        "likes_recibidos": true,
        "recordatorios": true
    }',
    verificado BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    ultima_conexion TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Índices para optimización
CREATE INDEX idx_users_location ON users USING GIST(coordenadas);
CREATE INDEX idx_users_age ON users(edad) WHERE activo = true;
CREATE INDEX idx_users_gender ON users(genero) WHERE activo = true;
CREATE INDEX idx_users_active ON users(activo, deleted_at);
CREATE INDEX idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX idx_users_ultima_conexion ON users(ultima_conexion) WHERE activo = true;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### **2. Tabla USER_PHOTOS** - Fotos de usuarios
```sql
CREATE TABLE user_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    orden INTEGER DEFAULT 1 CHECK (orden BETWEEN 1 AND 6),
    tamaño_bytes INTEGER,
    width INTEGER,
    height INTEGER,
    formato VARCHAR(10) CHECK (formato IN ('jpeg', 'jpg', 'png', 'webp')),
    aprobada BOOLEAN DEFAULT TRUE, -- Para moderación futura
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Restricciones
CREATE UNIQUE INDEX idx_one_main_photo_per_user 
    ON user_photos(user_id) 
    WHERE es_principal = true AND deleted_at IS NULL;

CREATE INDEX idx_user_photos_user_orden ON user_photos(user_id, orden) 
    WHERE deleted_at IS NULL;

-- Máximo 6 fotos por usuario
CREATE OR REPLACE FUNCTION check_max_photos_per_user()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM user_photos 
        WHERE user_id = NEW.user_id AND deleted_at IS NULL) >= 6 THEN
        RAISE EXCEPTION 'Un usuario no puede tener más de 6 fotos';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_max_photos 
    BEFORE INSERT ON user_photos 
    FOR EACH ROW 
    EXECUTE FUNCTION check_max_photos_per_user();
```

### **3. Tabla INTERESTS** - Catálogo de intereses
```sql
CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descripcion TEXT,
    emoji VARCHAR(10), -- Emoji representativo
    popularidad INTEGER DEFAULT 0, -- Contador de uso
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Datos iniciales de intereses
INSERT INTO interests (nombre, categoria, emoji) VALUES
-- Deportes y Actividades
('Fútbol', 'deportes', '⚽'),
('Gimnasio', 'deportes', '💪'),
('Yoga', 'deportes', '🧘‍♀️'),
('Natación', 'deportes', '🏊‍♀️'),
('Ciclismo', 'deportes', '🚴‍♀️'),
('Correr', 'deportes', '🏃‍♀️'),
('Tenis', 'deportes', '🎾'),
('Básquetbol', 'deportes', '🏀'),
('Escalada', 'deportes', '🧗‍♀️'),
('Senderismo', 'deportes', '🥾'),

-- Música y Arte
('Música', 'arte', '🎵'),
('Guitarra', 'arte', '🎸'),
('Piano', 'arte', '🎹'),
('Pintura', 'arte', '🎨'),
('Fotografía', 'arte', '📸'),
('Baile', 'arte', '💃'),
('Teatro', 'arte', '🎭'),
('Escritura', 'arte', '✍️'),
('Canto', 'arte', '🎤'),

-- Entretenimiento
('Cine', 'entretenimiento', '🎬'),
('Series', 'entretenimiento', '📺'),
('Videojuegos', 'entretenimiento', '🎮'),
('Lectura', 'entretenimiento', '📚'),
('Anime', 'entretenimiento', '🈶'),
('Podcasts', 'entretenimiento', '🎧'),

-- Gastronomía
('Cocinar', 'gastronomia', '👨‍🍳'),
('Vino', 'gastronomia', '🍷'),
('Café', 'gastronomia', '☕'),
('Repostería', 'gastronomia', '🧁'),

-- Viajes y Aventura
('Viajar', 'viajes', '✈️'),
('Playa', 'viajes', '🏖️'),
('Montaña', 'viajes', '🏔️'),
('Camping', 'viajes', '🏕️'),
('Mochilero', 'viajes', '🎒'),

-- Tecnología y Ciencia
('Tecnología', 'tecnologia', '💻'),
('Programación', 'tecnologia', '👨‍💻'),
('Ciencia', 'ciencia', '🔬'),
('Astronomía', 'ciencia', '🔭'),

-- Vida Social
('Fiestas', 'social', '🎉'),
('Karaoke', 'social', '🎤'),
('Bares', 'social', '🍻'),
('Networking', 'social', '🤝');

CREATE INDEX idx_interests_categoria ON interests(categoria);
CREATE INDEX idx_interests_popularidad ON interests(popularidad DESC);
```

### **4. Tabla USER_INTERESTS** - Relación usuarios-intereses
```sql
CREATE TABLE user_interests (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, interest_id)
);

-- Trigger para actualizar popularidad
CREATE OR REPLACE FUNCTION update_interest_popularity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE interests SET popularidad = popularidad + 1 WHERE id = NEW.interest_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE interests SET popularidad = popularidad - 1 WHERE id = OLD.interest_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_interest_popularity 
    AFTER INSERT OR DELETE ON user_interests
    FOR EACH ROW 
    EXECUTE FUNCTION update_interest_popularity();
```

### **5. Tabla MATCHES** - Sistema de matches
```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL CHECK (action IN ('like', 'pass', 'super_like')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'unmatched')),
    matched_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Un usuario solo puede interactuar una vez con otro
    UNIQUE(user_id, target_user_id),
    
    -- Un usuario no puede hacer match consigo mismo
    CHECK (user_id != target_user_id)
);

CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_target_user_id ON matches(target_user_id);
CREATE INDEX idx_matches_status ON matches(status, matched_at);

-- Vista para matches mutuos
CREATE VIEW mutual_matches AS
SELECT 
    m1.user_id as user1_id,
    m1.target_user_id as user2_id,
    m1.matched_at,
    m1.created_at as match1_created,
    m2.created_at as match2_created
FROM matches m1
JOIN matches m2 ON m1.user_id = m2.target_user_id 
    AND m1.target_user_id = m2.user_id
WHERE m1.action = 'like' 
    AND m2.action = 'like' 
    AND m1.status = 'matched' 
    AND m2.status = 'matched';
```

### **6. Tabla CONVERSATIONS** - Conversaciones
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    participant2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_from_match BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
    blocked_by UUID REFERENCES users(id), -- Quién bloqueó la conversación
    last_message_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    -- Una conversación única por par de usuarios
    UNIQUE(participant1_id, participant2_id),
    
    -- Los participantes no pueden ser el mismo usuario
    CHECK (participant1_id != participant2_id)
);

CREATE INDEX idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON conversations(participant2_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- Función para ordenar participantes (evitar duplicados A-B vs B-A)
CREATE OR REPLACE FUNCTION normalize_conversation_participants()
RETURNS TRIGGER AS $$
BEGIN
    -- Asegurar que participant1_id < participant2_id para evitar duplicados
    IF NEW.participant1_id > NEW.participant2_id THEN
        SELECT NEW.participant2_id, NEW.participant1_id 
        INTO NEW.participant1_id, NEW.participant2_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_normalize_participants 
    BEFORE INSERT OR UPDATE ON conversations
    FOR EACH ROW 
    EXECUTE FUNCTION normalize_conversation_participants();
```

### **7. Tabla MESSAGES** - Mensajes
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (LENGTH(content) <= 1000),
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'emoji', 'gif')),
    read_at TIMESTAMP NULL,
    edited_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_unread ON messages(conversation_id) WHERE read_at IS NULL;

-- Trigger para actualizar last_message_at en conversations
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET last_message_at = NEW.created_at, updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_message 
    AFTER INSERT ON messages
    FOR EACH ROW 
    EXECUTE FUNCTION update_conversation_last_message();
```

---

## 🔧 Funciones y Procedimientos Almacenados

### **Función de distancia entre usuarios**:
```sql
CREATE OR REPLACE FUNCTION calculate_distance_km(
    lat1 DOUBLE PRECISION, 
    lon1 DOUBLE PRECISION,
    lat2 DOUBLE PRECISION, 
    lon2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION AS $$
BEGIN
    -- Fórmula de Haversine
    RETURN (
        6371 * acos(
            cos(radians(lat1)) * 
            cos(radians(lat2)) * 
            cos(radians(lon2) - radians(lon1)) + 
            sin(radians(lat1)) * 
            sin(radians(lat2))
        )
    );
END;
$$ LANGUAGE plpgsql;
```

### **Función para obtener usuarios compatibles**:
```sql
CREATE OR REPLACE FUNCTION get_compatible_users(
    current_user_id UUID,
    max_distance_km INTEGER DEFAULT 50,
    min_age INTEGER DEFAULT 18,
    max_age INTEGER DEFAULT 99,
    limit_results INTEGER DEFAULT 20
)
RETURNS TABLE(
    user_id UUID,
    nombre VARCHAR(100),
    edad INTEGER,
    distance_km DOUBLE PRECISION,
    common_interests_count INTEGER,
    main_photo_url VARCHAR(500)
) AS $$
BEGIN
    RETURN QUERY
    WITH current_user AS (
        SELECT u.coordenadas, array_agg(ui.interest_id) as interests
        FROM users u
        LEFT JOIN user_interests ui ON u.id = ui.user_id
        WHERE u.id = current_user_id
        GROUP BY u.id, u.coordenadas
    ),
    already_interacted AS (
        SELECT target_user_id FROM matches WHERE user_id = current_user_id
    )
    SELECT 
        u.id,
        u.nombre,
        u.edad,
        ST_Distance(u.coordenadas, cu.coordenadas) / 1000 as distance_km,
        COALESCE(
            array_length(
                array_intersect(
                    array_agg(ui.interest_id), 
                    cu.interests
                )
            ), 
            0
        ) as common_interests_count,
        up.url as main_photo_url
    FROM users u
    CROSS JOIN current_user cu
    LEFT JOIN user_interests ui ON u.id = ui.user_id
    LEFT JOIN user_photos up ON u.id = up.user_id AND up.es_principal = true
    WHERE u.id != current_user_id
        AND u.activo = true
        AND u.deleted_at IS NULL
        AND u.edad BETWEEN min_age AND max_age
        AND ST_Distance(u.coordenadas, cu.coordenadas) / 1000 <= max_distance_km
        AND u.id NOT IN (SELECT target_user_id FROM already_interacted)
    GROUP BY u.id, u.nombre, u.edad, u.coordenadas, cu.coordenadas, up.url
    ORDER BY common_interests_count DESC, distance_km ASC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 Vistas Útiles

### **Vista de estadísticas de usuarios**:
```sql
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.nombre,
    u.edad,
    u.ultima_conexion,
    (SELECT COUNT(*) FROM matches WHERE user_id = u.id) as total_likes_given,
    (SELECT COUNT(*) FROM matches WHERE target_user_id = u.id AND action = 'like') as total_likes_received,
    (SELECT COUNT(*) FROM mutual_matches WHERE user1_id = u.id OR user2_id = u.id) as total_matches,
    (SELECT COUNT(*) FROM conversations WHERE participant1_id = u.id OR participant2_id = u.id) as total_conversations,
    (SELECT COUNT(*) FROM messages WHERE sender_id = u.id) as total_messages_sent,
    (SELECT COUNT(*) FROM user_photos WHERE user_id = u.id AND deleted_at IS NULL) as total_photos
FROM users u
WHERE u.activo = true AND u.deleted_at IS NULL;
```

### **Vista de actividad reciente**:
```sql
CREATE VIEW recent_activity AS
SELECT 
    'match' as activity_type,
    m.user_id as user_id,
    m.target_user_id as related_user_id,
    m.created_at,
    'Te gusta ' || u.nombre as description
FROM matches m
JOIN users u ON m.target_user_id = u.id
WHERE m.action = 'like' AND m.created_at > NOW() - INTERVAL '7 days'

UNION ALL

SELECT 
    'message' as activity_type,
    msg.sender_id as user_id,
    (CASE 
        WHEN c.participant1_id = msg.sender_id THEN c.participant2_id
        ELSE c.participant1_id
    END) as related_user_id,
    msg.created_at,
    'Nuevo mensaje de ' || u.nombre as description
FROM messages msg
JOIN conversations c ON msg.conversation_id = c.id
JOIN users u ON msg.sender_id = u.id
WHERE msg.created_at > NOW() - INTERVAL '7 days'

ORDER BY created_at DESC;
```

---

## 🚀 Optimizaciones de Performance

### **Particionado por fecha (para mensajes)**:
```sql
-- Crear tabla particionada para mensajes (ejemplo futuro)
CREATE TABLE messages_partitioned (
    LIKE messages INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Particiones por mes
CREATE TABLE messages_2025_01 PARTITION OF messages_partitioned
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE messages_2025_02 PARTITION OF messages_partitioned  
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

### **Índices especializados**:
```sql
-- Índice para búsqueda de texto en mensajes
CREATE INDEX idx_messages_content_search ON messages 
USING gin(to_tsvector('spanish', content))
WHERE deleted_at IS NULL;

-- Índice compuesto para matches activos
CREATE INDEX idx_active_matches ON matches(user_id, status, created_at)
WHERE status IN ('pending', 'matched');
```

---

## 📈 Mantenimiento y Monitoreo

### **Función de limpieza de datos antiguos**:
```sql
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
    -- Eliminar mensajes muy antiguos (más de 2 años)
    DELETE FROM messages 
    WHERE created_at < NOW() - INTERVAL '2 years' AND deleted_at IS NOT NULL;
    
    -- Limpiar matches de usuarios inactivos (más de 1 año sin conexión)
    DELETE FROM matches 
    WHERE user_id IN (
        SELECT id FROM users 
        WHERE ultima_conexion < NOW() - INTERVAL '1 year' AND activo = false
    );
    
    -- Actualizar estadísticas de tablas
    ANALYZE users, matches, messages, conversations;
    
    RAISE NOTICE 'Limpieza de datos completada';
END;
$$ LANGUAGE plpgsql;

-- Ejecutar limpieza mensualmente
SELECT cron.schedule('cleanup-old-data', '0 2 1 * *', 'SELECT cleanup_old_data();');
```

### **Vista de métricas de sistema**:
```sql
CREATE VIEW system_metrics AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE activo = true) as total_active_users,
    (SELECT COUNT(*) FROM users WHERE ultima_conexion > NOW() - INTERVAL '24 hours') as daily_active_users,
    (SELECT COUNT(*) FROM matches WHERE created_at > NOW() - INTERVAL '24 hours') as daily_matches,
    (SELECT COUNT(*) FROM messages WHERE created_at > NOW() - INTERVAL '24 hours') as daily_messages,
    (SELECT COUNT(*) FROM conversations WHERE status = 'active') as active_conversations,
    (SELECT AVG(edad) FROM users WHERE activo = true) as average_age,
    (SELECT mode() WITHIN GROUP (ORDER BY genero) FROM users WHERE activo = true) as most_common_gender;
```

---

*Esta base de datos PostgreSQL está diseñada para escalar con SweetMatch, proporcionando performance óptima, integridad referencial y funcionalidades avanzadas para una aplicación de dating moderna.*
