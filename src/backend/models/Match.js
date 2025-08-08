const BaseModel = require('./BaseModel');

class MatchModel extends BaseModel {
  constructor() {
    super('matches', [
      'id', 'usuario1_id', 'usuario2_id', 'fecha_match'
    ]);
  }

  /**
   * Obtener matches de un usuario específico
   * @param {number} userId - ID del usuario
   * @param {string} estado - Estado del match (opcional)
   * @returns {Object} Lista de matches
   */
  async getMatchesByUser(userId, estado = null) {
    try {
      const query = `
        SELECT 
          m.*,
          u1.nombre as usuario1_nombre,
          u1.edad as usuario1_edad,
          u2.nombre as usuario2_nombre,
          u2.edad as usuario2_edad
        FROM matches m
        JOIN usuarios u1 ON m.usuario1_id = u1.id
        JOIN usuarios u2 ON m.usuario2_id = u2.id
        WHERE (m.usuario1_id = $1 OR m.usuario2_id = $1)
        ORDER BY m.fecha_match DESC
      `;

      const params = [userId];
      
      return await this.customQuery(query, params);
    } catch (error) {
      console.error('Error obteniendo matches por usuario:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Crear un nuevo match entre dos usuarios
   * @param {number} usuario1Id - ID del primer usuario
   * @param {number} usuario2Id - ID del segundo usuario
   * @returns {Object} Resultado de la creación
   */
  async createMatch(usuario1Id, usuario2Id) {
    try {
      // Verificar que no exista ya un match entre estos usuarios
      const existingMatch = await this.findOne({
        usuario1_id: usuario1Id,
        usuario2_id: usuario2Id
      });

      const reverseMatch = await this.findOne({
        usuario1_id: usuario2Id,
        usuario2_id: usuario1Id
      });

      if (existingMatch.found || reverseMatch.found) {
        return {
          success: false,
          error: 'Ya existe un match entre estos usuarios'
        };
      }

      const matchData = {
        usuario1_id: usuario1Id,
        usuario2_id: usuario2Id,
        fecha_match: new Date()
      };

      return await this.create(matchData);
    } catch (error) {
      console.error('Error creando match:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar si existe un match mutuo entre dos usuarios
   * @param {number} usuario1Id - ID del primer usuario
   * @param {number} usuario2Id - ID del segundo usuario
   * @returns {Object} Resultado de la verificación
   */
  async checkMutualMatch(usuario1Id, usuario2Id) {
    try {
      const query = `
        SELECT COUNT(*) as count FROM matches 
        WHERE ((usuario1_id = $1 AND usuario2_id = $2) OR (usuario1_id = $2 AND usuario2_id = $1))
      `;
      
      const result = await this.customQuery(query, [usuario1Id, usuario2Id]);
      
      return {
        success: result.success,
        isMutual: result.success && result.data[0].count > 0,
        error: result.error
      };
    } catch (error) {
      console.error('Error verificando match mutuo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new MatchModel();
