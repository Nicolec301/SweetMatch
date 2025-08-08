// Servicio para el manejo del chat y mensajería
import ApiService from './ApiService';
import SessionManager from './sessionUtils';

class ChatService {
  constructor() {
    this.apiService = ApiService;
    this.sessionManager = SessionManager;
  }

  /**
   * Obtener todas las conversaciones del usuario actual
   */
  async getUserConversations() {
    try {
      const currentUser = this.sessionManager.getCurrentUser();
      if (!currentUser?.id) {
        throw new Error('Usuario no autenticado');
      }

      const response = await this.apiService.getUserConversations(currentUser.id);
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('Error obteniendo conversaciones:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener conversaciones'
      };
    }
  }

  /**
   * Obtener mensajes de una conversación específica
   */
  async getConversationMessages(conversationId, page = 1, limit = 50) {
    try {
      if (!conversationId) {
        throw new Error('ID de conversación requerido');
      }

      const response = await this.apiService.getMessages(conversationId, page, limit);
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination
      };
    } catch (error) {
      console.error('Error obteniendo mensajes:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener mensajes'
      };
    }
  }

  /**
   * Enviar un mensaje
   */
  async sendMessage(conversationId, contenido) {
    try {
      const currentUser = this.sessionManager.getCurrentUser();
      if (!currentUser?.id) {
        throw new Error('Usuario no autenticado');
      }

      if (!conversationId || !contenido?.trim()) {
        throw new Error('Conversación y contenido requeridos');
      }

      const messageData = {
        conversacion_id: parseInt(conversationId),
        remitente_id: currentUser.id,
        contenido: contenido.trim()
      };

      const response = await this.apiService.sendMessage(messageData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      return {
        success: false,
        error: error.message || 'Error al enviar mensaje'
      };
    }
  }

  /**
   * Marcar mensajes como leídos
   */
  async markAsRead(conversationId) {
    try {
      const currentUser = this.sessionManager.getCurrentUser();
      if (!currentUser?.id) {
        throw new Error('Usuario no autenticado');
      }

      if (!conversationId) {
        throw new Error('ID de conversación requerido');
      }

      const response = await this.apiService.markMessagesAsRead(conversationId, currentUser.id);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error marcando mensajes como leídos:', error);
      return {
        success: false,
        error: error.message || 'Error al marcar como leído'
      };
    }
  }

  /**
   * Obtener conteo de mensajes no leídos
   */
  async getUnreadCount() {
    try {
      const currentUser = this.sessionManager.getCurrentUser();
      if (!currentUser?.id) {
        return { success: true, count: 0 };
      }

      const response = await this.apiService.getUnreadCount(currentUser.id);
      return {
        success: true,
        count: response.data?.unreadCount || 0
      };
    } catch (error) {
      console.error('Error obteniendo conteo no leídos:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener conteo',
        count: 0
      };
    }
  }

  /**
   * Crear o obtener conversación entre dos usuarios
   */
  async createOrGetConversation(otherUserId) {
    try {
      const currentUser = this.sessionManager.getCurrentUser();
      if (!currentUser?.id) {
        throw new Error('Usuario no autenticado');
      }

      if (!otherUserId) {
        throw new Error('ID del otro usuario requerido');
      }

      const response = await this.apiService.createOrGetConversation(
        currentUser.id,
        otherUserId
      );
      
      return {
        success: true,
        data: response.data,
        created: response.created
      };
    } catch (error) {
      console.error('Error creando/obteniendo conversación:', error);
      return {
        success: false,
        error: error.message || 'Error al crear conversación'
      };
    }
  }

  /**
   * Formatear mensaje para mostrar en el chat
   */
  formatMessageForDisplay(message, currentUserId) {
    if (!message) return null;

    return {
      id: message.id,
      contenido: message.contenido,
      hora: this.formatTime(message.fecha_envio),
      remitente: message.remitente_id === currentUserId,
      emisor: message.remitente_id === currentUserId ? 'Tú' : message.remitente_nombre,
      leido: message.leido || false,
      tipo: 'texto'
    };
  }

  /**
   * Formatear conversación para mostrar en la lista
   */
  formatConversationForDisplay(conversation, currentUserId) {
    if (!conversation) return null;

    // Determinar el otro usuario en la conversación
    const otherUser = conversation.usuario1_id === currentUserId 
      ? {
          id: conversation.usuario2_id,
          nombre: conversation.otro_usuario_nombre,
          imagen: conversation.otro_usuario_imagen || '/images/default-avatar.png'
        }
      : {
          id: conversation.otro_usuario_id,
          nombre: conversation.otro_usuario_nombre,
          imagen: conversation.otro_usuario_imagen || '/images/default-avatar.png'
        };

    return {
      id: conversation.id,
      nombre: otherUser.nombre,
      imagen: otherUser.imagen,
      vista_previa: conversation.ultimo_mensaje?.contenido || 'Nueva conversación',
      tiempo_indicador: this.getTimeIndicator(conversation.ultimo_mensaje?.fecha_envio || conversation.updated_at),
      ultima_actividad: 'En línea', // Esto se puede mejorar con estado real
      mensajes: [] // Los mensajes se cargarán por separado
    };
  }

  /**
   * Formatear hora para mostrar
   */
  formatTime(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * Obtener indicador de tiempo relativo
   */
  getTimeIndicator(dateString) {
    if (!dateString) return '';
    
    const now = new Date();
    const messageDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);
    
    if (diffInSeconds < 60) return 'Ahora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  }
}

// Exportar instancia única
const chatService = new ChatService();
export default chatService;
