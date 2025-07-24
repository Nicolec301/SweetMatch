/**
 * Utilidades para el sistema de chat de SweetMatch
 */
class ChatUtils {
    static formatTime(date) {
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    static formatDate(date) {
        const today = new Date();
        const messageDate = new Date(date);
        
        const diffTime = Math.abs(today - messageDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Hoy';
        } else if (diffDays === 2) {
            return 'Ayer';
        } else if (diffDays <= 7) {
            return `Hace ${diffDays} días`;
        } else {
            return messageDate.toLocaleDateString('es-ES');
        }
    }

    static getTimeIndicator(lastActivity) {
        const now = new Date();
        const activityDate = new Date(lastActivity);
        const diffMinutes = Math.floor((now - activityDate) / (1000 * 60));
        
        if (diffMinutes < 1) {
            return 'ahora';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}m`;
        } else if (diffMinutes < 1440) { // 24 hours
            return `${Math.floor(diffMinutes / 60)}h`;
        } else if (diffMinutes < 10080) { // 7 days
            return `${Math.floor(diffMinutes / 1440)}d`;
        } else {
            return `${Math.floor(diffMinutes / 10080)}w`;
        }
    }

    static sanitizeMessage(message) {
        // Limpiar HTML potencialmente peligroso
        const div = document.createElement('div');
        div.textContent = message;
        return div.innerHTML;
    }

    static detectMessageType(content) {
        if (content.includes('<img')) {
            return 'imagen';
        } else if (content.match(/https?:\/\/[^\s]+/)) {
            return 'enlace';
        } else {
            return 'texto';
        }
    }

    static generateMessageId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    static playNotificationSound() {
        // Crear un sonido simple para notificaciones
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    }

    static isOnline() {
        return navigator.onLine;
    }

    static showTypingIndicator(conversationId, isTyping = true) {
        const messagesContainer = document.querySelector('.messages-container');
        if (!messagesContainer) return;

        const existingIndicator = document.querySelector('.typing-indicator');
        
        if (isTyping) {
            if (!existingIndicator) {
                const typingDiv = document.createElement('div');
                typingDiv.className = 'typing-indicator';
                typingDiv.innerHTML = `
                    <div class="message received">
                        <div class="message-avatar">
                            <img src="../../images/Sofia.png" alt="Typing">
                        </div>
                        <div class="message-content">
                            <div class="typing-animation">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                `;
                messagesContainer.appendChild(typingDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        } else {
            if (existingIndicator) {
                existingIndicator.remove();
            }
        }
    }

    static validateMessage(message) {
        const errors = [];
        
        if (!message || message.trim().length === 0) {
            errors.push('El mensaje no puede estar vacío');
        }
        
        if (message.length > 1000) {
            errors.push('El mensaje es demasiado largo (máximo 1000 caracteres)');
        }
        
        return errors;
    }

    static compressImage(file, maxWidth = 800, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    static createImagePreview(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    static showImageModal(imageSrc) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
        
        modal.appendChild(img);
        
        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        document.body.appendChild(modal);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn('No se pudo guardar en localStorage:', error);
            return false;
        }
    }

    static loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('No se pudo cargar desde localStorage:', error);
            return null;
        }
    }

    static clearLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('No se pudo limpiar localStorage:', error);
            return false;
        }
    }
}

// Exportar para uso global
window.ChatUtils = ChatUtils;
