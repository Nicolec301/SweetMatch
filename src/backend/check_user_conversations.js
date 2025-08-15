const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sweetmatch',
  password: 'root123',
  port: 5432,
});

async function checkConversations() {
  try {
    console.log('🔍 Verificando estado de la base de datos...');
    
    // Ver qué tablas existen
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📊 Tablas en la base de datos:', tablesResult.rows);
    
    if (tablesResult.rows.length === 0) {
      console.log('❗ No hay tablas en la base de datos. Necesitas ejecutar las migraciones.');
      await pool.end();
      return;
    }
    
    // Solo si existe la tabla usuarios, buscar usuarios
    const hasUsers = tablesResult.rows.some(row => row.table_name === 'usuarios');
    if (hasUsers) {
      const userResult = await pool.query('SELECT id, nombre, email FROM usuarios WHERE id = 20');
      console.log('👤 Usuario 20:', userResult.rows);
      
      // Ver estructura de tabla matches
      const matchesColumns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'matches'
      `);
      console.log('🔧 Columnas de tabla matches:', matchesColumns.rows);
      
      // Ver estructura de tabla conversaciones
      const conversacionesColumns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'conversaciones'
      `);
      console.log('🔧 Columnas de tabla conversaciones:', conversacionesColumns.rows);
      
      // Buscar matches del usuario 20
      const matchesResult = await pool.query(`
        SELECT * FROM matches 
        WHERE usuario1_id = 20 OR usuario2_id = 20
      `);
      console.log('🎯 Matches del usuario 20:', matchesResult.rows);
      
      // Buscar conversaciones directamente
      const hasConversations = tablesResult.rows.some(row => row.table_name === 'conversaciones');
      if (hasConversations && matchesResult.rows.length > 0) {
        const matchIds = matchesResult.rows.map(m => m.id).join(',');
        const result = await pool.query(`
          SELECT c.*, m.usuario1_id, m.usuario2_id 
          FROM conversaciones c 
          JOIN matches m ON c.match_id = m.id
          WHERE c.match_id IN (${matchIds})
          ORDER BY c.created_at DESC
        `);
        console.log('💬 Conversaciones para usuario 20:', result.rows);
      } else {
        console.log('💬 Ver todas las conversaciones:', await pool.query('SELECT * FROM conversaciones LIMIT 3'));
      }
      
      // Ver todos los usuarios disponibles (primeros 10)
      const allUsers = await pool.query('SELECT id, nombre FROM usuarios ORDER BY id LIMIT 10');
      console.log('👥 Usuarios en la base de datos:', allUsers.rows);
    } else {
      console.log('⚠️  Tabla usuarios no existe');
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

checkConversations();
