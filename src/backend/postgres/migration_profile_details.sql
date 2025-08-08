-- Migración para agregar campos de detalles de perfil
-- Ejecutar solo si ya tienes datos en la base de datos

-- Agregar nuevas columnas a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS trabajo VARCHAR(150),
ADD COLUMN IF NOT EXISTS educacion VARCHAR(150),
ADD COLUMN IF NOT EXISTS altura VARCHAR(20),
ADD COLUMN IF NOT EXISTS signo VARCHAR(20),
ADD COLUMN IF NOT EXISTS fumador VARCHAR(20),
ADD COLUMN IF NOT EXISTS bebe VARCHAR(30),
ADD COLUMN IF NOT EXISTS mascotas TEXT,
ADD COLUMN IF NOT EXISTS hijos TEXT,
ADD COLUMN IF NOT EXISTS religion VARCHAR(50),
ADD COLUMN IF NOT EXISTS politica VARCHAR(50),
ADD COLUMN IF NOT EXISTS verificada BOOLEAN DEFAULT FALSE;

-- Crear tabla de configuración si no existe
CREATE TABLE IF NOT EXISTS usuario_configuracion (
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

-- Crear índice para la nueva tabla
CREATE INDEX IF NOT EXISTS idx_usuario_configuracion_usuario_id ON usuario_configuracion(usuario_id);

-- Crear trigger para usuario_configuracion si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_usuario_configuracion_updated_at') THEN
        CREATE TRIGGER update_usuario_configuracion_updated_at BEFORE UPDATE ON usuario_configuracion
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Crear configuración por defecto para usuarios existentes que no la tengan
INSERT INTO usuario_configuracion (
    usuario_id, mostrar_edad, mostrar_ubicacion, mostrar_trabajo, 
    perfil_publico, notificaciones, mostrar_en_linea
)
SELECT 
    id, true, true, true, true, true, true
FROM usuarios 
WHERE id NOT IN (SELECT usuario_id FROM usuario_configuracion WHERE usuario_id IS NOT NULL);

-- Actualizar algunos datos de ejemplo para usuarios existentes (opcional)
UPDATE usuarios SET 
    trabajo = CASE 
        WHEN email = 'ana@example.com' THEN 'Diseñadora Gráfica'
        WHEN email = 'carlos@example.com' THEN 'Ingeniero de Software'
        WHEN email = 'maria@example.com' THEN 'Fotógrafa Freelance'
        WHEN email = 'david@example.com' THEN 'Chef Ejecutivo'
        WHEN email = 'laura@example.com' THEN 'Desarrolladora Full Stack'
        ELSE trabajo
    END,
    educacion = CASE 
        WHEN email = 'ana@example.com' THEN 'Universidad de Madrid'
        WHEN email = 'carlos@example.com' THEN 'Universidad Politécnica de Cataluña'
        WHEN email = 'maria@example.com' THEN 'Bellas Artes Universidad de Valencia'
        WHEN email = 'david@example.com' THEN 'Escuela de Hostelería de Sevilla'
        WHEN email = 'laura@example.com' THEN 'Universidad del País Vasco'
        ELSE educacion
    END,
    altura = CASE 
        WHEN email = 'ana@example.com' THEN '1.65m'
        WHEN email = 'carlos@example.com' THEN '1.78m'
        WHEN email = 'maria@example.com' THEN '1.62m'
        WHEN email = 'david@example.com' THEN '1.82m'
        WHEN email = 'laura@example.com' THEN '1.68m'
        ELSE altura
    END,
    signo = CASE 
        WHEN email = 'ana@example.com' THEN 'Leo'
        WHEN email = 'carlos@example.com' THEN 'Aries'
        WHEN email = 'maria@example.com' THEN 'Piscis'
        WHEN email = 'david@example.com' THEN 'Tauro'
        WHEN email = 'laura@example.com' THEN 'Virgo'
        ELSE signo
    END,
    fumador = 'No',
    bebe = CASE 
        WHEN email = 'ana@example.com' THEN 'Ocasionalmente'
        WHEN email = 'carlos@example.com' THEN 'Socialmente'
        WHEN email = 'maria@example.com' THEN 'Sí'
        WHEN email = 'david@example.com' THEN 'Ocasionalmente'
        WHEN email = 'laura@example.com' THEN 'No'
        ELSE bebe
    END,
    verificada = true
WHERE email IN ('ana@example.com', 'carlos@example.com', 'maria@example.com', 'david@example.com', 'laura@example.com');

COMMIT;
