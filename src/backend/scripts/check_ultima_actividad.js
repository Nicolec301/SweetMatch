// Script para verificar y agregar campo ultima_actividad
const db = require('../config/database');

async function checkAndAddUltimaActividad() {
  try {
    // Verificar si la columna ya existe
    const checkColumn = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='usuarios' AND column_name='ultima_actividad'
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('Campo ultima_actividad no existe. Agregando...');
      
      // Agregar la columna
      await db.query(`
        ALTER TABLE usuarios 
        ADD COLUMN ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      
      // Crear índice
      await db.query(`
        CREATE INDEX idx_usuarios_ultima_actividad 
        ON usuarios(ultima_actividad)
      `);
      
      // Actualizar usuarios existentes
      await db.query(`
        UPDATE usuarios 
        SET ultima_actividad = CURRENT_TIMESTAMP 
        WHERE ultima_actividad IS NULL
      `);
      
      console.log('✅ Campo ultima_actividad agregado exitosamente');
    } else {
      console.log('✅ Campo ultima_actividad ya existe');
    }
    
    // Mostrar estructura de la tabla
    const columns = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'usuarios'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Estructura actual de la tabla usuarios:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'YES' ? ' (nullable)' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.end();
  }
}

checkAndAddUltimaActividad();
