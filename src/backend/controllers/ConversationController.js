// Controlador de conversaciones
const ConversationModel = require('../models/Conversation');
const UserPhotoModel = require('../models/UserPhoto');

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
        // El modelo ya devuelve ultimo_mensaje (string) y ultimo_mensaje_fecha, además de otro_usuario_foto
        const conversations = result.data.map((conversation) => {
          // Si por algún motivo ultimo_mensaje viene como objeto, extraer su contenido/fecha.
          if (conversation && typeof conversation.ultimo_mensaje === 'object' && conversation.ultimo_mensaje !== null) {
            const objeto = conversation.ultimo_mensaje;
            return {
              ...conversation,
              ultimo_mensaje: objeto.contenido || '',
              ultimo_mensaje_fecha: objeto.fecha_envio || conversation.ultimo_mensaje_fecha || conversation.updated_at
            };
          }

          // El modelo ya incluye otro_usuario_foto directamente
          return conversation;
        });

        res.json({
          success: true,
          data: conversations
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
      const { participantId, user1Id, user2Id } = req.body;
      const currentUserId = req.user?.id || req.body.currentUserId; // Obtener del token de auth o body temporalmente
      
      // Manejar diferentes formatos de entrada
      const userId1 = user1Id || currentUserId;
      const userId2 = user2Id || participantId;
      
      if (!userId1 || !userId2) {
        return res.status(400).json({
          success: false,
          message: 'IDs de usuarios son requeridos'
        });
      }

      if (parseInt(userId1) === parseInt(userId2)) {
        return res.status(400).json({
          success: false,
          message: 'No puedes crear conversación contigo mismo'
        });
      }

      const result = await ConversationModel.getOrCreateConversation(
        parseInt(userId1), 
        parseInt(userId2)
      );
      
      if (result.success) {
        // Agregar fotos de los participantes
        const conversationData = result.data;
        
        // Obtener foto del usuario 1
        const user1PhotosResult = await UserPhotoModel.getUserPhotos(parseInt(userId1));
        if (user1PhotosResult.success && user1PhotosResult.data && user1PhotosResult.data.length > 0) {
          const user1Photo = user1PhotosResult.data.find(photo => photo.es_principal) || user1PhotosResult.data[0];
          conversationData.user1_foto = user1Photo.url_foto;
        } else {
          conversationData.user1_foto = null;
        }

        // Obtener foto del usuario 2
        const user2PhotosResult = await UserPhotoModel.getUserPhotos(parseInt(userId2));
        if (user2PhotosResult.success && user2PhotosResult.data && user2PhotosResult.data.length > 0) {
          const user2Photo = user2PhotosResult.data.find(photo => photo.es_principal) || user2PhotosResult.data[0];
          conversationData.user2_foto = user2Photo.url_foto;
        } else {
          conversationData.user2_foto = null;
        }

        res.json({
          success: true,
          message: result.created ? 'Conversación creada correctamente' : 'Conversación encontrada',
          data: conversationData,
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
        // Obtener fotos de los participantes
        const conversationData = result.data;
        
        // Obtener foto del usuario actual
        const currentUserPhotosResult = await UserPhotoModel.getUserPhotos(parseInt(userId));
        if (currentUserPhotosResult.success && currentUserPhotosResult.data && currentUserPhotosResult.data.length > 0) {
          const currentUserPhoto = currentUserPhotosResult.data.find(photo => photo.es_principal) || currentUserPhotosResult.data[0];
          conversationData.current_user_foto = currentUserPhoto.url_foto;
        } else {
          conversationData.current_user_foto = null;
        }

        // Obtener foto del otro participante
        if (conversationData.otro_participante_id) {
          const otherUserPhotosResult = await UserPhotoModel.getUserPhotos(conversationData.otro_participante_id);
          if (otherUserPhotosResult.success && otherUserPhotosResult.data && otherUserPhotosResult.data.length > 0) {
            const otherUserPhoto = otherUserPhotosResult.data.find(photo => photo.es_principal) || otherUserPhotosResult.data[0];
            conversationData.otro_participante_foto = otherUserPhoto.url_foto;
          } else {
            conversationData.otro_participante_foto = null;
          }
        }

        res.json({
          success: true,
          data: conversationData
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
