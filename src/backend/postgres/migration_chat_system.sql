-- Migración para crear tablas de conversaciones y mensajes
-- Ejecutar con: psql -U postgres -d sweetmatch -f migration_chat_system.sql

-- Crear tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversaciones (
    id SERIAL PRIMARY KEY,
    usuario1_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    usuario2_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT conversaciones_usuarios_diferentes CHECK (usuario1_id != usuario2_id),
    CONSTRAINT conversaciones_usuarios_unique UNIQUE (
        LEAST(usuario1_id, usuario2_id), 
        GREATEST(usuario1_id, usuario2_id)
    )
);

-- Crear tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes (
    id SERIAL PRIMARY KEY,
    conversacion_id INTEGER NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
    remitente_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    tipo VARCHAR(20) DEFAULT 'texto' CHECK (tipo IN ('texto', 'imagen', 'archivo'))
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario1 ON conversaciones(usuario1_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario2 ON conversaciones(usuario2_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_updated_at ON conversaciones(updated_at);

CREATE INDEX IF NOT EXISTS idx_mensajes_conversacion ON mensajes(conversacion_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_remitente ON mensajes(remitente_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_created_at ON mensajes(created_at);
CREATE INDEX IF NOT EXISTS idx_mensajes_leido ON mensajes(leido);

-- Función para actualizar updated_at en conversaciones
CREATE OR REPLACE FUNCTION actualizar_conversacion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversaciones 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.conversacion_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar timestamp de conversación al agregar mensajes
DROP TRIGGER IF EXISTS trigger_actualizar_conversacion ON mensajes;
CREATE TRIGGER trigger_actualizar_conversacion
    AFTER INSERT ON mensajes
    FOR EACH ROW
    EXECUTE PROCEDURE actualizar_conversacion_timestamp();

-- Insertar datos de ejemplo si no existen conversaciones
DO $$
DECLARE
    ana_id INTEGER;
    carlos_id INTEGER;
    sofia_id INTEGER;
    conv_id INTEGER;
BEGIN
    -- Obtener IDs de usuarios existentes
    SELECT id INTO ana_id FROM usuarios WHERE email = 'ana@example.com';
    SELECT id INTO carlos_id FROM usuarios WHERE email = 'carlos@example.com';
    SELECT id INTO sofia_id FROM usuarios WHERE email = 'sofia@example.com';
    
    -- Solo insertar si los usuarios existen y no hay conversaciones
    IF ana_id IS NOT NULL AND carlos_id IS NOT NULL AND sofia_id IS NOT NULL THEN
        
        -- Verificar si ya existen conversaciones
        IF NOT EXISTS (SELECT 1 FROM conversaciones LIMIT 1) THEN
            
            -- Conversación entre Ana y Carlos
            INSERT INTO conversaciones (usuario1_id, usuario2_id) 
            VALUES (LEAST(ana_id, carlos_id), GREATEST(ana_id, carlos_id))
            RETURNING id INTO conv_id;
            
            -- Mensajes de ejemplo para Ana y Carlos
            INSERT INTO mensajes (conversacion_id, remitente_id, contenido, created_at, leido) VALUES
            (conv_id, ana_id, '¡Hola Carlos! ¿Cómo va tu día?', CURRENT_TIMESTAMP - INTERVAL '2 hours', true),
            (conv_id, carlos_id, 'Hola Ana! Todo bien, acabo de terminar el trabajo. ¿Y el tuyo?', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes', true),
            (conv_id, ana_id, '¡Genial! El mío también va muy bien. ¿Te gusta hacer ejercicio?', CURRENT_TIMESTAMP - INTERVAL '1 hour', true),
            (conv_id, carlos_id, 'Sí, me gusta mucho! Voy al gimnasio 3 veces por semana', CURRENT_TIMESTAMP - INTERVAL '30 minutes', false);
            
            -- Conversación entre Ana y Sofía
            INSERT INTO conversaciones (usuario1_id, usuario2_id) 
            VALUES (LEAST(ana_id, sofia_id), GREATEST(ana_id, sofia_id))
            RETURNING id INTO conv_id;
            
            -- Mensajes de ejemplo para Ana y Sofía
            INSERT INTO mensajes (conversacion_id, remitente_id, contenido, created_at, leido) VALUES
            (conv_id, sofia_id, 'Hey Ana! ¿Cómo va todo?', CURRENT_TIMESTAMP - INTERVAL '3 hours', true),
            (conv_id, ana_id, 'Todo bien Sofía, ¿y tú qué tal?', CURRENT_TIMESTAMP - INTERVAL '2 hours 45 minutes', true),
            (conv_id, sofia_id, '¿Te gustaría salir este fin de semana?', CURRENT_TIMESTAMP - INTERVAL '10 minutes', false);
            
            RAISE NOTICE 'Conversaciones y mensajes de ejemplo creados exitosamente';
        ELSE
            RAISE NOTICE 'Las conversaciones ya existen, no se insertaron datos de ejemplo';
        END IF;
    ELSE
        RAISE NOTICE 'No se encontraron todos los usuarios necesarios para crear conversaciones de ejemplo';
    END IF;
END $$;

-- Verificar la creación
SELECT 
    c.id,
    u1.nombre as usuario1,
    u2.nombre as usuario2,
    c.created_at,
    (SELECT COUNT(*) FROM mensajes WHERE conversacion_id = c.id) as total_mensajes
FROM conversaciones c
JOIN usuarios u1 ON c.usuario1_id = u1.id
JOIN usuarios u2 ON c.usuario2_id = u2.id
ORDER BY c.created_at DESC;

RAISE NOTICE 'Sistema de chat creado exitosamente';
