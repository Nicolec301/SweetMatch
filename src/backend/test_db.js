require('dotenv').config();
const pool = require('./config/database');

async function testDB() {
    try {
        const result = await pool.query('SELECT id, usuario_id, url_foto, es_principal FROM usuario_fotos ORDER BY id LIMIT 10');
        console.log('📸 Rutas de fotos en la base de datos:');
        result.rows.forEach(row => {
            console.log(`ID: ${row.id}, Usuario: ${row.usuario_id}, Ruta: "${row.url_foto}", Principal: ${row.es_principal}`);
        });
        
        console.log('\n🔍 Consultando conversaciones con fotos:');
        const convResult = await pool.query(`
            SELECT 
                c.id,
                u1.nombre as usuario1_nombre,
                u2.nombre as usuario2_nombre,
                uf1.url_foto as usuario1_foto,
                uf2.url_foto as usuario2_foto
            FROM conversaciones c
            JOIN matches m ON c.match_id = m.id
            JOIN usuarios u1 ON m.usuario1_id = u1.id
            JOIN usuarios u2 ON m.usuario2_id = u2.id
            LEFT JOIN usuario_fotos uf1 ON u1.id = uf1.usuario_id AND uf1.es_principal = true
            LEFT JOIN usuario_fotos uf2 ON u2.id = uf2.usuario_id AND uf2.es_principal = true
            LIMIT 5
        `);
        
        convResult.rows.forEach(row => {
            console.log(`Conversación ${row.id}: ${row.usuario1_nombre} (${row.usuario1_foto}) <-> ${row.usuario2_nombre} (${row.usuario2_foto})`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testDB();
