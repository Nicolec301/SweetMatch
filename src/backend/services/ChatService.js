// Servicio para el manejo del chat y mensajería
import ApiService from './ApiService';
import SessionManager from './SessionManager';

class ChatService {
  constructor() {
    this.apiService = ApiService;
    this.sessionManager = SessionManager.getInstance();
  }

  /**
   * Obtener todas las conversaciones del usuario actual
   */
  async getUserConversations() {
    try {
      console.log('👤 ChatService.getUserConversations called');
      const currentUser = this.sessionManager.getCurrentUser();
      console.log('👤 Usuario actual:', currentUser);
      
      if (!currentUser?.id) {
        throw new Error('Usuario no autenticado');
      }

      console.log('📡 Llamando a apiService.getUserConversations para usuario:', currentUser.id);
      const response = await this.apiService.getUserConversations(currentUser.id);
      console.log('📡 Respuesta de apiService.getUserConversations:', response);
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('💥 Error obteniendo conversaciones en ChatService:', error);
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
      console.log('🔗 ChatService.getConversationMessages called with:', { conversationId, page, limit });
      
      if (!conversationId) {
        throw new Error('ID de conversación requerido');
      }

      console.log('📡 Llamando a apiService.getMessages...');
      const response = await this.apiService.getMessages(conversationId, page, limit);
      console.log('📡 Respuesta de apiService.getMessages:', response);
      
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination
      };
    } catch (error) {
      console.error('💥 Error obteniendo mensajes en ChatService:', error);
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
    if (!message) {
      console.warn('⚠️ formatMessageForDisplay: mensaje vacío');
      return null;
    }

    console.log('💬 formatMessageForDisplay raw message:', message);
    console.log('💬 currentUserId for formatting:', currentUserId);

    // Validar que el mensaje tiene las propiedades necesarias
    if (!message.id || !message.contenido) {
      console.error('🚨 formatMessageForDisplay: mensaje mal formateado', message);
      return null;
    }

    const formatted = {
      id: message.id,
      contenido: String(message.contenido || ''),
      hora: this.formatTime(message.fecha_envio),
      remitente: message.remitente_id === currentUserId,
      emisor: message.remitente_id === currentUserId ? 'Tú' : (message.remitente_nombre || 'Usuario'),
      leido: Boolean(message.leido),
      tipo: 'texto'
    };

    console.log('💬 formatMessageForDisplay result:', formatted);
    return formatted;
  }

  /**
   * Formatear conversación para mostrar en la lista
   */
  formatConversationForDisplay(conversation, currentUserId) {
    if (!conversation) return null;

    console.log('🔄 formatConversationForDisplay raw data:', conversation);
    console.log('🔄 currentUserId:', currentUserId);

    // Determinar el otro usuario en la conversación
    const otherUser = conversation.usuario1_id === currentUserId 
      ? {
          id: conversation.usuario2_id,
          nombre: conversation.otro_usuario_nombre,
          imagen: this.buildImageUrl(conversation.otro_usuario_foto)
        }
      : {
          id: conversation.otro_usuario_id,
          nombre: conversation.otro_usuario_nombre,
          imagen: this.buildImageUrl(conversation.otro_usuario_foto)
        };

    console.log('👤 otherUser determined:', otherUser);

    // Asegurar que ultimo_mensaje sea string (puede venir como objeto por controladores antiguos)
    let ultimoMensajeTexto = '';
    let ultimoMensajeFecha = conversation.ultimo_mensaje_fecha || conversation.updated_at;

    if (conversation.ultimo_mensaje) {
      if (typeof conversation.ultimo_mensaje === 'object') {
        ultimoMensajeTexto = conversation.ultimo_mensaje.contenido || '';
        ultimoMensajeFecha = conversation.ultimo_mensaje.fecha_envio || ultimoMensajeFecha;
      } else {
        ultimoMensajeTexto = conversation.ultimo_mensaje;
      }
    } else {
      ultimoMensajeTexto = 'Nueva conversación';
    }

    const formatted = {
      id: conversation.id,
      nombre: otherUser.nombre,
      imagen: otherUser.imagen,
      vista_previa: ultimoMensajeTexto || 'Nueva conversación',
      tiempo_indicador: this.getTimeIndicator(ultimoMensajeFecha),
      ultima_actividad: 'En línea', // Esto se puede mejorar con estado real
      lastMessageAt: ultimoMensajeFecha || new Date().toISOString(), // Para ordenamiento en frontend
      mensajes: [] // Los mensajes se cargarán por separado
    };

    console.log('✨ formatConversationForDisplay result:', formatted);
    return formatted;
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
   * Crear mensajes de prueba para debug (SOLO DESARROLLO)
   */
  async createTestMessages() {
    try {
      console.log('🧪 Creando mensajes de prueba...');
      
      // Datos de mensajes de prueba YA FORMATEADOS para React
      const testMessages = [
        // Conversación 5
        {
          id: Date.now() + 1,
          contenido: '¡Hola! ¿Cómo estás?',
          hora: '14:30',
          remitente: false,
          emisor: 'María García',
          leido: true,
          tipo: 'texto',
          conversacion_id: 5
        },
        {
          id: Date.now() + 2,
          contenido: 'Muy bien, gracias. ¿Y tú?',
          hora: '14:35',
          remitente: true,
          emisor: 'Tú',
          leido: true,
          tipo: 'texto',
          conversacion_id: 5
        },
        {
          id: Date.now() + 3,
          contenido: 'Genial! Me alegra escuchar eso',
          hora: '14:40',
          remitente: false,
          emisor: 'María García',
          leido: false,
          tipo: 'texto',
          conversacion_id: 5
        },
        
        // Conversación 6
        {
          id: Date.now() + 4,
          contenido: 'Hey! Vi tu perfil y me parece interesante',
          hora: '12:15',
          remitente: false,
          emisor: 'Carlos Mendoza',
          leido: true,
          tipo: 'texto',
          conversacion_id: 6
        },
        {
          id: Date.now() + 5,
          contenido: '¡Hola! Gracias, el tuyo también me llamó la atención',
          hora: '12:20',
          remitente: true,
          emisor: 'Tú',
          leido: true,
          tipo: 'texto',
          conversacion_id: 6
        }
      ];

      return {
        success: true,
        data: testMessages,
        message: 'Mensajes de prueba creados localmente (ya formateados)'
      };
      
    } catch (error) {
      console.error('💥 Error creando mensajes de prueba:', error);
      return {
        success: false,
        error: error.message || 'Error creando mensajes de prueba'
      };
    }
  }

  /**
   * Construir URL completa para la imagen de usuario
   */
  buildImageUrl(imagePath) {
    if (!imagePath) {
      return '/images/default-avatar.png';
    }
    
    console.log('🖼️ buildImageUrl input:', imagePath);
    
    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('🖼️ buildImageUrl output (URL completa):', imagePath);
      return imagePath;
    }
    
    // Si es una ruta que empieza con /images/ (imágenes de demo), construir URL completa
    if (imagePath.startsWith('/images/')) {
      const result = `http://localhost:3001${imagePath}`;
      console.log('🖼️ buildImageUrl output (images):', result);
      return result;
    }
    
    // Si es una ruta que empieza con /public/uploads/, convertirla a la ruta del servidor estático
    if (imagePath.startsWith('/public/uploads/')) {
      const result = `http://localhost:3001${imagePath.replace('/public', '')}`;
      console.log('🖼️ buildImageUrl output (public/uploads):', result);
      return result;
    }
    
    // Si es una ruta que empieza con /uploads/, construir la URL completa
    if (imagePath.startsWith('/uploads/')) {
      const result = `http://localhost:3001${imagePath}`;
      console.log('🖼️ buildImageUrl output (uploads):', result);
      return result;
    }
    
    // Para cualquier otra ruta, asumirla como relativa al directorio de imágenes por defecto
    const result = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    console.log('🖼️ buildImageUrl output (default):', result);
    return result;
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
