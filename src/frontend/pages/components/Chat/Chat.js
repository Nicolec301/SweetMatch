import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header';
import './Chat.css';

const Chat = () => {
  const [conversations, setConversations] = useState({});
  const [currentConversationId, setCurrentConversationId] = useState('sophia');
  const [messageInput, setMessageInput] = useState('');
  const [isConnected] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadCurrentUser();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = () => {
    // Datos por defecto - en una implementación real, estos vendrían de una API
    const defaultConversations = {
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

    setConversations(defaultConversations);
  };

  const loadCurrentUser = () => {
    // Simular carga del usuario actual - función mantenida para posible uso futuro
    console.log('Usuario actual simulado');
  };

  const getCurrentConversation = () => {
    return conversations[currentConversationId] || {};
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      contenido: messageInput,
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

    setMessageInput('');
    
    // Simular respuesta automática después de 1 segundo
    setTimeout(() => {
      simulateResponse();
    }, 1000);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentConversation = getCurrentConversation();

  return (
    <div>
      <Header />
      <div className="chat-container">
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
          />
          <button
            onClick={sendMessage}
            className="send-button"
            disabled={!messageInput.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Chat;
