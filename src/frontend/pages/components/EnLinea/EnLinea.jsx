import React, { useState, useEffect } from 'react';
import Header from '../Header';
import OnlineUsersService from '../../../services/OnlineUsersService.js';
import SessionManager from '../../../services/SessionManager.js';
import './EnLinea.css';

const EnLinea = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [loading, setLoading] = useState(true);
  const sessionManager = new SessionManager();

  useEffect(() => {
    loadOnlineUsers();
    
    // Configurar actualización automática cada 30 segundos
    const interval = setInterval(() => {
      updateUserStatus();
    }, 30000);

    // Cleanup al desmontar el componente
    return () => {
      clearInterval(interval);
      OnlineUsersService.setUserOffline(); // Marcar como offline al salir
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOnlineUsers = async () => {
    try {
      setLoading(true);
      
      // Verificar autenticación
      if (!sessionManager.isAuthenticated()) {
        console.warn('Usuario no autenticado');
        setOnlineUsers([]);
        return;
      }

      // Marcar usuario actual como online
      await OnlineUsersService.setUserOnline();
      
      // Obtener usuarios en línea desde el backend
      const result = await OnlineUsersService.getOnlineUsers({
        includeLocation: true,
        includePhotos: true,
        maxDistance: 50 // km
      });

      if (result.success && result.users) {
        // Procesar usuarios para agregar estado y formato
        const processedUsers = result.users.map(user => ({
          ...user,
          estado: OnlineUsersService.getUserStatus(user.ultima_actividad),
          ultimaActividad: user.ultima_actividad ? new Date(user.ultima_actividad) : new Date(),
          foto: OnlineUsersService.getImageUrl(user.foto),
          verificada: user.verificado === true,
          interesesComunes: user.intereses_comunes || user.intereses || [],
          distancia: user.distancia || Math.random() * 10 // Fallback temporal
        }));

        setOnlineUsers(processedUsers);
      } else {
        console.error('Error cargando usuarios:', result.error);
        // Fallback a datos mock en caso de error
        loadMockUsers();
      }
    } catch (error) {
      console.error('Error en loadOnlineUsers:', error);
      // Fallback a datos mock en caso de error
      loadMockUsers();
    } finally {
      setLoading(false);
    }
  };

  const loadMockUsers = () => {
    // Datos de respaldo en caso de error con el backend
    const mockUsers = [
      {
        id: 1,
        nombre: 'Ana García',
        edad: 25,
        foto: '/images/chica.jpg',
        ultimaActividad: new Date(),
        estado: 'en_linea',
        distancia: 2.5,
        descripcion: 'Me encanta viajar y conocer nuevas culturas.',
        interesesComunes: ['viajes', 'fotografía', 'música'],
        verificada: true
      },
      {
        id: 2,
        nombre: 'Sofía Martínez',
        edad: 23,
        foto: '/images/Sofia.png',
        ultimaActividad: new Date(Date.now() - 5 * 60 * 1000),
        estado: 'en_linea',
        distancia: 1.8,
        descripcion: 'Estudiante de arte, me fascina la creatividad.',
        interesesComunes: ['arte', 'música'],
        verificada: false
      },
      {
        id: 3,
        nombre: 'Laura Fernández',
        edad: 27,
        foto: '/images/laura.png',
        ultimaActividad: new Date(Date.now() - 2 * 60 * 1000),
        estado: 'en_linea',
        distancia: 3.2,
        descripcion: 'Doctora veterinaria, amo a los animales.',
        interesesComunes: ['animales', 'naturaleza'],
        verificada: true
      }
    ];
    setOnlineUsers(mockUsers);
  };

  const updateUserStatus = async () => {
    try {
      // Recargar usuarios en línea desde el backend
      const result = await OnlineUsersService.getOnlineUsers({
        includeLocation: true,
        includePhotos: true,
        maxDistance: 50
      });

      if (result.success && result.users) {
        const processedUsers = result.users.map(user => ({
          ...user,
          estado: OnlineUsersService.getUserStatus(user.ultima_actividad),
          ultimaActividad: user.ultima_actividad ? new Date(user.ultima_actividad) : new Date(),
          foto: OnlineUsersService.getImageUrl(user.foto),
          verificada: user.verificado === true,
          interesesComunes: user.intereses_comunes || user.intereses || [],
          distancia: user.distancia || Math.random() * 10
        }));

        setOnlineUsers(processedUsers);
      }
    } catch (error) {
      console.error('Error actualizando usuarios:', error);
      // Si falla la actualización, mantener usuarios actuales
      // pero actualizar sus estados basado en tiempo transcurrido
      setOnlineUsers(prevUsers => 
        prevUsers.map(user => {
          const timeSinceLastActivity = Date.now() - user.ultimaActividad.getTime();
          
          if (timeSinceLastActivity > 20 * 60 * 1000) { // Más de 20 minutos
            return { ...user, estado: 'recientemente_activo' };
          }
          
          return user;
        })
      );
    }
  };

  const getFilteredUsers = () => {
    return OnlineUsersService.filterUsers(onlineUsers, filter);
  };

  const formatLastActivity = (date) => {
    return OnlineUsersService.formatLastActivity(date);
  };

  const sendMessage = async (user) => {
    try {
      const result = await OnlineUsersService.startConversation(user.id);
      if (result.success) {
        console.log('Conversación iniciada con:', user.nombre);
        // Aquí podrías redirigir al chat o abrir modal de mensaje
        // window.location.href = `/chat/${result.conversation.id}`;
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al iniciar conversación');
    }
  };

  const likeUser = async (user) => {
    try {
      const result = await OnlineUsersService.likeUser(user.id);
      if (result.success) {
        console.log('Like enviado a:', user.nombre);
        if (result.match) {
          alert(`¡Es un match con ${user.nombre}! 💖`);
        } else {
          alert(`Like enviado a ${user.nombre} ❤️`);
        }
      }
    } catch (error) {
      console.error('Error enviando like:', error);
      alert('Error al enviar like');
    }
  };

  const viewProfile = (user) => {
    console.log('Ver perfil de:', user.nombre);
    // Aquí podrías abrir modal del perfil o redirigir
    // window.location.href = `/perfil/${user.id}`;
  };

  const filteredUsers = getFilteredUsers();

  if (loading) {
    return (
      <div className="en-linea-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Buscando usuarios en línea...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="en-linea-container">
      <div className="online-header">
        <div className="header-info">
          <h2>Usuarios en Línea</h2>
          <p>Encuentra personas activas ahora mismo</p>
        </div>
        <div className="online-count">
          <span className="count-badge">{filteredUsers.length}</span>
          <span>usuarios encontrados</span>
        </div>
      </div>

      <div className="filters-container">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'todos' ? 'active' : ''}`}
            onClick={() => setFilter('todos')}
          >
            Todos ({onlineUsers.length})
          </button>
          <button
            className={`filter-tab ${filter === 'en_linea' ? 'active' : ''}`}
            onClick={() => setFilter('en_linea')}
          >
            🟢 En línea ({onlineUsers.filter(u => u.estado === 'en_linea').length})
          </button>
          <button
            className={`filter-tab ${filter === 'recientemente_activo' ? 'active' : ''}`}
            onClick={() => setFilter('recientemente_activo')}
          >
            🟡 Recientemente ({onlineUsers.filter(u => u.estado === 'recientemente_activo').length})
          </button>
          <button
            className={`filter-tab ${filter === 'verificados' ? 'active' : ''}`}
            onClick={() => setFilter('verificados')}
          >
            ✓ Verificados ({onlineUsers.filter(u => u.verificada).length})
          </button>
          <button
            className={`filter-tab ${filter === 'cerca' ? 'active' : ''}`}
            onClick={() => setFilter('cerca')}
          >
            📍 Cerca ({onlineUsers.filter(u => u.distancia <= 5).length})
          </button>
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-image-container">
              <img 
                src={user.foto} 
                alt={user.nombre}
                className="user-image"
                onClick={() => viewProfile(user)}
              />
              <div className={`status-indicator ${user.estado}`}>
                {user.estado === 'en_linea' ? '🟢' : '🟡'}
              </div>
              {user.verificada && (
                <div className="verified-badge">✓</div>
              )}
            </div>

            <div className="user-info">
              <div className="user-name-age">
                <h3>{user.nombre}, {user.edad}</h3>
                <span className="distance">📍 {user.distancia} km</span>
              </div>

              <div className="last-activity">
                {formatLastActivity(user.ultimaActividad)}
              </div>

              <div className="user-description">
                <p>{user.descripcion}</p>
              </div>

              {user.interesesComunes.length > 0 && (
                <div className="common-interests">
                  <span className="interests-label">Intereses comunes:</span>
                  <div className="interests-tags">
                    {user.interesesComunes.slice(0, 3).map(interes => (
                      <span key={interes} className="interest-tag">
                        {interes}
                      </span>
                    ))}
                    {user.interesesComunes.length > 3 && (
                      <span className="more-interests">
                        +{user.interesesComunes.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="user-actions">
                <button 
                  className="action-btn like-btn"
                  onClick={() => likeUser(user)}
                  title="Me gusta"
                >
                  💖
                </button>
                <button 
                  className="action-btn message-btn"
                  onClick={() => sendMessage(user)}
                  title="Enviar mensaje"
                >
                  💬
                </button>
                <button 
                  className="action-btn profile-btn"
                  onClick={() => viewProfile(user)}
                  title="Ver perfil"
                >
                  👁️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No hay usuarios en línea</h3>
          <p>Intenta cambiar los filtros o vuelve más tarde</p>
        </div>
      )}

      <div className="refresh-info">
        <p>
          <span className="refresh-icon">🔄</span>
          Los usuarios se actualizan automáticamente cada 30 segundos
        </p>
      </div>
    </div>
    </div>
  );
};

export default EnLinea;
