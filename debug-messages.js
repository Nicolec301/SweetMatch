// Script temporal para debuggear mensajes
const pool = require('./src/backend/config/database');

async function debugMessages() {
  try {
    console.log('🔍 Debugging mensajes...');
    
    // Verificar mensajes existentes
    const mensajes = await pool.query(`
      SELECT id, conversacion_id, remitente_id, contenido, fecha_envio 
      FROM mensajes 
      ORDER BY id
    `);
    
    console.log('📨 Mensajes en la base de datos:');
    console.log(JSON.stringify(mensajes.rows, null, 2));
    
    // Insertar mensaje de prueba
    const insertResult = await pool.query(`
      INSERT INTO mensajes (conversacion_id, remitente_id, contenido, fecha_envio)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING *
    `, [7, 9, 'Mensaje de prueba directo']);
    
    console.log('✅ Mensaje insertado:');
    console.log(JSON.stringify(insertResult.rows[0], null, 2));
    
    // Verificar consulta de getMessagesByConversation
    const queryResult = await pool.query(`
      SELECT 
        m.*,
        u.nombre as remitente_nombre,
        CASE 
          WHEN m.fecha_lectura IS NOT NULL THEN true 
          ELSE false 
        END as leido
      FROM mensajes m
      JOIN usuarios u ON m.remitente_id = u.id
      WHERE m.conversacion_id = $1
      ORDER BY m.fecha_envio ASC
    `, [7]);
    
    console.log('🔍 Resultado de consulta para conversación 7:');
    console.log(JSON.stringify(queryResult.rows, null, 2));
    
  } catch (error) {
    console.error('💥 Error en debug:', error);
  } finally {
    process.exit(0);
  }
}

debugMessages();
