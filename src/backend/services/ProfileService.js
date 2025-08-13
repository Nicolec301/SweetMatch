// Servicio para manejar operaciones del perfil de usuario
import ApiService from './ApiService';
import SessionManager from './SessionManager';

class ProfileService {
  constructor() {
    this.apiService = ApiService;
    this.sessionManager = SessionManager.getInstance();
  }

  /**
   * Obtener fotos del usuario
   */
  async getUserPhotos(userId) {
    try {
      const response = await this.apiService.getUserPhotos(userId);
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('Error obteniendo fotos del usuario:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener fotos'
      };
    }
  }

  /**
   * Subir foto de perfil
   */
  async uploadProfilePhoto(userId, file) {
    try {
      const response = await this.apiService.uploadUserPhoto(userId, file);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error subiendo foto de perfil:', error);
      return {
        success: false,
        error: error.message || 'Error al subir foto'
      };
    }
  }

  /**
   * Subir fotos adicionales
   */
  async uploadAdditionalPhotos(userId, files) {
    try {
      const response = await this.apiService.uploadAdditionalPhotos(userId, files);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error subiendo fotos adicionales:', error);
      return {
        success: false,
        error: error.message || 'Error al subir fotos'
      };
    }
  }

  /**
   * Eliminar foto de usuario
   */
  async deleteUserPhoto(userId, photoId) {
    try {
      const response = await this.apiService.deleteUserPhoto(userId, photoId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error eliminando foto:', error);
      return {
        success: false,
        error: error.message || 'Error al eliminar foto'
      };
    }
  }

  /**
   * Actualizar perfil completo del usuario
   */
  async updateUserProfile(userId, profileData) {
    try {
      const response = await this.apiService.updateUserProfile(userId, profileData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar perfil'
      };
    }
  }

  /**
   * Eliminar cuenta de usuario
   */
  async deleteUserAccount(userId) {
    try {
      const response = await this.apiService.deleteUser(userId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      return {
        success: false,
        error: error.message || 'Error al eliminar cuenta'
      };
    }
  }

  /**
   * Construir URL completa para imagen
   */
  buildImageUrl(imagePath) {
    if (!imagePath) {
      return '/images/default-avatar.png';
    }
    
    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Si es una ruta que empieza con /images/ (imágenes de demo)
    if (imagePath.startsWith('/images/')) {
      return `http://localhost:3001${imagePath}`;
    }
    
    // Si es una ruta que empieza con /uploads/ (imágenes subidas)
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:3001${imagePath}`;
    }
    
    // Para cualquier otra ruta, asumirla como relativa
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }
}

// Exportar instancia única
const profileService = new ProfileService();
export default profileService;
