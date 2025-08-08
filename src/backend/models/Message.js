const BaseModel = require('./BaseModel');

class MessageModel extends BaseModel {
  constructor() {
    super('mensajes', [
      'id', 'conversacion_id', 'remitente_id', 'contenido', 'fecha_envio', 'fecha_lectura'
    ]);
  }

  /**
   * Obtener mensajes de una conversación específica
   * @param {number} conversationId - ID de la conversación
   * @param {Object} options - Opciones de paginación
   * @returns {Object} Lista de mensajes
   */
  async getMessagesByConversation(conversationId, options = {}) {
    try {
      const { limit = 50, offset = 0 } = options;
      
      const query = `
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
        LIMIT $2 OFFSET $3
      `;
      
      return await this.customQuery(query, [conversationId, limit, offset]);
    } catch (error) {
      console.error('Error obteniendo mensajes por conversación:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Crear un nuevo mensaje
   * @param {number} conversationId - ID de la conversación
   * @param {number} senderId - ID del remitente
   * @param {string} content - Contenido del mensaje
   * @returns {Object} Resultado de la creación
   */
  async createMessage(conversationId, senderId, content) {
    const messageData = {
      conversacion_id: conversationId,
      remitente_id: senderId,
      contenido: content,
      fecha_envio: new Date(),
      fecha_lectura: null
    };

    return await this.create(messageData);
  }

  /**
   * Marcar mensajes como leídos
   * @param {number} conversationId - ID de la conversación
   * @param {number} userId - ID del usuario que lee los mensajes
   * @returns {Object} Resultado de la actualización
   */
  async markAsRead(conversationId, userId) {
    try {
      const query = `
        UPDATE mensajes 
        SET fecha_lectura = CURRENT_TIMESTAMP
        WHERE conversacion_id = $1 AND remitente_id != $2 AND fecha_lectura IS NULL
        RETURNING *
      `;
      
      return await this.customQuery(query, [conversationId, userId]);
    } catch (error) {
      console.error('Error marcando mensajes como leídos:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener el último mensaje de una conversación
   * @param {number} conversationId - ID de la conversación
   * @returns {Object} Último mensaje
   */
  async getLastMessage(conversationId) {
    try {
      const query = `
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
        ORDER BY m.fecha_envio DESC
        LIMIT 1
      `;
      
      const result = await this.customQuery(query, [conversationId]);
      
      return {
        success: result.success,
        data: result.data && result.data[0] ? result.data[0] : null,
        error: result.error
      };
    } catch (error) {
      console.error('Error obteniendo último mensaje:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Contar mensajes no leídos por usuario
   * @param {number} userId - ID del usuario
   * @returns {Object} Conteo de mensajes no leídos
   */
  async getUnreadCount(userId) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM mensajes m
        JOIN conversaciones c ON m.conversacion_id = c.id
        JOIN matches mat ON c.match_id = mat.id
        WHERE (mat.usuario1_id = $1 OR mat.usuario2_id = $1)
        AND m.remitente_id != $1
        AND m.fecha_lectura IS NULL
      `;
      
      const result = await this.customQuery(query, [userId]);
      
      return {
        success: result.success,
        count: result.success ? parseInt(result.data[0].count) : 0,
        error: result.error
      };
    } catch (error) {
      console.error('Error contando mensajes no leídos:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new MessageModel();
