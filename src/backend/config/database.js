// Configuración de conexión a PostgreSQL
const { Pool } = require('pg');
const { DB_CONFIG } = require('./index');

// Crear pool de conexiones
const pool = new Pool({
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
  database: DB_CONFIG.database,
  user: DB_CONFIG.user,
  password: DB_CONFIG.password,
  ssl: DB_CONFIG.ssl,
  max: DB_CONFIG.max,
  idleTimeoutMillis: DB_CONFIG.idleTimeoutMillis,
  connectionTimeoutMillis: DB_CONFIG.connectionTimeoutMillis,
});

// Evento de conexión exitosa
pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Conectado a PostgreSQL');
  }
});

// Evento de error
pool.on('error', (err) => {
  console.error('❌ Error en la conexión de PostgreSQL:', err);
  process.exit(-1);
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexión a base de datos exitosa:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    return false;
  }
};

// Función para ejecutar queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Query ejecutado:', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error en query:', error);
    throw error;
  }
};

// Función para obtener un cliente del pool
const getClient = async () => {
  return await pool.connect();
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};
