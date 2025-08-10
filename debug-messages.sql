-- Script para verificar mensajes en las conversaciones
-- Verificar que existen conversaciones
SELECT * FROM conversaciones WHERE id IN (5, 6);

-- Verificar que existen mensajes en esas conversaciones
SELECT * FROM mensajes WHERE conversacion_id IN (5, 6);

-- Verificar datos completos con JOIN
SELECT 
  m.*,
  u.nombre as remitente_nombre,
  CASE 
    WHEN m.fecha_lectura IS NOT NULL THEN true 
    ELSE false 
  END as leido
FROM mensajes m
JOIN usuarios u ON m.remitente_id = u.id
WHERE m.conversacion_id IN (5, 6)
ORDER BY m.fecha_envio ASC;

-- Verificar información de las conversaciones
SELECT 
  c.id as conversacion_id,
  c.match_id,
  m.usuario1_id,
  m.usuario2_id,
  u1.nombre as usuario1_nombre,
  u2.nombre as usuario2_nombre
FROM conversaciones c
JOIN matches m ON c.match_id = m.id
JOIN usuarios u1 ON m.usuario1_id = u1.id
JOIN usuarios u2 ON m.usuario2_id = u2.id
WHERE c.id IN (5, 6);
