-- Script para insertar mensajes de prueba en las conversaciones existentes

-- Insertar mensajes en conversación 5
INSERT INTO mensajes (conversacion_id, remitente_id, contenido, fecha_envio, fecha_lectura) VALUES
(5, 2, '¡Hola! ¿Cómo estás?', NOW() - INTERVAL '2 hours', NULL),
(5, 7, 'Muy bien, gracias. ¿Y tú?', NOW() - INTERVAL '90 minutes', NOW() - INTERVAL '80 minutes'),
(5, 2, 'Genial! Me alegra escuchar eso', NOW() - INTERVAL '75 minutes', NULL),
(5, 7, '¿Te gustaría quedar para tomar un café?', NOW() - INTERVAL '60 minutes', NULL),
(5, 2, '¡Me encantaría! ¿Cuándo te viene bien?', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '40 minutes');

-- Insertar mensajes en conversación 6  
INSERT INTO mensajes (conversacion_id, remitente_id, contenido, fecha_envio, fecha_lectura) VALUES
(6, 3, 'Hey! Vi tu perfil y me parece interesante', NOW() - INTERVAL '3 hours', NULL),
(6, 7, '¡Hola! Gracias, el tuyo también me llamó la atención', NOW() - INTERVAL '150 minutes', NOW() - INTERVAL '140 minutes'),
(6, 3, '¿Qué tipo de música te gusta?', NOW() - INTERVAL '120 minutes', NULL),
(6, 7, 'Me gusta mucho el rock y el pop. ¿Y a ti?', NOW() - INTERVAL '105 minutes', NOW() - INTERVAL '90 minutes'),
(6, 3, 'También me gusta el rock! ¿Has ido a algún concierto últimamente?', NOW() - INTERVAL '90 minutes', NULL);

-- Verificar que los mensajes se insertaron correctamente
SELECT 
  m.id,
  m.conversacion_id,
  m.contenido,
  m.fecha_envio,
  u.nombre as remitente_nombre
FROM mensajes m
JOIN usuarios u ON m.remitente_id = u.id
WHERE m.conversacion_id IN (5, 6)
ORDER BY m.conversacion_id, m.fecha_envio;
