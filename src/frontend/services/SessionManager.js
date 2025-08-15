/**
 * SessionManager - Patrón Singleton para manejar sesiones de usuario
 * Gestiona el estado de autenticación y datos del usuario
 */

class SessionManager {
  constructor() {
    if (SessionManager.instance) {
      return SessionManager.instance;
    }
    
    this.user = null;
    this.token = null;
    this.isLoggedIn = false;
    
    // Cargar sesión persistente si existe
    this.loadSession();
    
    SessionManager.instance = this;
  }

  /**
   * Obtener la instancia única del SessionManager
   * @returns {SessionManager} Instancia singleton
   */
  static getInstance() {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Cargar sesión desde localStorage
   */
  loadSession() {
    try {
      const savedToken = localStorage.getItem('sweetmatch_token');
      const savedUser = localStorage.getItem('sweetmatch_user');
      
      if (savedToken && savedUser) {
        this.token = savedToken;
        this.user = JSON.parse(savedUser);
        this.isLoggedIn = true;
        
        console.log('✅ Sesión cargada:', {
          usuario: this.user.nombre,
          email: this.user.email
        });
      }
    } catch (error) {
      console.error('Error cargando sesión:', error);
      this.clearSession();
    }
  }

  /**
   * Iniciar sesión con datos del usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} token - Token de autenticación
   */
  login(userData, token = null) {
    try {
      // Validación defensiva del payload
      if (!userData || typeof userData !== 'object') {
        console.error('Login: payload inválido de usuario:', userData);
        return {
          success: false,
          message: 'Respuesta inválida del servidor'
        };
      }

      this.user = {
        id: userData.id,
        nombre: userData.nombre,
        email: userData.email,
        edad: userData.edad,
        genero: userData.genero,
        descripcion: userData.descripcion,
        foto: userData.foto || null,
        intereses: userData.intereses || [],
        preferencias: userData.preferencias || null,
        created_at: userData.created_at,
        perfil_completado: userData.perfil_completado || false,
        // Incluir campos adicionales del perfil
        ubicacion: userData.ubicacion,
        trabajo: userData.trabajo,
        educacion: userData.educacion,
        altura: userData.altura,
        signo: userData.signo,
        fumador: userData.fumador,
        bebe: userData.bebe,
        mascotas: userData.mascotas,
        hijos: userData.hijos,
        religion: userData.religion,
        politica: userData.politica
      };
      
      this.token = token;
      this.isLoggedIn = true;
      
      // Persistir en localStorage
      localStorage.setItem('sweetmatch_user', JSON.stringify(this.user));
      if (token) {
        localStorage.setItem('sweetmatch_token', token);
      }
      
      console.log('🔐 Sesión iniciada para:', this.user.nombre);
      
      return {
        success: true,
        message: `¡Bienvenido ${this.user.nombre}!`
      };
      
    } catch (error) {
      console.error('Error iniciando sesión:', error);
      return {
        success: false,
        message: 'Error al iniciar sesión'
      };
    }
  }

  /**
   * Establecer usuario (para registro sin token)
   * @param {Object} userData - Datos del usuario
   */
  setUser(userData) {
    try {
      this.user = {
        id: userData.id,
        nombre: userData.nombre,
        email: userData.email,
        edad: userData.edad,
        genero: userData.genero,
        descripcion: userData.descripcion,
        foto: userData.foto || null,
        intereses: userData.intereses || [],
        preferencias: userData.preferencias || null,
        created_at: userData.created_at,
        perfil_completado: userData.perfil_completado || false,
        // Incluir campos adicionales del perfil
        ubicacion: userData.ubicacion,
        trabajo: userData.trabajo,
        educacion: userData.educacion,
        altura: userData.altura,
        signo: userData.signo,
        fumador: userData.fumador,
        bebe: userData.bebe,
        mascotas: userData.mascotas,
        hijos: userData.hijos,
        religion: userData.religion,
        politica: userData.politica
      };
      
      this.isLoggedIn = true;
      
      // Persistir en localStorage
      localStorage.setItem('sweetmatch_user', JSON.stringify(this.user));
      
      console.log('👤 Usuario establecido:', this.user.nombre);
      
      return {
        success: true,
        message: `Usuario ${this.user.nombre} configurado exitosamente`
      };
      
    } catch (error) {
      console.error('Error estableciendo usuario:', error);
      return {
        success: false,
        message: 'Error al establecer usuario'
      };
    }
  }

  /**
   * Cerrar sesión
   */
  logout() {
    const userName = this.user?.nombre || 'Usuario';
    
    this.user = null;
    this.token = null;
    this.isLoggedIn = false;
    
    // Limpiar localStorage
    localStorage.removeItem('sweetmatch_user');
    localStorage.removeItem('sweetmatch_token');
    
    console.log('👋 Sesión cerrada para:', userName);
    
    return {
      success: true,
      message: '¡Hasta luego!'
    };
  }

  /**
   * Limpiar sesión (para casos de error)
   */
  clearSession() {
    this.user = null;
    this.token = null;
    this.isLoggedIn = false;
    
    localStorage.removeItem('sweetmatch_user');
    localStorage.removeItem('sweetmatch_token');
  }

  /**
   * Verificar si hay una sesión activa
   * @returns {boolean} true si hay sesión activa
   */
  isAuthenticated() {
    return this.isLoggedIn && this.user !== null;
  }

  /**
   * Obtener datos del usuario actual
   * @returns {Object|null} Datos del usuario o null si no hay sesión
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Obtener nombre del usuario actual
   * @returns {string|null} Nombre del usuario o null
   */
  getUserName() {
    return this.user?.nombre || null;
  }

  /**
   * Obtener email del usuario actual
   * @returns {string|null} Email del usuario o null
   */
  getUserEmail() {
    return this.user?.email || null;
  }

  /**
   * Obtener ID del usuario actual
   * @returns {number|null} ID del usuario o null
   */
  getUserId() {
    return this.user?.id || null;
  }

  /**
   * Obtener token de autenticación
   * @returns {string|null} Token o null
   */
  getToken() {
    return this.token;
  }

  /**
   * Actualizar datos del usuario
   * @param {Object} userData - Nuevos datos del usuario
   */
  updateUser(userData) {
    if (!this.isAuthenticated()) {
      return {
        success: false,
        message: 'No hay sesión activa'
      };
    }

    try {
      // Actualizar solo los campos proporcionados
      this.user = {
        ...this.user,
        ...userData
      };
      
      // Persistir cambios
      localStorage.setItem('sweetmatch_user', JSON.stringify(this.user));
      
      console.log('📝 Usuario actualizado:', this.user.nombre);
      
      return {
        success: true,
        message: 'Datos actualizados correctamente'
      };
      
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return {
        success: false,
        message: 'Error al actualizar datos'
      };
    }
  }

  /**
   * Obtener información resumida para mostrar en UI
   * @returns {Object} Información básica del usuario
   */
  getUserInfo() {
    if (!this.isAuthenticated()) {
      return {
        isAuthenticated: false,
        user: null
      };
    }

    return {
      isAuthenticated: true,
      user: {
        id: this.user.id,
        nombre: this.user.nombre,
        email: this.user.email,
        foto: this.user.foto,
  iniciales: this.getInitials(),
  // Añadir bandera para usarla en Home
  perfil_completado: !!this.user.perfil_completado
      }
    };
  }

  /**
   * Obtener iniciales del nombre del usuario
   * @returns {string} Iniciales del usuario
   */
  getInitials() {
    if (!this.user?.nombre) return 'U';
    
    const names = this.user.nombre.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    } else {
      return names[0][0].toUpperCase();
    }
  }

  /**
   * Verificar si el token ha expirado (si se implementa JWT)
   * @returns {boolean} true si el token está válido
   */
  isTokenValid() {
    if (!this.token) return false;
    
    try {
      // Aquí podrías implementar validación de JWT si usas tokens JWT
      // Por ahora, simplemente verificamos que existe
      return this.token.length > 0;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  }

  /**
   * Debug: Mostrar estado actual de la sesión
   */
  debugSession() {
    console.log('🔍 Estado de sesión:', {
      isLoggedIn: this.isLoggedIn,
      user: this.user ? {
        id: this.user.id,
        nombre: this.user.nombre,
        email: this.user.email
      } : null,
      hasToken: !!this.token
    });
  }
}

// Exportar la clase (no la instancia)
export default SessionManager;
