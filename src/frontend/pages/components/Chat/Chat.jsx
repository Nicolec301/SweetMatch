import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../Header';
import ChatService from '../../../services/ChatService';
import SearchService from '../../../services/SearchService';
import SessionManager from '../../../services/SessionManager';
import './Chat.css';
import { io } from 'socket.io-client';
import { SOCKET_BASE_URL } from '../../../../config';

const Chat = () => {
  const [conversations, setConversations] = useState({});
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [newMessageUser, setNewMessageUser] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadUserConversations = useCallback(async () => {
    try {
      console.log('📋 Cargando conversaciones del usuario...');
      const result = await ChatService.getUserConversations();
      console.log('📋 Resultado de getUserConversations:', result);
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ Conversaciones encontradas:', result.data.length);
        
        // Convertir array de conversaciones a objeto con formato esperado
        const conversationsObj = {};
        
        result.data.forEach(conv => {
          console.log('🔄 Procesando conversación:', conv);
          
          // Formatear conversación de manera más simple
          const formattedConv = {
            nombre: conv.otro_usuario_nombre || 'Usuario Desconocido',
            imagen: conv.otro_usuario_foto || '/images/default-avatar.png',
            vista_previa: conv.ultimo_mensaje || 'Sin mensajes',
            tiempo_indicador: conv.ultimo_mensaje_fecha 
              ? new Date(conv.ultimo_mensaje_fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
              : 'Ahora',
            ultima_actividad: 'En línea',
            lastMessageAt: conv.ultimo_mensaje_fecha || new Date().toISOString(),
            mensajes: [] // Se cargarán después
          };
          
          console.log('💬 Conversación formateada:', formattedConv);
          conversationsObj[conv.id] = formattedConv;
        });
        
        console.log('📦 Objeto de conversaciones:', conversationsObj);
        
        // Establecer conversaciones sin sanitizar tanto
        setConversations(conversationsObj);
        
        // Seleccionar la primera conversación
        if (!currentConversationId && Object.keys(conversationsObj).length > 0) {
          const firstConvId = Object.keys(conversationsObj)[0];
          console.log('🎯 Seleccionando primera conversación:', firstConvId);
          setCurrentConversationId(firstConvId);
        }
      } else {
        console.log('📝 No hay conversaciones reales o resultado fallido');
        console.log('📝 Resultado completo:', result);
        
        // Solo usar datos por defecto si realmente no hay conversaciones
        if (!result.success) {
          console.error('❌ Error en la API:', result.error);
        }
        
        // Mantener vacío en lugar de usar defaults automáticamente
        setConversations({});
      }
    } catch (error) {
      console.error('💥 Error cargando conversaciones:', error);
      setError('Error al cargar las conversaciones');
      setConversations({});
    }
  }, [currentConversationId]);

  const loadConversationMessages = useCallback(async (conversationId) => {
    try {
      console.log('🔍 Cargando mensajes para conversación:', conversationId);
      
      // Si es una conversación de demostración, no hacer llamada a API
      if (isDefaultConversation(conversationId)) {
        console.log('📝 Conversación por defecto detectada, saltando carga de API');
        return;
      }

      console.log('🌐 Llamando a ChatService.getConversationMessages para ID:', conversationId);
      const result = await ChatService.getConversationMessages(conversationId);
      console.log('📨 Resultado de getConversationMessages:', result);
      
      if (result.success) {
        if (result.data && result.data.length > 0) {
          console.log('✅ Mensajes obtenidos exitosamente:', result.data.length, 'mensajes');
          
          const formattedMessages = result.data.map(msg => ({
            id: String(msg.id || Math.random()),
            contenido: String(msg.contenido || '[Mensaje sin contenido]'),
            hora: msg.fecha_envio 
              ? new Date(msg.fecha_envio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
              : 'Ahora',
            remitente: Boolean(msg.remitente_id === currentUser?.id),
            emisor: msg.remitente_id === currentUser?.id 
              ? 'Tú' 
              : (msg.remitente_nombre || 'Usuario'),
            leido: Boolean(msg.fecha_lectura),
            tipo: 'texto'
          }));
          
          console.log('💬 Mensajes formateados:', formattedMessages);
          
          setConversations(prev => ({
            ...prev,
            [conversationId]: {
              ...prev[conversationId],
              mensajes: formattedMessages
            }
          }));
        } else {
          console.log('📝 No hay mensajes en esta conversación');
          setConversations(prev => ({
            ...prev,
            [conversationId]: {
              ...prev[conversationId],
              mensajes: []
            }
          }));
        }
      } else {
        console.error('❌ Error en getConversationMessages:', result.error);
        setError('Error al cargar mensajes: ' + result.error);
      }
    } catch (error) {
      console.error('💥 Error cargando mensajes:', error);
      setError('Error al cargar mensajes');
    }
  }, [currentUser]);

  const initializeChat = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Verificar autenticación
      const sessionManager = SessionManager.getInstance();
      const user = sessionManager.getCurrentUser();
      if (!user?.id) {
        setError('Usuario no autenticado');
        return;
      }
      
      setCurrentUser(user);
      
      // Cargar conversaciones del usuario
      await loadUserConversations();
      
    } catch (error) {
      console.error('Error inicializando chat:', error);
      setError('Error al cargar el chat');
    } finally {
      setLoading(false);
    }
  }, [loadUserConversations]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // Configurar socket una vez que tenemos usuario
  useEffect(() => {
    if (!currentUser) return;
    if (!socketRef.current) {
      // Determinar URL base del socket (eliminar /api si quedó)
      let base = SOCKET_BASE_URL || window.location.origin;
      if (base.endsWith('/api')) base = base.replace(/\/api$/, '');
      console.log('🔗 Intentando conectar socket a:', base);
      const tried = new Set();
      const candidates = [];
      candidates.push(base);
      if (/3002$/.test(base)) candidates.push(base.replace(/3002$/, '3001'));
      else if (/3001$/.test(base)) candidates.push(base.replace(/3001$/, '3002'));
      else {
        candidates.push('http://localhost:3002', 'http://localhost:3001');
      }

      const attachCoreListeners = (s, url) => {
        s.on('message:new', (msg) => {
          console.log('🆕 Mensaje en tiempo real recibido:', msg);
          setConversations(prev => {
            const convId = String(msg.conversacion_id);
            let existingConv = prev[convId];
            if (!existingConv) {
              existingConv = {
                nombre: msg.remitente_id === currentUser.id ? 'Tú' : (msg.remitente_nombre || 'Usuario'),
                imagen: '/images/default-avatar.png',
                vista_previa: '',
                tiempo_indicador: 'Ahora',
                ultima_actividad: 'En línea',
                mensajes: []
              };
            }
            
            // Verificar si el mensaje ya existe para evitar duplicados
            const messageExists = existingConv.mensajes?.some(existingMsg => 
              String(existingMsg.id) === String(msg.id)
            );
            
            if (messageExists) {
              console.log('⚠️ Mensaje ya existe, evitando duplicado:', msg.id);
              return prev;
            }
            
            const formatted = {
              id: String(msg.id),
              contenido: String(msg.contenido),
              hora: String(new Date(msg.fecha_envio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })),
              remitente: Boolean(msg.remitente_id === currentUser.id),
              emisor: String(msg.remitente_id === currentUser.id ? 'Tú' : (msg.remitente_nombre || 'Usuario')),
              leido: Boolean(msg.leido || false),
              tipo: String('texto')
            };
            
            const updatedMessages = [...(existingConv.mensajes || []), formatted];
            // Mantener solo los últimos 50
            const trimmed = updatedMessages.slice(-50);
            return {
              ...prev,
              [convId]: {
                ...existingConv,
                vista_previa: formatted.contenido,
                tiempo_indicador: 'Ahora',
                lastMessageAt: msg.fecha_envio || new Date().toISOString(),
                mensajes: trimmed
              }
            };
          });
          scrollToBottom();
        });
        s.on('conversation:update', update => {
          console.log('🔔 conversation:update', update);
          setConversations(prev => {
            const id = String(update.conversacion_id);
            const existing = prev[id] || { mensajes: [] };
              return {
                ...prev,
                [id]: {
                  ...existing,
                  vista_previa: update.ultimo_mensaje || existing.vista_previa || 'Nuevo mensaje',
                  tiempo_indicador: 'Ahora',
                  lastMessageAt: update.fecha_envio || new Date().toISOString()
                }
              };
          });
        });
      };

      const connectCandidate = (index = 0) => {
        if (index >= candidates.length) {
          console.error('❌ No se pudo establecer conexión con ningún servidor de sockets.', candidates);
          return;
        }
        const url = candidates[index];
        if (tried.has(url)) return connectCandidate(index + 1);
        tried.add(url);
        console.log(`🔌 Intento de conexión (${index + 1}/${candidates.length}):`, url);
        const s = io(url, {
          path: '/socket.io',
          withCredentials: true,
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          reconnectionDelay: 800,
          timeout: 6000
        });
        socketRef.current = s;
        s.on('connect', () => {
          console.log('✅ Socket conectado:', url, 'id:', s.id);
          s.emit('joinUser', currentUser.id);
          if (currentConversationId) s.emit('joinConversation', currentConversationId);
        });
        s.on('connect_error', (err) => {
          console.error('❌ Error de conexión socket:', err.message, 'URL:', url);
          // Liberar este socket y probar siguiente candidato (si existe)
          try { s.removeAllListeners(); s.close(); } catch (_) {}
          if (index + 1 < candidates.length) {
            console.log('➡️ Probando siguiente endpoint de la lista...');
            connectCandidate(index + 1);
          } else {
            console.warn('⚠️ No quedan más endpoints para probar.');
          }
        });
        s.on('reconnect_attempt', (n) => console.log(`♻️ Reintento #${n} en ${url}`));
        s.on('reconnect', () => {
          console.log('🔄 Reconectado en', url);
          s.emit('joinUser', currentUser.id);
          if (currentConversationId) s.emit('joinConversation', currentConversationId);
        });
        attachCoreListeners(s, url);
      };
      connectCandidate(0);
    }
    // Unirse a sala de conversación actual
    if (socketRef.current && currentConversationId) {
      socketRef.current.emit('joinConversation', currentConversationId);
    }
  }, [currentUser, currentConversationId]);

  // Cleanup socket al desmontar
  useEffect(() => () => { if (socketRef.current) socketRef.current.disconnect(); }, []);

  useEffect(() => {
    if (currentConversationId) {
      loadConversationMessages(currentConversationId);
      scrollToBottom();
    }
  }, [currentConversationId, loadConversationMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const sendMessage = async () => {
    if (!messageInput.trim() || !currentConversationId || loading) return;

    const messageText = messageInput.trim();
    setMessageInput('');
    setLoading(true);

    try {
      // Si es conversación de demostración, usar comportamiento local
      if (isDefaultConversation(currentConversationId)) {
        sendDemoMessage(messageText);
        setLoading(false); // evitar quedarse en loading
        return;
      }

      // Enviar mensaje real a la API
      const result = await ChatService.sendMessage(currentConversationId, messageText);
      
      if (result.success) {
        // NO agregar el mensaje aquí directamente al estado local
        // El mensaje se agregará cuando llegue el evento 'message:new' del socket
        // Esto evita la duplicación de mensajes
        
        console.log('✅ Mensaje enviado exitosamente, esperando evento de socket...');

        // Marcar mensajes como leídos
        await ChatService.markAsRead(currentConversationId);
        
      } else {
        setError(result.error || 'Error al enviar mensaje');
        setMessageInput(messageText); // Restaurar mensaje si falla
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setError('Error al enviar mensaje');
      setMessageInput(messageText); // Restaurar mensaje si falla
    } finally {
      setLoading(false);
    }
  };

  const openNewMessageModal = async () => {
    try {
      setLoading(true);
      // Cargar usuarios disponibles para enviar mensajes
      const result = await SearchService.searchUsers({}, 1, 50);
      
      if (result.success) {
        const usersFormatted = result.data
          .filter(user => user.id !== currentUser?.id) // Excluir usuario actual
          .map(user => ({
            id: user.id,
            nombre: user.nombre,
            foto: user.foto_principal || '/images/default-avatar.png'
          }));
        
        setAvailableUsers(usersFormatted);
        setShowNewMessageModal(true);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeNewMessageModal = () => {
    setShowNewMessageModal(false);
    setNewMessageUser(null);
    setNewMessageText('');
  };

  const selectUserForNewMessage = (user) => {
    setNewMessageUser(user);
  };

  const sendNewMessage = async () => {
    if (!newMessageText.trim() || !newMessageUser || !currentUser) return;

    try {
      setLoading(true);
      const result = await SearchService.sendDirectMessage(
        newMessageUser.id, 
        newMessageText.trim(),
        currentUser.id
      );
      
      if (result.success) {
        alert('¡Mensaje enviado exitosamente!');
        closeNewMessageModal();
        // Recargar conversaciones para mostrar la nueva
        await loadUserConversations();
      } else {
        alert('Error al enviar mensaje: ' + result.error);
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar mensaje');
    } finally {
      setLoading(false);
    }
  };

  const sendDemoMessage = (messageText) => {
    // Comportamiento original para conversaciones de demostración
    const newMessage = {
      id: String(Date.now()),
      contenido: String(messageText || ''),
      hora: String(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })),
      remitente: Boolean(true),
      emisor: String("Tú"),
      leido: Boolean(false),
      tipo: String("texto")
    };

    console.log('📨 Demo mensaje completamente sanitizado:', newMessage);

    // Validar que no hay objetos anidados
    Object.keys(newMessage).forEach(key => {
      const value = newMessage[key];
      if (value !== null && typeof value === 'object') {
        console.error(`🚨 OBJETO ANIDADO en demo mensaje en ${key}:`, value);
        newMessage[key] = String(value);
      }
    });

    setConversations(prev => ({
      ...prev,
      [currentConversationId]: {
        ...prev[currentConversationId],
        mensajes: [...(prev[currentConversationId]?.mensajes || []), newMessage].slice(-50),
        lastMessageAt: new Date().toISOString(),
        vista_previa: newMessage.contenido,
        tiempo_indicador: 'Ahora'
      }
    }));
    
    // Simular respuesta automática después de 1 segundo
    setTimeout(() => {
      simulateResponse();
    }, 1000);
  };

  const isDefaultConversation = (conversationId) => {
    return ['sophia', 'andre', 'laura'].includes(conversationId);
  };

  const simulateResponse = () => {
    const currentConv = getCurrentConversation();
    const responses = [
      "¡Qué interesante!",
      "Me parece genial",
      "Cuéntame más sobre eso",
      "¡Totalmente de acuerdo!",
      "Eso suena divertido"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const responseMessage = {
      id: String(Date.now() + 1),
      contenido: String(randomResponse || ''),
      hora: String(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })),
      remitente: Boolean(false),
      emisor: String(currentConv.nombre || 'Usuario'),
      leido: Boolean(false),
      tipo: String("texto")
    };

    console.log('🤖 Respuesta simulada completamente sanitizada:', responseMessage);

    // Validar que no hay objetos anidados
    Object.keys(responseMessage).forEach(key => {
      const value = responseMessage[key];
      if (value !== null && typeof value === 'object') {
        console.error(`🚨 OBJETO ANIDADO en respuesta simulada en ${key}:`, value);
        responseMessage[key] = String(value);
      }
    });

    setConversations(prev => ({
      ...prev,
      [currentConversationId]: {
        ...prev[currentConversationId],
        mensajes: [...(prev[currentConversationId]?.mensajes || []), responseMessage].slice(-50),
        lastMessageAt: new Date().toISOString(),
        vista_previa: responseMessage.contenido,
        tiempo_indicador: 'Ahora'
      }
    }));
  };

  const getCurrentConversation = () => {
    return conversations[currentConversationId] || {};
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentConversation = getCurrentConversation();

  // Modal para nuevo mensaje
  const NewMessageModal = () => (
    <div className={`new-message-modal ${showNewMessageModal ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nuevo Mensaje</h3>
          <button onClick={closeNewMessageModal} className="close-btn">×</button>
        </div>
        
        {!newMessageUser ? (
          <div className="modal-body">
            <h4>Selecciona un usuario:</h4>
            <div className="users-list">
              {availableUsers.map(user => (
                <div
                  key={user.id}
                  className="user-item"
                  onClick={() => selectUserForNewMessage(user)}
                >
                  <img src={String(user.foto || '/images/default-avatar.png')} alt={String(user.nombre || 'Usuario')} className="user-avatar" />
                  <span className="user-name">{String(user.nombre || 'Usuario')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <div className="selected-user">
              <img src={String(newMessageUser.foto || '/images/default-avatar.png')} alt={String(newMessageUser.nombre || 'Usuario')} className="user-avatar" />
              <span>Enviar mensaje a {String(newMessageUser.nombre || 'Usuario')}</span>
              <button onClick={() => setNewMessageUser(null)} className="change-user-btn">
                Cambiar usuario
              </button>
            </div>
            <textarea
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Escribe tu mensaje..."
              rows={4}
              maxLength={500}
            />
            <div className="char-count">{newMessageText.length}/500</div>
          </div>
        )}
        
        <div className="modal-actions">
          <button onClick={closeNewMessageModal} className="btn-cancel">
            Cancelar
          </button>
          {newMessageUser && (
            <button 
              onClick={sendNewMessage}
              className="btn-send"
              disabled={!newMessageText.trim() || loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Mostrar loading inicial
  if (loading && Object.keys(conversations).length === 0) {
    return (
      <div>
        <Header />
        <div className="chat-container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <p>Cargando conversaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="chat-container">
        {error && (
          <div style={{ 
            background: '#ffebee', 
            color: '#c62828', 
            padding: '10px', 
            margin: '10px',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {String(error || 'Error desconocido')}
          </div>
        )}
        
        <div className="chat-sidebar">
          <div className="conversation-header">
            <h3>Conversaciones</h3>
            <button 
              onClick={openNewMessageModal}
              className="new-message-btn"
              disabled={loading}
              title="Nuevo mensaje"
            >
              ✉️
            </button>
            <button 
              onClick={() => console.log('🐛 Debug Info:', { conversations, currentConversationId, currentUser })}
              className="new-message-btn"
              title="Debug Info"
            >
              🐛
            </button>
            <button 
              onClick={async () => {
                console.log('🧪 Creando mensajes de prueba manualmente...');
                if (currentConversationId && !isDefaultConversation(currentConversationId)) {
                  await loadConversationMessages(currentConversationId);
                }
              }}
              className="new-message-btn"
              title="Cargar mensajes de prueba"
            >
              🧪
            </button>
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? 'En línea' : 'Sin conexión'}
            </div>
          </div>
          
          <div className="conversations-list">
            {Object.keys(conversations).length === 0 ? (
              <div className="empty-conversations">
                <p>No tienes conversaciones aún.</p>
                <button 
                  onClick={openNewMessageModal}
                  className="start-conversation-btn"
                >
                  Iniciar una conversación
                </button>
              </div>
            ) : (
              Object.entries(conversations)
                .sort((a,b) => new Date(b[1].lastMessageAt||0) - new Date(a[1].lastMessageAt||0))
                .map(([id, conv]) => (
                <div
                  key={id}
                  className={`conversation-item ${currentConversationId === id ? 'active' : ''}`}
                  onClick={() => setCurrentConversationId(id)}
                >
                  <div className="conversation-avatar">
                    <img src={conv.imagen || '/images/default-avatar.png'} alt={conv.nombre || 'Usuario'} />
                    <div className="status-indicator online"></div>
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name">{conv.nombre || 'Usuario'}</div>
                    <div className="conversation-preview">{conv.vista_previa || 'Sin mensajes'}</div>
                  </div>
                  <div className="conversation-meta">
                    <div className="time-indicator">{conv.tiempo_indicador || 'Ahora'}</div>
                    <div className="unread-indicator">•</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-user-info">
              <img 
                src={String(currentConversation.imagen || '/images/default-avatar.png')} 
                alt={String(currentConversation.nombre || 'Usuario')} 
                className="chat-avatar"
              />
              <div className="user-details">
                <h4>{currentConversation.nombre || 'Usuario'}</h4>
                <span className="user-status">{currentConversation.ultima_actividad || 'Desconocido'}</span>
              </div>
            </div>
            <div className="chat-actions">
              <button className="action-btn">📞</button>
              <button className="action-btn">📹</button>
              <button className="action-btn">ℹ️</button>
            </div>
          </div>

          <div className="messages-container">
            {currentConversation.mensajes?.map((message, index) => {
              // Log para debugging
              console.log(`🔍 Procesando mensaje ${index}:`, message);
              
              // Validación robusta para prevenir errores de renderizado
              if (!message || typeof message !== 'object') {
                console.error('🚨 Mensaje nulo o no es objeto:', message);
                return null;
              }

              // SANITIZACIÓN COMPLETA: Convertir CUALQUIER tipo de mensaje a formato seguro
              let safeMessage;
              
              try {
                // Verificar si el mensaje tiene propiedades del backend sin formatear
                const backendProps = ['fecha_envio', 'remitente_id', 'conversacion_id', 'fecha_lectura', 'remitente_nombre'];
                const hasBackendProps = backendProps.some(prop => message.hasOwnProperty(prop));
                
                if (hasBackendProps) {
                  console.warn('🚨 MENSAJE SIN FORMATEAR DETECTADO - Reformateando objeto backend:', message);
                  
                  // Formatear mensaje del backend
                  safeMessage = {
                    id: String(message.id || Math.random()),
                    contenido: String(message.contenido || '[Mensaje sin contenido]'),
                    hora: message.fecha_envio 
                      ? new Date(message.fecha_envio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) 
                      : 'Ahora',
                    remitente: Boolean(message.remitente_id === currentUser?.id),
                    emisor: message.remitente_id === currentUser?.id 
                      ? 'Tú' 
                      : String(message.remitente_nombre || 'Usuario'),
                    leido: Boolean(message.leido || message.fecha_lectura),
                    tipo: 'texto'
                  };
                } else {
                  // Mensaje ya formateado, pero asegurar que todos los valores sean primitivos
                  safeMessage = {
                    id: String(message.id || Math.random()),
                    contenido: String(message.contenido || '[Mensaje sin contenido]'),
                    hora: String(message.hora || 'Ahora'),
                    remitente: Boolean(message.remitente),
                    emisor: String(message.emisor || 'Usuario'),
                    leido: Boolean(message.leido),
                    tipo: String(message.tipo || 'texto')
                  };
                }

                // Validación final - asegurar que NO hay objetos anidados
                Object.keys(safeMessage).forEach(key => {
                  const value = safeMessage[key];
                  if (value !== null && typeof value === 'object') {
                    console.error(`🚨 OBJETO ANIDADO DETECTADO en ${key}:`, value);
                    safeMessage[key] = String(value);
                  }
                });

                console.log(`✅ Mensaje completamente sanitizado ${index}:`, safeMessage);

              } catch (error) {
                console.error('� Error sanitizando mensaje:', error);
                // Crear mensaje de error seguro
                safeMessage = {
                  id: String(Math.random()),
                  contenido: '[Error procesando mensaje]',
                  hora: 'Ahora',
                  remitente: false,
                  emisor: 'Sistema',
                  leido: false,
                  tipo: 'texto'
                };
              }

              // Render final con validación de contenido
              if (!safeMessage.contenido || typeof safeMessage.contenido !== 'string') {
                console.error('🚨 Contenido final inválido:', safeMessage.contenido);
                return null;
              }

              return (
                <div
                  key={safeMessage.id}
                  className={`message ${safeMessage.remitente ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <div className="message-text">{safeMessage.contenido}</div>
                    <div className="message-time">
                      {safeMessage.hora}
                      {safeMessage.remitente && (
                        <span className={`message-status ${safeMessage.leido ? 'read' : 'sent'}`}>
                          {safeMessage.leido ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-container">
            <div className="input-actions">
              <button className="input-action">😊</button>
              <button className="input-action">📎</button>
            </div>
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="message-input"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="send-button"
              disabled={!messageInput.trim() || loading}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de nuevo mensaje */}
      <NewMessageModal />
    </div>
  );
};

export default Chat;
