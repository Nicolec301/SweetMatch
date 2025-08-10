const { pool } = require('../config/database');

class BaseModel {
  constructor(tableName, fields = []) {
    this.tableName = tableName;
    this.fields = fields;
  }

  /**
   * Obtener todos los registros con filtros opcionales
   * @param {Object} filters - Filtros para WHERE clause
   * @param {Object} options - Opciones adicionales (limit, offset, orderBy)
   * @returns {Object} Resultado de la consulta
   */
  async findAll(filters = {}, options = {}) {
    try {
      let query = `SELECT * FROM ${this.tableName}`;
      const params = [];
      let paramIndex = 1;

      // Agregar filtros WHERE
      if (Object.keys(filters).length > 0) {
        const whereConditions = [];
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null) {
            whereConditions.push(`${key} = $${paramIndex}`);
            params.push(value);
            paramIndex++;
          }
        }
        if (whereConditions.length > 0) {
          query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
      }

      // Agregar ORDER BY
      if (options.orderBy) {
        query += ` ORDER BY ${options.orderBy}`;
        if (options.orderDirection) {
          query += ` ${options.orderDirection}`;
        }
      }

      // Agregar LIMIT y OFFSET
      if (options.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(options.limit);
        paramIndex++;
      }
      
      if (options.offset) {
        query += ` OFFSET $${paramIndex}`;
        params.push(options.offset);
      }

      console.log('Ejecutando query:', query, 'con parámetros:', params);
      const result = await pool.query(query, params);
      
      return {
        success: true,
        data: result.rows,
        count: result.rowCount
      };
    } catch (error) {
      console.error(`Error en findAll para ${this.tableName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener un registro por ID
   * @param {number} id - ID del registro
   * @returns {Object} Resultado de la consulta
   */
  async findById(id) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
      const result = await pool.query(query, [id]);
      
      return {
        success: true,
        data: result.rows[0] || null,
        found: result.rows.length > 0
      };
    } catch (error) {
      console.error(`Error en findById para ${this.tableName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Buscar un registro por condiciones
   * @param {Object} conditions - Condiciones de búsqueda
   * @returns {Object} Resultado de la consulta
   */
  async findOne(conditions) {
    try {
      const result = await this.findAll(conditions, { limit: 1 });
      return {
        success: result.success,
        data: result.data && result.data[0] ? result.data[0] : null,
        found: result.data && result.data.length > 0,
        error: result.error
      };
    } catch (error) {
      console.error(`Error en findOne para ${this.tableName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Crear un nuevo registro
   * @param {Object} data - Datos del nuevo registro
   * @returns {Object} Resultado de la inserción
   */
  async create(data) {
    try {
      console.log('🔍 BaseModel.create called with data:', JSON.stringify(data, null, 2));
      
      const fields = Object.keys(data).filter(key => data[key] !== undefined);
      console.log('🔍 Fields after undefined filter:', fields);
      
      const values = fields.map(key => data[key]);
      console.log('🔍 Values mapped:', values);
      
      const placeholders = fields.map((_, index) => `$${index + 1}`);
      
      const query = `
        INSERT INTO ${this.tableName} (${fields.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *
      `;
      
      console.log('Ejecutando insert:', query, 'con valores:', values);
      const result = await pool.query(query, values);
      
      return {
        success: true,
        data: result.rows[0],
        message: 'Registro creado correctamente'
      };
    } catch (error) {
      console.error(`Error en create para ${this.tableName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualizar un registro por ID
   * @param {number} id - ID del registro a actualizar
   * @param {Object} data - Datos a actualizar
   * @returns {Object} Resultado de la actualización
   */
  async update(id, data) {
    try {
      const fields = Object.keys(data).filter(key => data[key] !== undefined && key !== 'id');
      
      if (fields.length === 0) {
        return {
          success: false,
          error: 'No hay campos para actualizar'
        };
      }

      const setClause = fields.map((key, index) => `${key} = $${index + 2}`);
      const values = [id, ...fields.map(key => data[key])];
      
      const query = `
        UPDATE ${this.tableName} 
        SET ${setClause.join(', ')}
        WHERE id = $1
        RETURNING *
      `;
      
      console.log('Ejecutando update:', query, 'con valores:', values);
      const result = await pool.query(query, values);
      
      return {
        success: true,
        data: result.rows[0],
        updated: result.rowCount > 0,
        message: result.rowCount > 0 ? 'Registro actualizado correctamente' : 'Registro no encontrado'
      };
    } catch (error) {
      console.error(`Error en update para ${this.tableName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Eliminar un registro por ID
   * @param {number} id - ID del registro a eliminar
   * @returns {Object} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, [id]);
      
      return {
        success: true,
        data: result.rows[0],
        deleted: result.rowCount > 0,
        message: result.rowCount > 0 ? 'Registro eliminado correctamente' : 'Registro no encontrado'
      };
    } catch (error) {
      console.error(`Error en delete para ${this.tableName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Contar registros con filtros opcionales
   * @param {Object} filters - Filtros para WHERE clause
   * @returns {Object} Resultado del conteo
   */
  async count(filters = {}) {
    try {
      let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
      const params = [];
      let paramIndex = 1;

      if (Object.keys(filters).length > 0) {
        const whereConditions = [];
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null) {
            whereConditions.push(`${key} = $${paramIndex}`);
            params.push(value);
            paramIndex++;
          }
        }
        if (whereConditions.length > 0) {
          query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
      }

      const result = await pool.query(query, params);
      
      return {
        success: true,
        count: parseInt(result.rows[0].total)
      };
    } catch (error) {
      console.error(`Error en count para ${this.tableName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Ejecutar una consulta SQL personalizada
   * @param {string} query - Query SQL
   * @param {Array} params - Parámetros para la query
   * @returns {Object} Resultado de la consulta
   */
  async customQuery(query, params = []) {
    try {
      console.log('Ejecutando query personalizada:', query, 'con parámetros:', params);
      const result = await pool.query(query, params);
      
      return {
        success: true,
        data: result.rows,
        count: result.rowCount
      };
    } catch (error) {
      console.error('Error en customQuery:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Ejecutar transacción
   * @param {Function} callback - Función que contiene las operaciones de la transacción
   * @returns {Object} Resultado de la transacción
   */
  async transaction(callback) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return {
        success: true,
        data: result
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en transacción:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  }
}

module.exports = BaseModel;
