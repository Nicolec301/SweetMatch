// Servicio para comunicarse con la API backend
import { API_BASE_URL } from '../config';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Método genérico para hacer requests
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Siempre intentar parsear la respuesta JSON
      const data = await response.json();
      
      if (!response.ok) {
        // Si hay error, crear un Error object con información específica
        const error = new Error(data.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.errors = data.errors || [];
        error.data = data;
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      // Si es un error de red o parsing, mantener el comportamiento original
      if (!error.status) {
        throw new Error('Error de conexión');
      }
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Métodos para usuarios
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Métodos HTTP genéricos
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Métodos específicos para registro
  async registerUser(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async checkEmailAvailability(email) {
    return this.request('/register/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async validateRegistrationStep(step, data) {
    return this.request('/register/validate-step', {
      method: 'POST',
      body: JSON.stringify({ step, data }),
    });
  }

  async loginUser(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getInterests() {
    return this.request('/interests');
  }

  // Método para completar perfil después del registro
  async completeProfile(profileData) {
    return this.request('/users/complete-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Métodos para matches
  async getMatches() {
    return this.request('/matches');
  }

  async createMatch(matchData) {
    return this.request('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData),
    });
  }

  // Métodos para conversaciones
  async getUserConversations(userId) {
    return this.request(`/conversations/user/${userId}`);
  }

  async createOrGetConversation(user1Id, user2Id) {
    return this.request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ user1Id, user2Id }),
    });
  }

  async getConversationDetails(conversationId, userId) {
    return this.request(`/conversations/${conversationId}/details?userId=${userId}`);
  }

  // Métodos para mensajes
  async getMessages(conversationId, page = 1, limit = 50) {
    return this.request(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
  }

  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessagesAsRead(conversationId, userId) {
    return this.request(`/conversations/${conversationId}/read`, {
      method: 'PUT',
      body: JSON.stringify({ userId }),
    });
  }

  async getUnreadCount(userId) {
    return this.request(`/users/${userId}/unread-count`);
  }
}

// Crear instancia y exportar
const apiService = new ApiService();
export default apiService;
