/**
 * ChatManager - Maneja toda la funcionalidad del chat en SweetMatch
 */
class ChatManager {
    constructor() {
        this.currentConversationId = 'sophia';
        this.conversations = {};
        this.currentUser = null;
        this.messageQueue = [];
        this.isConnected = true;
        this.init();
    }

    async init() {
        await this.loadConversations();
        await this.loadCurrentUser();
        this.setupEventListeners();
        this.renderConversationList();
        this.loadConversation(this.getCurrentConversationId());
        this.startAutoRefresh();
        this.loadNotifications();
    }

    getCurrentConversationId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 'sophia';
    }

    async loadConversations() {
        try {
            const response = await fetch('js/data/conversaciones.json');
            if (response.ok) {
                this.conversations = await response.json();
            } else {
                this.conversations = this.getDefaultConversations();
            }
        } catch (error) {
            console.log('Usando conversaciones por defecto');
            this.conversations = this.getDefaultConversations();
        }
    }

    async loadCurrentUser() {
        // Simular carga del usuario actual
        this.currentUser = {
            id: 'user1',
            nombre: 'Tú',
            foto: 'user1.jpg'
        };
    }

    getDefaultConversations() {
        return {
            sophia: {
                nombre: "Sofía Martínez",
                imagen: "../../images/Sofia.png",
                vista_previa: "¿Cuál película piensas ver?",
                tiempo_indicador: "2h",
                ultima_actividad: "En línea",
                mensajes: [
                    {
                        id: 1,
                        contenido: "¡Hola! ¿Cómo va tu día?",
                        hora: "14:30",
                        remitente: false,
                        emisor: "Sofía",
                        leido: true,
                        tipo: "texto"
                    },
                    {
                        id: 2,
                        contenido: "¡Hola Sofía! Bastante bien, acabo de terminar un ejercicio. ¿Y el tuyo?",
                        hora: "14:35",
                        remitente: true,
                        emisor: "Tú",
                        leido: true,
                        tipo: "texto"
                    },
                    {
                        id: 3,
                        contenido: "¡Genial! El mío también va muy bien. ¿Te gusta el ejercicio?",
                        hora: "14:40",
                        remitente: false,
                        emisor: "Sofía",
                        leido: true,
                        tipo: "texto"
                    }
                ]
            },
            andre: {
                nombre: "André González",
                imagen: "../../images/andres.png",
                vista_previa: "¿Te gustaría salir este fin de semana?",
                tiempo_indicador: "1d",
                ultima_actividad: "Hace 2 horas",
                mensajes: [
                    {
                        id: 1,
                        contenido: "Hey! ¿Cómo va todo?",
                        hora: "12:15",
                        remitente: false,
                        emisor: "André",
                        leido: true,
                        tipo: "texto"
                    },
                    {
                        id: 2,
                        contenido: "¡Hola André! Todo bien por aquí, ¿y tú qué tal?",
                        hora: "12:20",
                        remitente: true,
                        emisor: "Tú",
                        leido: true,
                        tipo: "texto"
                    }
                ]
            },
            laura: {
                nombre: "Laura Sánchez",
                imagen: "../../images/laura.png",
                vista_previa: "Gracias por el match! 💕",
                tiempo_indicador: "3d",
                ultima_actividad: "Hace 1 día",
                mensajes: [
                    {
                        id: 1,
                        contenido: "¡Hola! Gracias por el match! 💕",
                        hora: "20:45",
                        remitente: false,
                        emisor: "Laura",
                        leido: true,
                        tipo: "texto"
                    },
                    {
                        id: 2,
                        contenido: "¡Hola Laura! ¡Qué bueno conectar contigo! 😊",
                        hora: "20:50",
                        remitente: true,
                        emisor: "Tú",
                        leido: true,
                        tipo: "texto"
                    }
                ]
            },
            tomas: {
                nombre: "Tomás Rivera",
                imagen: "../../images/tomas.png",
                vista_previa: "¿Conoces algún buen restaurante?",
                tiempo_indicador: "1w",
                ultima_actividad: "Hace 3 días",
                mensajes: [
                    {
                        id: 1,
                        contenido: "Hola! Vi que también te gusta la comida italiana 🍝",
                        hora: "19:30",
                        remitente: false,
                        emisor: "Tomás",
                        leido: true,
                        tipo: "texto"
                    }
                ]
            }
        };
    }

    setupEventListeners() {
        // Envío de mensajes
        const messageForm = document.getElementById('mensaje-form');
        if (messageForm) {
            messageForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        }

        // Búsqueda de conversaciones
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Cerrar notificaciones
        this.setupNotificationHandlers();

        // Auto-resize del textarea
        const textarea = document.querySelector('textarea[name="mensaje"]');
        if (textarea) {
            textarea.addEventListener('input', () => this.autoResizeTextarea(textarea));
            
            // Enter para enviar mensaje (Shift+Enter para nueva línea)
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage(e);
                }
            });
        }

        // Botón de adjuntar archivo
        const attachButton = document.querySelector('.attachment-button');
        if (attachButton) {
            attachButton.addEventListener('click', () => this.handleAttachment());
        }

        // Botón de emoji
        const emojiButton = document.querySelector('.emoji-button');
        if (emojiButton) {
            emojiButton.addEventListener('click', () => this.showEmojiPicker());
        }
    }

    setupNotificationHandlers() {
        const closeButtons = document.querySelectorAll('.close-notification');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeNotification(button.parentElement));
        });

        // Auto-cerrar notificaciones después de 5 segundos
        setTimeout(() => {
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => this.closeNotification(notification));
        }, 5000);
    }

    loadNotifications() {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const error = urlParams.get('error');

        if (success === 'mensaje_enviado') {
            this.showNotification('Mensaje enviado correctamente', 'success');
        } else if (error) {
            let errorMessage = 'Ha ocurrido un error al enviar el mensaje';
            switch (error) {
                case 'mensaje_vacio':
                    errorMessage = 'El mensaje no puede estar vacío';
                    break;
                case 'error_guardado':
                    errorMessage = 'Error al guardar el mensaje';
                    break;
            }
            this.showNotification(errorMessage, 'error');
        }
    }

    renderConversationList() {
        const conversationList = document.querySelector('.conversation-list');
        if (!conversationList) return;

        conversationList.innerHTML = '';
        this.currentConversationId = this.getCurrentConversationId();

        Object.entries(this.conversations).forEach(([id, conversation]) => {
            const conversationItem = document.createElement('div');
            conversationItem.className = `conversation-item ${id === this.currentConversationId ? 'active' : ''}`;
            conversationItem.setAttribute('data-conversation', id);

            conversationItem.innerHTML = `
                <a href="#" class="conversation-link" data-conversation-id="${id}">
                    <div class="conversation-avatar">
                        <img src="${conversation.imagen}" alt="Foto de ${conversation.nombre}">
                    </div>
                    <div class="conversation-info">
                        <div class="conversation-name">${conversation.nombre}</div>
                        <div class="conversation-preview">${conversation.vista_previa}</div>
                    </div>
                    <div class="conversation-time">${conversation.tiempo_indicador}</div>
                </a>
            `;

            // Agregar event listener para cambiar conversación
            const link = conversationItem.querySelector('.conversation-link');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeConversation(id);
            });

            conversationList.appendChild(conversationItem);
        });
    }

    changeConversation(conversationId) {
        // Actualizar conversación activa visualmente
        const previousActive = document.querySelector('.conversation-item.active');
        if (previousActive) {
            previousActive.classList.remove('active');
        }

        const newActive = document.querySelector(`[data-conversation="${conversationId}"]`);
        if (newActive) {
            newActive.classList.add('active');
        }

        this.currentConversationId = conversationId;
        this.loadConversation(conversationId);

        // Actualizar URL sin recargar página
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('id', conversationId);
        window.history.pushState({}, '', newUrl);
    }

    loadConversation(conversationId) {
        const conversation = this.conversations[conversationId];
        if (!conversation) return;

        // Actualizar header del chat
        this.updateChatHeader(conversation);

        // Renderizar mensajes
        this.renderMessages(conversation.mensajes);

        // Scroll al final
        setTimeout(() => this.scrollToBottom(), 100);
    }

    updateChatHeader(conversation) {
        const contactAvatar = document.querySelector('.contact-avatar img');
        const contactName = document.querySelector('.contact-name');

        if (contactAvatar) {
            contactAvatar.src = conversation.imagen;
            contactAvatar.alt = `Foto de ${conversation.nombre}`;
        }

        if (contactName) {
            contactName.textContent = conversation.nombre;
        }
    }

    renderMessages(messages) {
        const messagesContainer = document.querySelector('.messages-container');
        if (!messagesContainer) return;

        // Conservar el indicador de fecha
        const dateIndicator = messagesContainer.querySelector('.message-date');
        messagesContainer.innerHTML = '';
        
        if (dateIndicator) {
            messagesContainer.appendChild(dateIndicator);
        } else {
            // Crear indicador de fecha si no existe
            const dateDiv = document.createElement('div');
            dateDiv.className = 'message-date';
            dateDiv.innerHTML = '<span>Hoy</span>';
            messagesContainer.appendChild(dateDiv);
        }

        messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        
        if (message.remitente) {
            // Mensaje enviado por el usuario
            messageDiv.className = 'message sent';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-bubble">
                        ${this.formatMessageContent(message)}
                    </div>
                    <div class="message-time">${message.hora}</div>
                    <div class="message-status">
                        <img src="../../images/Visto.png" alt="${message.leido ? 'Visto' : 'Enviado'}" 
                             style="${message.leido ? '' : 'opacity: 0.5;'}">
                    </div>
                </div>
            `;
        } else {
            // Mensaje recibido del contacto
            const conversation = this.conversations[this.currentConversationId];
            messageDiv.className = 'message received';
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="${conversation.imagen}" alt="Foto de ${conversation.nombre}">
                </div>
                <div class="message-content">
                    <div class="message-sender">${message.emisor}</div>
                    <div class="message-bubble">
                        ${this.formatMessageContent(message)}
                    </div>
                    <div class="message-time">${message.hora}</div>
                </div>
            `;
        }

        return messageDiv;
    }

    formatMessageContent(message) {
        let content = message.contenido;
        
        // Convertir emojis básicos
        content = content.replace(/:\)/g, '😊');
        content = content.replace(/:\(/g, '😢');
        content = content.replace(/<3/g, '💕');
        content = content.replace(/:\D/g, '😃');

        // Hacer links clicables
        content = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

        return content;
    }

    async handleSendMessage(e) {
        e.preventDefault();
        
        const textarea = document.querySelector('textarea[name="mensaje"]');
        const message = textarea.value.trim();
        
        if (!message) {
            this.showNotification('El mensaje no puede estar vacío', 'error');
            return;
        }

        // Crear nuevo mensaje
        const newMessage = {
            id: Date.now(),
            contenido: message,
            hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            remitente: true,
            emisor: "Tú",
            leido: false,
            tipo: "texto"
        };

        // Agregar mensaje a la conversación actual
        this.conversations[this.currentConversationId].mensajes.push(newMessage);
        
        // Actualizar vista previa
        this.conversations[this.currentConversationId].vista_previa = 
            message.length > 30 ? message.substring(0, 30) + '...' : message;
        this.conversations[this.currentConversationId].tiempo_indicador = "ahora";

        // Limpiar textarea
        textarea.value = '';
        this.autoResizeTextarea(textarea);

        // Re-renderizar mensajes
        this.renderMessages(this.conversations[this.currentConversationId].mensajes);
        this.renderConversationList();

        // Scroll al final
        this.scrollToBottom();

        // Simular envío al servidor
        await this.saveMessage(newMessage);

        // Mostrar confirmación
        this.showNotification('Mensaje enviado correctamente', 'success');

        // Simular respuesta automática después de un tiempo
        setTimeout(() => this.simulateAutoReply(), 2000 + Math.random() * 3000);
    }

    async saveMessage(message) {
        // Simular guardado en servidor
        return new Promise(resolve => {
            setTimeout(() => {
                // Marcar como leído después de un tiempo
                setTimeout(() => {
                    message.leido = true;
                    this.renderMessages(this.conversations[this.currentConversationId].mensajes);
                }, 1000);
                resolve();
            }, 500);
        });
    }

    simulateAutoReply() {
        const conversation = this.conversations[this.currentConversationId];
        const autoReplies = [
            "¡Qué interesante! 😊",
            "Me gusta tu punto de vista",
            "¿En serio? Cuéntame más",
            "Jaja, eres muy divertido/a",
            "Totalmente de acuerdo",
            "¿Y después qué pasó?",
            "Me haces reír 😄"
        ];

        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        
        const autoMessage = {
            id: Date.now() + 1,
            contenido: randomReply,
            hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            remitente: false,
            emisor: conversation.nombre,
            leido: true,
            tipo: "texto"
        };

        conversation.mensajes.push(autoMessage);
        conversation.vista_previa = randomReply;
        conversation.tiempo_indicador = "ahora";

        this.renderMessages(conversation.mensajes);
        this.renderConversationList();
        this.scrollToBottom();
    }

    handleSearch(query) {
        const conversationItems = document.querySelectorAll('.conversation-item');
        
        conversationItems.forEach(item => {
            const name = item.querySelector('.conversation-name').textContent.toLowerCase();
            const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
            
            if (name.includes(query.toLowerCase()) || preview.includes(query.toLowerCase())) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    handleAttachment() {
        // Crear input file temporal
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    async handleFileUpload(file) {
        // Simular subida de archivo
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageMessage = {
                id: Date.now(),
                contenido: `<img src="${e.target.result}" alt="Imagen enviada" style="max-width: 200px; border-radius: 8px;">`,
                hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                remitente: true,
                emisor: "Tú",
                leido: false,
                tipo: "imagen"
            };

            this.conversations[this.currentConversationId].mensajes.push(imageMessage);
            this.conversations[this.currentConversationId].vista_previa = "📷 Imagen";
            
            this.renderMessages(this.conversations[this.currentConversationId].mensajes);
            this.renderConversationList();
            this.scrollToBottom();
        };
        reader.readAsDataURL(file);
    }

    showEmojiPicker() {
        const emojis = ['😊', '😢', '😃', '😍', '🤔', '👍', '👎', '❤️', '💕', '🔥', '✨', '🎉'];
        const textarea = document.querySelector('textarea[name="mensaje"]');
        
        // Crear picker simple
        const emojiPicker = document.createElement('div');
        emojiPicker.className = 'emoji-picker';
        emojiPicker.style.cssText = `
            position: absolute;
            bottom: 60px;
            right: 80px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
        `;

        emojis.forEach(emoji => {
            const emojiBtn = document.createElement('button');
            emojiBtn.textContent = emoji;
            emojiBtn.style.cssText = `
                border: none;
                background: none;
                font-size: 20px;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
            `;
            emojiBtn.addEventListener('click', () => {
                textarea.value += emoji;
                document.body.removeChild(emojiPicker);
                textarea.focus();
            });
            emojiPicker.appendChild(emojiBtn);
        });

        // Cerrar al hacer click fuera
        setTimeout(() => {
            const closeHandler = (e) => {
                if (!emojiPicker.contains(e.target)) {
                    document.body.removeChild(emojiPicker);
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 100);

        document.body.appendChild(emojiPicker);
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    scrollToBottom() {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    showNotification(message, type) {
        // Remover notificaciones existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            ${message}
            <button class="close-notification">&times;</button>
        `;

        const chatContainer = document.querySelector('.chat-container');
        chatContainer.insertBefore(notification, chatContainer.firstChild);

        // Agregar event listener para cerrar
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));

        // Auto-cerrar después de 5 segundos
        setTimeout(() => this.closeNotification(notification), 5000);
    }

    closeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    startAutoRefresh() {
        // Simular actualizaciones en tiempo real cada 30 segundos
        setInterval(() => {
            // Aquí se podría hacer fetch de nuevos mensajes desde el servidor
            console.log('Verificando nuevos mensajes...');
        }, 30000);
    }
}

// Inicializar el chat manager cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
});
