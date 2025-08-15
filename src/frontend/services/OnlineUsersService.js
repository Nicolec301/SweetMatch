import { API_BASE_URL } from '../../config.js';
import SessionManager from './SessionManager.js';

class OnlineUsersService {
    constructor() {
        this.apiUrl = API_BASE_URL;
        this.socket = null;
        this.onlineUsers = [];
        this.sessionManager = new SessionManager();
    }

    /**
     * Obtener usuarios actualmente en línea
     */
    async getOnlineUsers(filters = {}) {
        try {
            const token = this.sessionManager.getToken();
            if (!token) {
                throw new Error('Token de autenticación no encontrado');
            }

            const queryParams = new URLSearchParams(filters);
            const response = await fetch(`${this.apiUrl}/users/online?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            // Procesar URLs de imágenes para usar el sistema de uploads
            const processedUsers = data.users.map(user => ({
                ...user,
                foto: this.getImageUrl(user.foto || user.photos?.[0]?.filename),
                fotos: user.photos ? user.photos.map(photo => ({
                    ...photo,
                    url: this.getImageUrl(photo.filename)
                })) : []
            }));

            this.onlineUsers = processedUsers;
            return {
                success: true,
                users: processedUsers,
                total: data.total || processedUsers.length
            };

        } catch (error) {
            console.error('Error obteniendo usuarios en línea:', error);
            return {
                success: false,
                error: error.message,
                users: [],
                total: 0
            };
        }
    }

    /**
     * Actualizar estado de usuario a en línea
     */
    async setUserOnline() {
        try {
            const token = this.sessionManager.getToken();
            if (!token) return false;

            const response = await fetch(`${this.apiUrl}/users/status/online`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Error actualizando estado online:', error);
            return false;
        }
    }

    /**
     * Marcar usuario como offline
     */
    async setUserOffline() {
        try {
            const token = this.sessionManager.getToken();
            if (!token) return false;

            const response = await fetch(`${this.apiUrl}/users/status/offline`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Error actualizando estado offline:', error);
            return false;
        }
    }

    /**
     * Obtener URL completa de imagen desde el sistema de uploads
     */
    getImageUrl(filename) {
        if (!filename) {
            return '/images/chica.jpg'; // Imagen por defecto
        }
        
        // Si ya es una URL completa, devolverla tal como está
        if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('/')) {
            return filename;
        }
        
        // Construir URL usando el sistema de uploads del backend
        const baseUrl = this.apiUrl.replace('/api', '');
        return `${baseUrl}/uploads/users/${filename}`;
    }

    /**
     * Calcular tiempo desde última actividad
     */
    formatLastActivity(lastActivity) {
        if (!lastActivity) return 'Desconocido';
        
        const now = new Date();
        const activityDate = new Date(lastActivity);
        const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Ahora mismo';
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Hace ${diffInHours}h`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `Hace ${diffInDays}d`;
    }

    /**
     * Determinar estado del usuario basado en última actividad
     */
    getUserStatus(lastActivity) {
        if (!lastActivity) return 'offline';
        
        const now = new Date();
        const activityDate = new Date(lastActivity);
        const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
        
        if (diffInMinutes <= 5) return 'en_linea';
        if (diffInMinutes <= 30) return 'recientemente_activo';
        return 'offline';
    }

    /**
     * Filtrar usuarios según criterio
     */
    filterUsers(users, filter) {
        switch (filter) {
            case 'en_linea':
                return users.filter(user => this.getUserStatus(user.ultima_actividad) === 'en_linea');
            case 'recientemente_activo':
                return users.filter(user => this.getUserStatus(user.ultima_actividad) === 'recientemente_activo');
            case 'verificados':
                return users.filter(user => user.verificado === true);
            case 'cerca':
                return users.filter(user => user.distancia && user.distancia <= 5);
            case 'todos':
            default:
                return users;
        }
    }

    /**
     * Enviar like a un usuario
     */
    async likeUser(userId) {
        try {
            const token = this.sessionManager.getToken();
            if (!token) throw new Error('No autenticado');

            const response = await fetch(`${this.apiUrl}/matches/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                throw new Error('Error enviando like');
            }

            return await response.json();
        } catch (error) {
            console.error('Error enviando like:', error);
            throw error;
        }
    }

    /**
     * Iniciar conversación con un usuario
     */
    async startConversation(userId) {
        try {
            const token = this.sessionManager.getToken();
            if (!token) throw new Error('No autenticado');

            const response = await fetch(`${this.apiUrl}/chat/conversations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                throw new Error('Error iniciando conversación');
            }

            return await response.json();
        } catch (error) {
            console.error('Error iniciando conversación:', error);
            throw error;
        }
    }

    /**
     * Cleanup al destruir el servicio
     */
    destroy() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.onlineUsers = [];
    }
}

const onlineUsersService = new OnlineUsersService();
export default onlineUsersService;
