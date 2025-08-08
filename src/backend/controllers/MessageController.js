// Controlador de mensajes
const MessageModel = require('../models/Message');
const ConversationModel = require('../models/Conversation');

class MessageController {
  // Obtener mensajes de una conversación
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      
      if (!conversationId) {
        return res.status(400).json({
          success: false,
          message: 'ID de conversación es requerido'
        });
      }

      const offset = (page - 1) * limit;
      const result = await MessageModel.getMessagesByConversation(
        parseInt(conversationId),
        { limit: parseInt(limit), offset }
      );
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: result.count
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo mensajes',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error obteniendo mensajes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear nuevo mensaje
  async createMessage(req, res) {
    try {
      const { conversacion_id, remitente_id, contenido } = req.body;
      
      if (!conversacion_id || !remitente_id || !contenido) {
        return res.status(400).json({
          success: false,
          message: 'ID de conversación, remitente y contenido son requeridos'
        });
      }

      // Verificar que el usuario pertenezca a la conversación
      const belongsResult = await ConversationModel.userBelongsToConversation(
        parseInt(conversacion_id), 
        parseInt(remitente_id)
      );

      if (!belongsResult.success || !belongsResult.belongs) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para enviar mensajes en esta conversación'
        });
      }

      const result = await MessageModel.createMessage(
        parseInt(conversacion_id),
        parseInt(remitente_id),
        contenido
      );
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Mensaje enviado correctamente',
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error enviando mensaje',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error creando mensaje:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Enviar mensaje (alias para createMessage)
  async sendMessage(req, res) {
    return await this.createMessage(req, res);
  }

  // Marcar mensajes como leídos
  async markAsRead(req, res) {
    try {
      const { conversationId } = req.params;
      const { userId } = req.body;
      
      if (!conversationId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de conversación y usuario son requeridos'
        });
      }

      const result = await MessageModel.markAsRead(
        parseInt(conversationId),
        parseInt(userId)
      );
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Mensajes marcados como leídos',
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error marcando mensajes como leídos',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error marcando mensajes como leídos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener conteo de mensajes no leídos
  async getUnreadCount(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario es requerido'
        });
      }

      const result = await MessageModel.getUnreadCount(parseInt(userId));
      
      if (result.success) {
        res.json({
          success: true,
          data: {
            unreadCount: result.count
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo conteo de mensajes no leídos',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error obteniendo conteo de mensajes no leídos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener mensaje por ID
  async getMessageById(req, res) {
    try {
      const { id } = req.params;
      
      const result = await MessageModel.findById(parseInt(id));
      
      if (result.success && result.found) {
        res.json({
          success: true,
          data: result.data
        });
      } else if (result.success && !result.found) {
        res.status(404).json({
          success: false,
          message: 'Mensaje no encontrado'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo mensaje',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error obteniendo mensaje:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar mensaje
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      
      const result = await MessageModel.delete(parseInt(id));
      
      if (result.success && result.deleted) {
        res.json({
          success: true,
          message: 'Mensaje eliminado correctamente'
        });
      } else if (result.success && !result.deleted) {
        res.status(404).json({
          success: false,
          message: 'Mensaje no encontrado'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error eliminando mensaje',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error eliminando mensaje:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new MessageController();
