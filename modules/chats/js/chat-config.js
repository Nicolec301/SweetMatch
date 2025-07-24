/**
 * Configuración del sistema de chat de SweetMatch
 */
const ChatConfig = {
    // Configuración de mensajes
    message: {
        maxLength: 1000,
        minLength: 1,
        autoSaveInterval: 30000, // 30 segundos
        typingTimeout: 3000, // 3 segundos
        markAsReadDelay: 1000 // 1 segundo
    },
    
    // Configuración de archivos
    files: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        imageCompression: {
            maxWidth: 800,
            maxHeight: 600,
            quality: 0.8
        }
    },
    
    // Configuración de notificaciones
    notifications: {
        enabled: true,
        sound: true,
        autoHide: 5000, // 5 segundos
        permission: 'default' // 'granted', 'denied', 'default'
    },
    
    // Configuración de la UI
    ui: {
        messagesPerPage: 50,
        autoScrollThreshold: 100,
        conversationRefreshInterval: 30000, // 30 segundos
        onlineStatusUpdateInterval: 60000, // 1 minuto
        darkMode: false,
        animationsEnabled: true
    },
    
    // Configuración de conexión
    connection: {
        retryAttempts: 3,
        retryDelay: 1000,
        heartbeatInterval: 30000, // 30 segundos
        timeout: 10000 // 10 segundos
    },
    
    // URLs y endpoints
    endpoints: {
        conversations: 'js/data/conversaciones.json',
        sendMessage: 'api/send-message.php',
        uploadFile: 'api/upload-file.php',
        markAsRead: 'api/mark-as-read.php',
        getUserStatus: 'api/user-status.php'
    },
    
    // Configuración de emojis
    emojis: {
        enabled: true,
        categories: {
            smileys: ['😊', '😢', '😃', '😍', '🤔', '😂', '😭', '😡', '😘', '🥰'],
            gestures: ['👍', '👎', '👏', '🙌', '✋', '👋', '🤝', '💪', '🙏', '✌️'],
            hearts: ['❤️', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🖤'],
            objects: ['🔥', '✨', '⭐', '🎉', '🎊', '💯', '💫', '🌟', '⚡', '💎']
        }
    },
    
    // Configuración de temas
    themes: {
        light: {
            primary: '#ff3368',
            secondary: '#ff6b8e',
            background: '#ffffff',
            surface: '#f8f9fa',
            text: '#333333',
            textSecondary: '#666666'
        },
        dark: {
            primary: '#ff3368',
            secondary: '#ff6b8e',
            background: '#1a1a1a',
            surface: '#2d2d2d',
            text: '#ffffff',
            textSecondary: '#cccccc'
        }
    },
    
    // Configuración de accesibilidad
    accessibility: {
        highContrast: false,
        reducedMotion: false,
        fontSize: 'normal', // 'small', 'normal', 'large'
        keyboardNavigation: true
    },
    
    // Configuración de seguridad
    security: {
        maxLoginAttempts: 3,
        sessionTimeout: 3600000, // 1 hora
        csrfProtection: true,
        contentFiltering: true
    },
    
    // Configuración de desarrollo
    development: {
        debugMode: false,
        mockData: true,
        apiLogging: false,
        performanceMonitoring: false
    }
};

// Función para obtener configuración con valores por defecto
ChatConfig.get = function(path, defaultValue = null) {
    const keys = path.split('.');
    let current = this;
    
    for (const key of keys) {
        if (current[key] === undefined) {
            return defaultValue;
        }
        current = current[key];
    }
    
    return current;
};

// Función para establecer configuración
ChatConfig.set = function(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = this;
    
    for (const key of keys) {
        if (current[key] === undefined) {
            current[key] = {};
        }
        current = current[key];
    }
    
    current[lastKey] = value;
};

// Función para cargar configuración desde localStorage
ChatConfig.loadFromStorage = function() {
    try {
        const stored = localStorage.getItem('sweetmatch_chat_config');
        if (stored) {
            const config = JSON.parse(stored);
            Object.assign(this, config);
        }
    } catch (error) {
        console.warn('No se pudo cargar la configuración desde localStorage:', error);
    }
};

// Función para guardar configuración en localStorage
ChatConfig.saveToStorage = function() {
    try {
        localStorage.setItem('sweetmatch_chat_config', JSON.stringify(this));
    } catch (error) {
        console.warn('No se pudo guardar la configuración en localStorage:', error);
    }
};

// Función para restablecer configuración por defecto
ChatConfig.reset = function() {
    localStorage.removeItem('sweetmatch_chat_config');
    location.reload();
};

// Cargar configuración guardada al inicializar
ChatConfig.loadFromStorage();

// Exportar configuración
window.ChatConfig = ChatConfig;
