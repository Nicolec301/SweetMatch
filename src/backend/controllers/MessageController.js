// Controlador de mensajes
const MessageModel = require('../models/Message');
const ConversationModel = require('../models/Conversation');

class MessageController {
  // Obtener mensajes de una conversación
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
  const { page = 1, limit = 50, lastId } = req.query;
      
      console.log('📨 MessageController.getMessages called with:', { conversationId, page, limit });
      
      if (!conversationId) {
        return res.status(400).json({
          success: false,
          message: 'ID de conversación es requerido'
        });
      }

      // Si se proporciona lastId hacemos carga incremental y omitimos paginación clásica
      if (lastId) {
        console.log('🔄 Carga incremental solicitada desde ID:', lastId);
        const incResult = await MessageModel.getMessagesAfterId(
          parseInt(conversationId),
          parseInt(lastId),
          parseInt(limit)
        );
        console.log('📨 Incremental result:', JSON.stringify(incResult, null, 2));
        if (incResult.success) {
          return res.json({
            success: true,
            data: incResult.data,
            pagination: {
              page: 1,
              limit: parseInt(limit),
              total: incResult.count
            },
            incremental: true
          });
        } else {
          return res.status(500).json({ success: false, message: 'Error incremental', error: incResult.error });
        }
      }

      const offset = (page - 1) * limit;
      console.log('📊 Query params:', { conversationId: parseInt(conversationId), limit: parseInt(limit), offset });

      const result = await MessageModel.getMessagesByConversation(
        parseInt(conversationId),
        { limit: parseInt(limit), offset, latestOnly: page === 1 }
      );
      
      console.log('📨 MessageModel.getMessagesByConversation result:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        const responseData = {
          success: true,
          data: result.data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: result.count
          }
        };
        
        console.log('✅ Sending successful response:', JSON.stringify(responseData, null, 2));
        res.json(responseData);
      } else {
        console.log('❌ Database error:', result.error);
        res.status(500).json({
          success: false,
          message: 'Error obteniendo mensajes',
          error: result.error
        });
      }
    } catch (error) {
      console.error('💥 Error obteniendo mensajes:', error);
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
      
      console.log('🚀 MessageController.createMessage called with req.body:', JSON.stringify(req.body, null, 2));
      console.log('📝 Extracted values:', { conversacion_id, remitente_id, contenido });
      
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

      console.log('🔐 userBelongsToConversation result:', belongsResult);

      if (!belongsResult.success || !belongsResult.belongs) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para enviar mensajes en esta conversación'
        });
      }

      console.log('🎯 Calling MessageModel.createMessage with:', {
        conversacion_id: parseInt(conversacion_id),
        remitente_id: parseInt(remitente_id),
        contenido: contenido
      });

      const result = await MessageModel.createMessage(
        parseInt(conversacion_id),
        parseInt(remitente_id),
        contenido
      );
      
      if (result.success) {
        // Emitir evento en tiempo real
        try {
          const io = req.app.get('io');
          if (io) {
            const payload = {
              id: result.data?.id,
              conversacion_id: parseInt(conversacion_id),
              remitente_id: parseInt(remitente_id),
              contenido,
              fecha_envio: result.data?.fecha_envio || new Date(),
              remitente_nombre: result.data?.remitente_nombre,
              leido: false
            };
            io.to(`conversation:${conversacion_id}`).emit('message:new', payload);
            // Notificar a ambos participantes (para actualizar lista si no están en la sala)
            const participantQuery = `
              SELECT m.usuario1_id, m.usuario2_id
              FROM conversaciones c
              JOIN matches m ON c.match_id = m.id
              WHERE c.id = $1
              LIMIT 1
            `;
            const ConversationModel = require('../models/Conversation');
            const participantsRes = await ConversationModel.customQuery(participantQuery, [parseInt(conversacion_id)]);
            if (participantsRes.success && participantsRes.data[0]) {
              const { usuario1_id, usuario2_id } = participantsRes.data[0];
              const preview = contenido.slice(0, 60);
              const updatePayload = {
                conversacion_id: parseInt(conversacion_id),
                ultimo_mensaje: preview,
                ultimo_mensaje_fecha: payload.fecha_envio,
                remitente_id: parseInt(remitente_id)
              };
              io.to(`user:${usuario1_id}`).emit('conversation:update', updatePayload);
              io.to(`user:${usuario2_id}`).emit('conversation:update', updatePayload);
            }
          }
        } catch (emitErr) {
          console.error('⚠️ Error emitiendo evento socket:', emitErr.message);
        }
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
