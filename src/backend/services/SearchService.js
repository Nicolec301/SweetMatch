import ApiService from './ApiService';

class SearchService {
  constructor() {
    this.baseUrl = '/search'; // Quitamos /api porque ya está en API_BASE_URL
  }

  /**
   * Buscar usuarios con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @param {number} page - Página actual
   * @param {number} limit - Límite por página
   * @returns {Promise} Resultado de la búsqueda
   */
  async searchUsers(filters = {}, page = 1, limit = 20) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      // Manejar array de intereses
      if (filters.intereses && Array.isArray(filters.intereses)) {
        queryParams.delete('intereses');
        filters.intereses.forEach(interes => {
          queryParams.append('intereses', interes);
        });
      }

      const response = await ApiService.get(`${this.baseUrl}/users?${queryParams}`);
      return response;
    } catch (error) {
      console.error('Error en búsqueda de usuarios:', error);
      return {
        success: false,
        error: 'Error al buscar usuarios'
      };
    }
  }

  /**
   * Obtener intereses disponibles
   * @returns {Promise} Lista de intereses
   */
  async getAvailableInterests() {
    try {
      const response = await ApiService.get(`${this.baseUrl}/interests`);
      return response;
    } catch (error) {
      console.error('Error obteniendo intereses:', error);
      return {
        success: false,
        error: 'Error al obtener intereses',
        data: [
          'viajes', 'fotografía', 'música', 'cocina', 'deporte', 'cine', 
          'fitness', 'lectura', 'arte', 'pintura', 'museos', 'café',
          'tecnología', 'gaming', 'programación', 'ciencia', 'animales', 
          'naturaleza', 'senderismo', 'veterinaria'
        ]
      };
    }
  }

  /**
   * Obtener perfil detallado de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise} Datos del perfil
   */
  async getUserProfile(userId) {
    try {
      const response = await ApiService.get(`${this.baseUrl}/profile/${userId}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return {
        success: false,
        error: 'Error al obtener perfil del usuario'
      };
    }
  }

  /**
   * Dar "me gusta" a un perfil
   * @param {number} userId - ID del usuario que recibe el like
   * @returns {Promise} Resultado de la acción
   */
  async likeProfile(userId) {
    try {
      const response = await ApiService.post('/matches/like', {
        likedUserId: userId
      });
      return response;
    } catch (error) {
      console.error('Error dando like:', error);
      return {
        success: false,
        error: 'Error al dar like'
      };
    }
  }

  /**
   * Pasar un perfil (no dar like)
   * @param {number} userId - ID del usuario que se pasa
   * @returns {Promise} Resultado de la acción
   */
  async passProfile(userId) {
    try {
      const response = await ApiService.post('/matches/pass', {
        passedUserId: userId
      });
      return response;
    } catch (error) {
      console.error('Error pasando perfil:', error);
      return {
        success: false,
        error: 'Error al pasar perfil'
      };
    }
  }

  /**
   * Enviar mensaje directo a un usuario (crear conversación)
   * @param {number} userId - ID del usuario destinatario
   * @param {string} message - Mensaje inicial
   * @param {number} senderId - ID del usuario remitente
   * @returns {Promise} Resultado del envío
   */
  async sendDirectMessage(userId, message, senderId) {
    try {
      const response = await ApiService.post(`${this.baseUrl}/send-message`, {
        recipientId: userId,
        senderId: senderId,
        mensaje: message
      });

      return response;
    } catch (error) {
      console.error('Error enviando mensaje directo:', error);
      return {
        success: false,
        error: 'Error al enviar mensaje'
      };
    }
  }

  /**
   * Formatear datos de usuario para mostrar
   * @param {Object} user - Datos del usuario
   * @returns {Object} Usuario formateado
   */
  formatUserForDisplay(user) {
    return {
      id: user.id,
      nombre: user.nombre,
      edad: user.edad,
      distancia: user.distancia || Math.floor(Math.random() * 50) + 1,
      genero: user.genero || 'desconocido',
      foto: user.foto_principal || user.fotos?.[0]?.url_foto || '/images/default-avatar.png',
      descripcion: user.descripcion || 'Sin descripción disponible',
      intereses: user.intereses || [],
      estado: user.estado || 'recientemente_activa',
      verificada: user.verificada || false,
      trabajo: user.trabajo,
      educacion: user.educacion,
      altura: user.altura,
      ubicacion: user.ubicacion
    };
  }

  /**
   * Aplicar filtros locales a una lista de usuarios
   * @param {Array} users - Lista de usuarios
   * @param {Object} filters - Filtros a aplicar
   * @returns {Array} Usuarios filtrados
   */
  applyLocalFilters(users, filters) {
    return users.filter(user => {
      // Filtro por edad
      if (filters.edad) {
        if (user.edad < filters.edad.min || user.edad > filters.edad.max) {
          return false;
        }
      }

      // Filtro por distancia
      if (filters.distancia && user.distancia > filters.distancia) {
        return false;
      }

      // Filtro por género
      if (filters.genero && filters.genero !== 'ambos' && user.genero !== filters.genero) {
        return false;
      }

      // Filtro por estado
      if (filters.estado && filters.estado !== 'todos' && user.estado !== filters.estado) {
        return false;
      }

      // Filtro por intereses
      if (filters.intereses && filters.intereses.length > 0) {
        const hasCommonInterest = filters.intereses.some(interes => 
          user.intereses.includes(interes)
        );
        if (!hasCommonInterest) {
          return false;
        }
      }

      return true;
    });
  }
}

const searchServiceInstance = new SearchService();
export default searchServiceInstance;
