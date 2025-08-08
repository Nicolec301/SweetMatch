// Script para inicializar la base de datos PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

// Conexión a la base de datos postgres por defecto para crear la BD
const defaultPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Usar base de datos por defecto
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Conexión a la base de datos sweetmatch una vez creada
const sweetmatchPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sweetmatch',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

const createDatabase = async () => {
  try {
    console.log('🔄 Creando base de datos sweetmatch...');
    await defaultPool.query('CREATE DATABASE sweetmatch');
    console.log('✅ Base de datos sweetmatch creada');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('ℹ️ La base de datos sweetmatch ya existe');
    } else {
      throw error;
    }
  } finally {
    await defaultPool.end();
  }
};

const createTables = async () => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    console.log('🔄 Ejecutando script SQL unificado (schema_merged.sql)...');

    // Intentar usar el esquema unificado; si no existe, fallback al antiguo
    const mergedPath = path.join(__dirname, 'src/backend/postgres/schema_merged.sql');
    const legacyPath = path.join(__dirname, 'src/backend/postgres/database_setup.sql');

    let sqlPathToUse = mergedPath;
    if (!fs.existsSync(mergedPath)) {
      console.warn('⚠️ schema_merged.sql no encontrado, usando database_setup.sql');
      sqlPathToUse = legacyPath;
    }

    // Leer el archivo SQL elegido
    const sqlScript = fs.readFileSync(sqlPathToUse, 'utf8');

    // Ejecutar el script SQL completo (idempotente)
    await sweetmatchPool.query(sqlScript);

    console.log('✅ Esquema de base de datos aplicado correctamente');

  } catch (error) {
    throw error;
  } finally {
    await sweetmatchPool.end();
  }
};

const initializeDatabase = async () => {
  try {
    console.log('🚀 Inicializando base de datos PostgreSQL...');
    await createDatabase();
    console.log('🔄 Creando tablas...');
    await createTables();
    console.log('🎉 Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
