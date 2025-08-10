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
      const { limit = 50, offset = 0, latestOnly = false } = options;

      // Si latestOnly está activo ignoramos offset y siempre traemos los últimos N
      const effectiveOffset = latestOnly ? 0 : offset;

      // Estrategia: ordenar por id DESC (garantiza que el último insert siempre esté) y luego devolver ASC
      const query = `
        WITH ultimos AS (
          SELECT 
            m.*,
            u.nombre AS remitente_nombre,
            (m.fecha_lectura IS NOT NULL) AS leido
          FROM mensajes m
          JOIN usuarios u ON m.remitente_id = u.id
          WHERE m.conversacion_id = $1
          ORDER BY m.id DESC
          LIMIT $2 OFFSET $3
        )
        SELECT * FROM ultimos ORDER BY id ASC
      `;

      const result = await this.customQuery(query, [conversationId, limit, effectiveOffset]);

      // Conteo total para paginación (sin límite)
      let totalCount = result.count;
      try {
        const countRes = await this.customQuery('SELECT COUNT(*) AS total FROM mensajes WHERE conversacion_id = $1', [conversationId]);
        if (countRes.success && countRes.data[0]) {
          totalCount = parseInt(countRes.data[0].total, 10);
        }
      } catch (cErr) {
        console.error('⚠️ Error obteniendo conteo total de mensajes:', cErr.message);
      }

      return { ...result, count: totalCount };
    } catch (error) {
      console.error('Error obteniendo mensajes por conversación:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener mensajes posteriores a un ID (para actualización incremental)
   * @param {number} conversationId
   * @param {number} lastId - ID último mensaje que el cliente tiene
   * @param {number} limit - Máximo de mensajes a recuperar
   */
  async getMessagesAfterId(conversationId, lastId, limit = 50) {
    try {
      const query = `
        SELECT m.*, u.nombre AS remitente_nombre, (m.fecha_lectura IS NOT NULL) AS leido
        FROM mensajes m
        JOIN usuarios u ON m.remitente_id = u.id
        WHERE m.conversacion_id = $1 AND m.id > $2
        ORDER BY m.id ASC
        LIMIT $3
      `;
      const result = await this.customQuery(query, [conversationId, lastId, limit]);
      return { ...result, count: result.count };
    } catch (error) {
      console.error('Error obteniendo mensajes después de ID:', error);
      return { success: false, error: error.message };
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
    console.log('🔍 MessageModel.createMessage called with:');
    console.log('  conversationId:', conversationId, typeof conversationId);
    console.log('  senderId:', senderId, typeof senderId);
    console.log('  content:', content, typeof content);

    const messageData = {
      conversacion_id: conversationId,
      remitente_id: senderId,
      contenido: content,
      fecha_envio: new Date(),
      fecha_lectura: null
    };

    console.log('📦 messageData prepared:', JSON.stringify(messageData, null, 2));

    const result = await this.create(messageData);
    console.log('📨 create result:', JSON.stringify(result, null, 2));
    // Actualizar updated_at de la conversación para que aparezca arriba en listados
    if (result.success) {
      try {
        await this.customQuery('UPDATE conversaciones SET updated_at = NOW() WHERE id = $1', [conversationId]);
      } catch (e) {
        console.error('⚠️ No se pudo actualizar updated_at de la conversación:', e.message);
      }
    }
    
    return result;
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
