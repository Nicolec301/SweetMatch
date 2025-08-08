-- =============================================================
-- SweetMatch - Esquema Unificado (Tablas, Relaciones, Índices, Triggers)
-- Fecha: 2025-08-08
-- Uso: psql -U postgres -d sweetmatch -f schema_merged.sql
-- Idempotente: Usa IF NOT EXISTS y comprobaciones seguras
-- =============================================================

BEGIN;

-- ============================
-- Utilidades / Funciones
-- ============================
-- Función genérica para mantener updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================
-- Tabla: usuarios
-- ============================
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  edad INTEGER,
  descripcion TEXT,
  -- Detalles de perfil
  ubicacion VARCHAR(255),
  trabajo VARCHAR(255),
  educacion VARCHAR(255),
  altura VARCHAR(10),
  signo VARCHAR(20),
  fumador VARCHAR(20) DEFAULT 'No',
  bebe VARCHAR(30) DEFAULT 'No',
  mascotas TEXT,
  hijos TEXT DEFAULT 'No tengo',
  religion VARCHAR(100),
  politica VARCHAR(100),
  verificada BOOLEAN DEFAULT FALSE,
  perfil_completado BOOLEAN DEFAULT FALSE,
  -- Metadatos
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_ubicacion ON usuarios(ubicacion);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil_completado ON usuarios(perfil_completado);

-- ============================
-- Tabla: intereses
-- ============================
CREATE TABLE IF NOT EXISTS intereses (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL
);

-- ============================
-- Tabla pivote: usuario_intereses
-- ============================
CREATE TABLE IF NOT EXISTS usuario_intereses (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  interes_id INTEGER NOT NULL REFERENCES intereses(id) ON DELETE CASCADE,
  UNIQUE(usuario_id, interes_id)
);

-- ============================
-- Tabla: usuario_fotos
-- ============================
CREATE TABLE IF NOT EXISTS usuario_fotos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  es_principal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_usuario_fotos_usuario ON usuario_fotos(usuario_id);

-- ============================
-- Tabla: usuario_configuracion
-- ============================
CREATE TABLE IF NOT EXISTS usuario_configuracion (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  mostrar_edad BOOLEAN DEFAULT TRUE,
  mostrar_ubicacion BOOLEAN DEFAULT TRUE,
  mostrar_trabajo BOOLEAN DEFAULT TRUE,
  perfil_publico BOOLEAN DEFAULT TRUE,
  notificaciones BOOLEAN DEFAULT TRUE,
  mostrar_en_linea BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger updated_at para usuario_configuracion
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_usuario_configuracion_updated_at'
  ) THEN
    CREATE TRIGGER update_usuario_configuracion_updated_at
    BEFORE UPDATE ON usuario_configuracion
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================
-- Tabla: matches (parejas de usuarios)
-- ============================
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  usuario1_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  usuario2_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (usuario1_id <> usuario2_id)
);

-- Índices para búsqueda
CREATE INDEX IF NOT EXISTS idx_matches_usuario1 ON matches(usuario1_id);
CREATE INDEX IF NOT EXISTS idx_matches_usuario2 ON matches(usuario2_id);

-- Evitar duplicados de pareja usando índice por expresión (orden canónico)
CREATE UNIQUE INDEX IF NOT EXISTS uq_matches_pair
ON matches (
  LEAST(usuario1_id, usuario2_id),
  GREATEST(usuario1_id, usuario2_id)
);

-- ============================
-- Tabla: conversaciones (una por match)
-- ============================
CREATE TABLE IF NOT EXISTS conversaciones (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conversaciones_match_id ON conversaciones(match_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_updated_at ON conversaciones(updated_at);

-- Trigger updated_at para conversaciones
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_conversaciones_updated_at'
  ) THEN
    CREATE TRIGGER update_conversaciones_updated_at
    BEFORE UPDATE ON conversaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================
-- Tabla: mensajes
-- ============================
CREATE TABLE IF NOT EXISTS mensajes (
  id SERIAL PRIMARY KEY,
  conversacion_id INTEGER REFERENCES conversaciones(id) ON DELETE CASCADE,
  remitente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_lectura TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mensajes_conversacion_id ON mensajes(conversacion_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_remitente_id ON mensajes(remitente_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_fecha_envio ON mensajes(fecha_envio);

-- Trigger: al insertar mensaje, actualizar updated_at de conversaciones
CREATE OR REPLACE FUNCTION actualizar_conversacion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversaciones
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.conversacion_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_actualizar_conversacion'
  ) THEN
    CREATE TRIGGER trigger_actualizar_conversacion
    AFTER INSERT ON mensajes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_conversacion_timestamp();
  END IF;
END $$;

-- ============================
-- Vista/Comprobaciones opcionales
-- ============================
-- Vista simple para conversaciones con emails
CREATE OR REPLACE VIEW vw_conversaciones_usuarios AS
SELECT c.id AS conversacion_id,
       m.id AS match_id,
       u1.id AS usuario1_id,
       u1.email AS usuario1_email,
       u2.id AS usuario2_id,
       u2.email AS usuario2_email,
       c.created_at,
       c.updated_at
FROM conversaciones c
JOIN matches m ON m.id = c.match_id
JOIN usuarios u1 ON u1.id = m.usuario1_id
JOIN usuarios u2 ON u2.id = m.usuario2_id;

COMMIT;

-- Mensaje final
DO $$
BEGIN
  RAISE NOTICE '✅ Esquema unificado de SweetMatch aplicado correctamente.';
END $$;
