-- Script para insertar mensaje de prueba con conversacion_id
-- Verificar datos existentes
SELECT 'CONVERSACIONES EXISTENTES' as info;
SELECT id, match_id, created_at FROM conversaciones ORDER BY id;

SELECT 'MENSAJES ACTUALES' as info;
SELECT id, conversacion_id, remitente_id, contenido FROM mensajes ORDER BY id;

-- Insertar mensaje de prueba para conversación 7
INSERT INTO mensajes (conversacion_id, remitente_id, contenido, fecha_envio)
VALUES (7, 9, 'Mensaje de prueba desde SQL', CURRENT_TIMESTAMP);

-- Verificar que se insertó correctamente
SELECT 'MENSAJE INSERTADO' as info;
SELECT * FROM mensajes WHERE conversacion_id = 7 ORDER BY fecha_envio DESC LIMIT 1;

-- Probar la consulta que usa getMessagesByConversation
SELECT 'CONSULTA DE VERIFICACIÓN' as info;
SELECT 
  m.*,
  u.nombre as remitente_nombre,
  CASE 
    WHEN m.fecha_lectura IS NOT NULL THEN true 
    ELSE false 
  END as leido
FROM mensajes m
JOIN usuarios u ON m.remitente_id = u.id
WHERE m.conversacion_id = 7
ORDER BY m.fecha_envio ASC;
