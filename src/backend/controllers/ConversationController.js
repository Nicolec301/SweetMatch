// Controlador de conversaciones
const ConversationModel = require('../models/Conversation');
const MessageModel = require('../models/Message');

class ConversationController {
  // Obtener conversaciones de un usuario
  async getUserConversations(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario es requerido'
        });
      }

      const result = await ConversationModel.getUserConversations(parseInt(userId));
      
      if (result.success) {
        // Agregar último mensaje a cada conversación
        const conversationsWithLastMessage = await Promise.all(
          result.data.map(async (conversation) => {
            const lastMessageResult = await MessageModel.getLastMessage(conversation.id);
            return {
              ...conversation,
              ultimo_mensaje: lastMessageResult.success ? lastMessageResult.data : null
            };
          })
        );

        res.json({
          success: true,
          data: conversationsWithLastMessage
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo conversaciones',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error obteniendo conversaciones:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear o obtener conversación entre dos usuarios
  async createOrGetConversation(req, res) {
    try {
      const { user1Id, user2Id } = req.body;
      
      if (!user1Id || !user2Id) {
        return res.status(400).json({
          success: false,
          message: 'IDs de usuarios son requeridos'
        });
      }

      if (user1Id === user2Id) {
        return res.status(400).json({
          success: false,
          message: 'No puedes crear conversación contigo mismo'
        });
      }

      const result = await ConversationModel.getOrCreateConversation(
        parseInt(user1Id), 
        parseInt(user2Id)
      );
      
      if (result.success) {
        res.json({
          success: true,
          message: result.created ? 'Conversación creada correctamente' : 'Conversación encontrada',
          data: result.data,
          created: result.created
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error creando/obteniendo conversación',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error creando/obteniendo conversación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener detalles de una conversación
  async getConversationDetails(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      
      if (!id || !userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de conversación y usuario son requeridos'
        });
      }

      // Verificar que el usuario pertenezca a la conversación
      const belongsResult = await ConversationModel.userBelongsToConversation(
        parseInt(id), 
        parseInt(userId)
      );

      if (!belongsResult.success || !belongsResult.belongs) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para acceder a esta conversación'
        });
      }

      const result = await ConversationModel.getConversationDetails(
        parseInt(id),
        parseInt(userId)
      );
      
      if (result.success && result.found) {
        res.json({
          success: true,
          data: result.data
        });
      } else if (result.success && !result.found) {
        res.status(404).json({
          success: false,
          message: 'Conversación no encontrada'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo detalles de conversación',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error obteniendo detalles de conversación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener conversación por ID
  async getConversationById(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario es requerido'
        });
      }

      // Verificar que el usuario pertenezca a la conversación
      const belongsResult = await ConversationModel.userBelongsToConversation(
        parseInt(id), 
        parseInt(userId)
      );

      if (!belongsResult.success || !belongsResult.belongs) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para acceder a esta conversación'
        });
      }

      const result = await ConversationModel.findById(parseInt(id));
      
      if (result.success && result.found) {
        res.json({
          success: true,
          data: result.data
        });
      } else if (result.success && !result.found) {
        res.status(404).json({
          success: false,
          message: 'Conversación no encontrada'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo conversación',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error obteniendo conversación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar conversación
  async deleteConversation(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario es requerido'
        });
      }

      // Verificar que el usuario pertenezca a la conversación
      const belongsResult = await ConversationModel.userBelongsToConversation(
        parseInt(id), 
        parseInt(userId)
      );

      if (!belongsResult.success || !belongsResult.belongs) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar esta conversación'
        });
      }

      const result = await ConversationModel.delete(parseInt(id));
      
      if (result.success && result.deleted) {
        res.json({
          success: true,
          message: 'Conversación eliminada correctamente'
        });
      } else if (result.success && !result.deleted) {
        res.status(404).json({
          success: false,
          message: 'Conversación no encontrada'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error eliminando conversación',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error eliminando conversación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new ConversationController();
