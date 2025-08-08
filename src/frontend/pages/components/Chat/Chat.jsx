import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../Header';
import ChatService from '../../../../services/ChatService';
import SessionManager from '../../../../services/sessionUtils';
import './Chat.css';

const Chat = () => {
  const [conversations, setConversations] = useState({});
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadUserConversations = useCallback(async () => {
    try {
      const result = await ChatService.getUserConversations();
      
      if (result.success && result.data.length > 0) {
        // Convertir array de conversaciones a objeto con formato esperado
        const conversationsObj = {};
        
        result.data.forEach(conv => {
          const formattedConv = ChatService.formatConversationForDisplay(conv, currentUser?.id);
          if (formattedConv) {
            conversationsObj[conv.id] = formattedConv;
          }
        });
        
        setConversations(conversationsObj);
        
        // Seleccionar la primera conversación si no hay una seleccionada
        if (!currentConversationId && Object.keys(conversationsObj).length > 0) {
          const firstConvId = Object.keys(conversationsObj)[0];
          setCurrentConversationId(firstConvId);
        }
      } else {
        // Mantener datos por defecto si no hay conversaciones reales
        setConversations(getDefaultConversations());
        setCurrentConversationId('sophia');
      }
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
      // Usar datos por defecto en caso de error
      setConversations(getDefaultConversations());
      setCurrentConversationId('sophia');
    }
  }, [currentUser, currentConversationId]);

  const loadConversationMessages = useCallback(async (conversationId) => {
    try {
      // Si es una conversación de demostración, no hacer llamada a API
      if (isDefaultConversation(conversationId)) {
        return;
      }

      const result = await ChatService.getConversationMessages(conversationId);
      
      if (result.success) {
        const formattedMessages = result.data.map(msg => 
          ChatService.formatMessageForDisplay(msg, currentUser?.id)
        );
        
        setConversations(prev => ({
          ...prev,
          [conversationId]: {
            ...prev[conversationId],
            mensajes: formattedMessages
          }
        }));
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  }, [currentUser]);

  const initializeChat = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Verificar autenticación
      const user = SessionManager.getCurrentUser();
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
        return;
      }

      // Enviar mensaje real a la API
      const result = await ChatService.sendMessage(currentConversationId, messageText);
      
      if (result.success) {
        // Agregar mensaje enviado localmente
        const newMessage = {
          id: result.data.id || Date.now(),
          contenido: messageText,
          hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          remitente: true,
          emisor: 'Tú',
          leido: false,
          tipo: 'texto'
        };

        setConversations(prev => ({
          ...prev,
          [currentConversationId]: {
            ...prev[currentConversationId],
            mensajes: [...(prev[currentConversationId]?.mensajes || []), newMessage]
          }
        }));

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

  const sendDemoMessage = (messageText) => {
    // Comportamiento original para conversaciones de demostración
    const newMessage = {
      id: Date.now(),
      contenido: messageText,
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      remitente: true,
      emisor: "Tú",
      leido: false,
      tipo: "texto"
    };

    setConversations(prev => ({
      ...prev,
      [currentConversationId]: {
        ...prev[currentConversationId],
        mensajes: [...(prev[currentConversationId]?.mensajes || []), newMessage]
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

  const getDefaultConversations = () => {
    // Datos por defecto - mantener para demostración
    return {
      sophia: {
        nombre: "Sofía Martínez",
        imagen: "/images/Sofia.png",
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
        imagen: "/images/andres.png",
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
            contenido: "Todo bien, ¿y tú?",
            hora: "12:20",
            remitente: true,
            emisor: "Tú",
            leido: true,
            tipo: "texto"
          }
        ]
      },
      laura: {
        nombre: "Laura Fernández",
        imagen: "/images/laura.png",
        vista_previa: "Me encanta esa canción!",
        tiempo_indicador: "3d",
        ultima_actividad: "Hace 1 día",
        mensajes: [
          {
            id: 1,
            contenido: "¿Has escuchado la nueva canción de...?",
            hora: "10:00",
            remitente: false,
            emisor: "Laura",
            leido: true,
            tipo: "texto"
          }
        ]
      }
    };
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
      id: Date.now() + 1,
      contenido: randomResponse,
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      remitente: false,
      emisor: currentConv.nombre,
      leido: false,
      tipo: "texto"
    };

    setConversations(prev => ({
      ...prev,
      [currentConversationId]: {
        ...prev[currentConversationId],
        mensajes: [...(prev[currentConversationId]?.mensajes || []), responseMessage]
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
            {error}
          </div>
        )}
        
        <div className="chat-sidebar">
          <div className="conversation-header">
            <h3>Conversaciones</h3>
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? 'En línea' : 'Sin conexión'}
            </div>
          </div>
          
          <div className="conversations-list">
            {Object.entries(conversations).map(([id, conv]) => (
              <div
                key={id}
                className={`conversation-item ${currentConversationId === id ? 'active' : ''}`}
                onClick={() => setCurrentConversationId(id)}
              >
                <div className="conversation-avatar">
                  <img src={conv.imagen} alt={conv.nombre} />
                  <div className="status-indicator online"></div>
                </div>
                <div className="conversation-info">
                  <div className="conversation-name">{conv.nombre}</div>
                  <div className="conversation-preview">{conv.vista_previa}</div>
                </div>
                <div className="conversation-meta">
                  <div className="time-indicator">{conv.tiempo_indicador}</div>
                  <div className="unread-indicator">2</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-user-info">
              <img 
                src={currentConversation.imagen} 
                alt={currentConversation.nombre} 
                className="chat-avatar"
              />
              <div className="user-details">
                <h4>{currentConversation.nombre}</h4>
                <span className="user-status">{currentConversation.ultima_actividad}</span>
              </div>
            </div>
            <div className="chat-actions">
              <button className="action-btn">📞</button>
              <button className="action-btn">📹</button>
              <button className="action-btn">ℹ️</button>
            </div>
          </div>

          <div className="messages-container">
            {currentConversation.mensajes?.map((message) => (
              <div
                key={message.id}
                className={`message ${message.remitente ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <div className="message-text">{message.contenido}</div>
                  <div className="message-time">
                    {message.hora}
                    {message.remitente && (
                      <span className={`message-status ${message.leido ? 'read' : 'sent'}`}>
                        {message.leido ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default Chat;
