// Servicio para funciones de búsqueda y mensajería directa
import { API_BASE_URL } from '../../config';

class SearchService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Obtener token del localStorage
  getToken() {
    // Unificar fuentes de token: SessionManager usa 'sweetmatch_token', ApiService podría usar 'authToken'
    const token = localStorage.getItem('sweetmatch_token') || localStorage.getItem('authToken');
    if (!token) {
      // Debug auxiliar para diagnosticar 401
      console.warn('[SearchService] Token no encontrado en localStorage (sweetmatch_token | authToken)');
    }
    return token;
  }

  // Método genérico para hacer requests
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.message || `HTTP ${response.status}`);
        error.success = false;
        error.status = response.status;
        error.errors = data.errors || [];
        throw error;
      }

      return data;
    } catch (error) {
      console.error('SearchService request error:', error);
      if (error.success === false) {
        throw error;
      }
      const networkError = new Error(error.message || 'Error de red');
      networkError.success = false;
      networkError.originalError = error;
      throw networkError;
    }
  }

  // Buscar usuarios con filtros
  async searchUsers(filters = {}, page = 1, limit = 50) {
    try {
      const params = new URLSearchParams();
      // Añadir filtros simples
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (key === 'intereses') return; // manejar abajo
        params.append(key, value);
      });
      params.append('page', page);
      params.append('limit', limit);

      // Intereses: permitir array -> parámetros repetidos
      if (filters.intereses && Array.isArray(filters.intereses) && filters.intereses.length > 0) {
        filters.intereses.forEach(int => {
          if (typeof int === 'string' && int.trim() !== '') {
            params.append('intereses', int.trim());
          }
        });
      } else if (typeof filters.intereses === 'string' && filters.intereses.trim() !== '') {
        params.append('intereses', filters.intereses.trim());
      }

      const queryString = params.toString();

      return await this.request(`/search/users?${queryString}`);
    } catch (error) {
      console.error('Error searching users:', error);
      return {
        success: false,
        error: error.message || 'Error al buscar usuarios'
      };
    }
  }

  // Obtener intereses disponibles
  async getAvailableInterests() {
    try {
      return await this.request('/search/interests');
    } catch (error) {
      console.error('Error getting interests:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener intereses'
      };
    }
  }

  // Obtener perfil de usuario
  async getUserProfile(userId) {
    try {
      return await this.request(`/search/profile/${userId}`);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener perfil'
      };
    }
  }

  // Enviar mensaje directo (crea conversación si no existe)
  async sendDirectMessage(recipientId, message, senderId = null) {
    try {
      return await this.request('/search/send-message', {
        method: 'POST',
        body: JSON.stringify({
          recipientId: recipientId,
          mensaje: message
          // senderId ya no es necesario, se obtiene del token JWT
        })
      });
    } catch (error) {
      console.error('Error sending direct message:', error);
      return {
        success: false,
        error: error.message || 'Error al enviar mensaje'
      };
    }
  }

  // Dar like a un perfil
  async likeProfile(profileId) {
    try {
      return await this.request('/matches/like', {
        method: 'POST',
        body: JSON.stringify({
          targetUserId: profileId
        })
      });
    } catch (error) {
      console.error('Error liking profile:', error);
      return {
        success: false,
        error: error.message || 'Error al dar like'
      };
    }
  }

  // Pasar un perfil
  async passProfile(profileId) {
    try {
      return await this.request('/matches/pass', {
        method: 'POST',
        body: JSON.stringify({
          targetUserId: profileId
        })
      });
    } catch (error) {
      console.error('Error passing profile:', error);
      return {
        success: false,
        error: error.message || 'Error al pasar perfil'
      };
    }
  }

  // Formatear datos de usuario para mostrar
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
}

// Crear y exportar instancia singleton
const searchService = new SearchService();
export default searchService;
