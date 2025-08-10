const BaseModel = require('./BaseModel');

class ConversationModel extends BaseModel {
  constructor() {
    super('conversaciones', [
      'id', 'match_id', 'created_at', 'updated_at'
    ]);
  }

  /**
   * Obtener conversaciones de un usuario específico
   * @param {number} userId - ID del usuario
   * @returns {Object} Lista de conversaciones
   */
  async getUserConversations(userId) {
    try {
      const query = `
        SELECT DISTINCT
          c.id,
          c.match_id,
          c.created_at,
          c.updated_at,
          -- Información del otro participante
          CASE 
            WHEN m.usuario1_id = $1 THEN u2.id
            ELSE u1.id
          END as otro_usuario_id,
          CASE 
            WHEN m.usuario1_id = $1 THEN u2.nombre
            ELSE u1.nombre
          END as otro_usuario_nombre,
          CASE 
            WHEN m.usuario1_id = $1 THEN uf2.url_foto
            ELSE uf1.url_foto
          END as otro_usuario_foto,
          -- Último mensaje
          (SELECT contenido FROM mensajes WHERE conversacion_id = c.id ORDER BY fecha_envio DESC LIMIT 1) as ultimo_mensaje,
          (SELECT fecha_envio FROM mensajes WHERE conversacion_id = c.id ORDER BY fecha_envio DESC LIMIT 1) as ultimo_mensaje_fecha
        FROM conversaciones c
        JOIN matches m ON c.match_id = m.id
        JOIN usuarios u1 ON m.usuario1_id = u1.id
        JOIN usuarios u2 ON m.usuario2_id = u2.id
        LEFT JOIN usuario_fotos uf1 ON u1.id = uf1.usuario_id AND uf1.es_principal = true
        LEFT JOIN usuario_fotos uf2 ON u2.id = uf2.usuario_id AND uf2.es_principal = true
        WHERE (m.usuario1_id = $1 OR m.usuario2_id = $1)
        ORDER BY c.updated_at DESC
      `;
      
      return await this.customQuery(query, [userId]);
    } catch (error) {
      console.error('Error obteniendo conversaciones del usuario:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Buscar conversación entre dos usuarios
   * @param {number} usuario1Id - ID del primer usuario
   * @param {number} usuario2Id - ID del segundo usuario
   * @returns {Object} Conversación encontrada
   */
  async findConversationBetweenUsers(usuario1Id, usuario2Id) {
    try {
      const query = `
        SELECT c.* FROM conversaciones c
        JOIN matches m ON c.match_id = m.id
        WHERE ((m.usuario1_id = $1 AND m.usuario2_id = $2) OR (m.usuario1_id = $2 AND m.usuario2_id = $1))
        LIMIT 1
      `;
      
      const result = await this.customQuery(query, [usuario1Id, usuario2Id]);
      
      return {
        success: result.success,
        data: result.success && result.data.length > 0 ? result.data[0] : null,
        error: result.error
      };
    } catch (error) {
      console.error('Error buscando conversación entre usuarios:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Crear conversación directa entre usuarios (sin necesidad de match)
   * @param {number} usuario1Id - ID del primer usuario
   * @param {number} usuario2Id - ID del segundo usuario
   * @returns {Object} Nueva conversación
   */
  async createDirectConversation(usuario1Id, usuario2Id) {
    return await this.transaction(async (client) => {
      try {
        // Primero verificar si ya existe conversación
        const existingConv = await this.findConversationBetweenUsers(usuario1Id, usuario2Id);
        if (existingConv.success && existingConv.data) {
          return existingConv;
        }

        // Crear o buscar match entre usuarios
        const MatchModel = require('./Match');
        let matchResult = await MatchModel.checkExistingMatch(usuario1Id, usuario2Id);
        
        let matchId;
        if (!matchResult.success || !matchResult.data) {
          // Crear un match temporal para la conversación
          const newMatch = await MatchModel.create({
            usuario1_id: usuario1Id,
            usuario2_id: usuario2Id
          });
          matchId = newMatch.success ? newMatch.data.id : null;
        } else {
          matchId = matchResult.data.id;
        }

        if (!matchId) {
          throw new Error('No se pudo crear o encontrar match para la conversación');
        }

        // Crear la conversación
        const conversationResult = await this.create({
          match_id: matchId
        });

        return conversationResult;
      } catch (error) {
        console.error('Error creando conversación directa:', error);
        return {
          success: false,
          error: error.message
        };
      }
    });
  }

  /**
   * Verificar si un usuario pertenece a una conversación
   * @param {number} conversationId - ID de la conversación
   * @param {number} userId - ID del usuario
   * @returns {Object} Resultado de la verificación
   */
  async userBelongsToConversation(conversationId, userId) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM conversaciones c
        JOIN matches m ON c.match_id = m.id
        WHERE c.id = $1 AND (m.usuario1_id = $2 OR m.usuario2_id = $2)
      `;
      
      const result = await this.customQuery(query, [conversationId, userId]);
      
      const count = result.success ? parseInt(result.data[0].count) : 0;
      
      return {
        success: result.success,
        belongs: count > 0,
        error: result.error
      };
    } catch (error) {
      console.error('Error verificando pertenencia a conversación:', error);
      return {
        success: false,
        belongs: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener o crear conversación entre usuarios
   * @param {number} usuario1Id - ID del primer usuario
   * @param {number} usuario2Id - ID del segundo usuario
   * @returns {Object} Conversación existente o nueva
   */
  async getOrCreateConversation(usuario1Id, usuario2Id) {
    try {
      // Buscar conversación existente
      const existing = await this.findConversationBetweenUsers(usuario1Id, usuario2Id);
      
      if (existing.success && existing.data) {
        return {
          success: true,
          data: existing.data,
          created: false
        };
      }

      // Crear nueva conversación
      const newConv = await this.createDirectConversation(usuario1Id, usuario2Id);
      
      return {
        success: newConv.success,
        data: newConv.data,
        created: newConv.success,
        error: newConv.error
      };
    } catch (error) {
      console.error('Error obteniendo/creando conversación:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ConversationModel();