const BaseModel = require('./BaseModel');

class InterestModel extends BaseModel {
  constructor() {
    super('intereses', ['id', 'nombre', 'descripcion']);
  }

  /**
   * Obtener todos los intereses ordenados por nombre
   * @returns {Object} Lista de intereses
   */
  async getAllInterests() {
    return await this.findAll({}, { 
      orderBy: 'nombre', 
      orderDirection: 'ASC' 
    });
  }

  /**
   * Buscar intereses por nombre
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Object} Lista de intereses encontrados
   */
  async searchInterests(searchTerm) {
    try {
      const query = `
        SELECT * FROM intereses 
        WHERE LOWER(nombre) LIKE LOWER($1) 
        ORDER BY nombre ASC
      `;
      
      return await this.customQuery(query, [`%${searchTerm}%`]);
    } catch (error) {
      console.error('Error buscando intereses:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener intereses de un usuario específico
   * @param {number} userId - ID del usuario
   * @returns {Object} Lista de intereses del usuario
   */
  async getUserInterests(userId) {
    try {
      const query = `
        SELECT i.id, i.nombre, i.descripcion
        FROM intereses i
        JOIN usuario_intereses ui ON i.id = ui.interes_id
        WHERE ui.usuario_id = $1
        ORDER BY i.nombre ASC
      `;
      
      return await this.customQuery(query, [userId]);
    } catch (error) {
      console.error('Error obteniendo intereses del usuario:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Agregar interés a un usuario
   * @param {number} userId - ID del usuario
   * @param {number} interestId - ID del interés
   * @returns {Object} Resultado de la operación
   */
  async addUserInterest(userId, interestId) {
    try {
      const query = `
        INSERT INTO usuario_intereses (usuario_id, interes_id)
        VALUES ($1, $2)
        ON CONFLICT (usuario_id, interes_id) DO NOTHING
        RETURNING *
      `;
      
      return await this.customQuery(query, [userId, interestId]);
    } catch (error) {
      console.error('Error agregando interés al usuario:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remover interés de un usuario
   * @param {number} userId - ID del usuario
   * @param {number} interestId - ID del interés
   * @returns {Object} Resultado de la operación
   */
  async removeUserInterest(userId, interestId) {
    try {
      const query = `
        DELETE FROM usuario_intereses 
        WHERE usuario_id = $1 AND interes_id = $2
        RETURNING *
      `;
      
      return await this.customQuery(query, [userId, interestId]);
    } catch (error) {
      console.error('Error removiendo interés del usuario:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualizar intereses de un usuario (reemplaza todos los existentes)
   * @param {number} userId - ID del usuario
   * @param {Array} interestIds - Array de IDs de intereses
   * @returns {Object} Resultado de la operación
   */
  async updateUserInterests(userId, interestIds) {
    return await this.transaction(async (client) => {
      // Eliminar todos los intereses actuales del usuario
      await client.query('DELETE FROM usuario_intereses WHERE usuario_id = $1', [userId]);
      
      // Agregar los nuevos intereses
      for (const interestId of interestIds) {
        await client.query(
          'INSERT INTO usuario_intereses (usuario_id, interes_id) VALUES ($1, $2)',
          [userId, interestId]
        );
      }
      
      return { updated: true };
    });
  }
}

module.exports = new InterestModel();
