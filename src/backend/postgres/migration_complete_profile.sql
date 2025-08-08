-- Migración para agregar campos adicionales del perfil de usuario
-- Fecha: 2025-08-07

-- Agregar nuevas columnas a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS ubicacion VARCHAR(255),
ADD COLUMN IF NOT EXISTS trabajo VARCHAR(255),
ADD COLUMN IF NOT EXISTS educacion VARCHAR(255),
ADD COLUMN IF NOT EXISTS altura VARCHAR(10),
ADD COLUMN IF NOT EXISTS signo VARCHAR(20),
ADD COLUMN IF NOT EXISTS fumador VARCHAR(20) DEFAULT 'No',
ADD COLUMN IF NOT EXISTS bebe VARCHAR(30) DEFAULT 'No',
ADD COLUMN IF NOT EXISTS mascotas VARCHAR(500),
ADD COLUMN IF NOT EXISTS hijos VARCHAR(100) DEFAULT 'No tengo',
ADD COLUMN IF NOT EXISTS religion VARCHAR(100),
ADD COLUMN IF NOT EXISTS politica VARCHAR(100),
ADD COLUMN IF NOT EXISTS perfil_completado BOOLEAN DEFAULT FALSE;

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_ubicacion ON usuarios(ubicacion);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil_completado ON usuarios(perfil_completado);

-- Comentarios descriptivos
COMMENT ON COLUMN usuarios.ubicacion IS 'Ubicación del usuario (ciudad, país)';
COMMENT ON COLUMN usuarios.trabajo IS 'Profesión o trabajo del usuario';
COMMENT ON COLUMN usuarios.educacion IS 'Nivel educativo o institución';
COMMENT ON COLUMN usuarios.altura IS 'Altura del usuario (ej: 1.70m)';
COMMENT ON COLUMN usuarios.signo IS 'Signo zodiacal';
COMMENT ON COLUMN usuarios.fumador IS 'Hábito de fumar: No, Sí, Ocasionalmente';
COMMENT ON COLUMN usuarios.bebe IS 'Hábito de beber: No, Sí, Ocasionalmente, Socialmente';
COMMENT ON COLUMN usuarios.mascotas IS 'Información sobre mascotas';
COMMENT ON COLUMN usuarios.hijos IS 'Información sobre hijos';
COMMENT ON COLUMN usuarios.religion IS 'Orientación religiosa';
COMMENT ON COLUMN usuarios.politica IS 'Orientación política';
COMMENT ON COLUMN usuarios.perfil_completado IS 'Indica si el usuario completó su perfil después del registro';

-- Verificar la estructura de la tabla
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE 'Migración de perfil completada exitosamente. Nuevas columnas agregadas a la tabla usuarios.';
END $$;
