-- Migración: Agregar campo ultima_actividad a la tabla usuarios
-- Fecha: 2025-08-13
-- Propósito: Permitir tracking de usuarios en línea

BEGIN;

-- Agregar columna ultima_actividad
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Crear índice para consultas de usuarios online
CREATE INDEX IF NOT EXISTS idx_usuarios_ultima_actividad ON usuarios(ultima_actividad);

-- Actualizar usuarios existentes con timestamp actual
UPDATE usuarios SET ultima_actividad = CURRENT_TIMESTAMP WHERE ultima_actividad IS NULL;

COMMIT;

-- Verificar migración
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name = 'ultima_actividad';
