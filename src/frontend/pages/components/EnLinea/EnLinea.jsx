import React, { useState, useEffect } from 'react';
import Header from '../Header';
import './EnLinea.css';

const EnLinea = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOnlineUsers();
    
    // Simular actualización en tiempo real
    const interval = setInterval(() => {
      updateUserStatus();
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const loadOnlineUsers = () => {
    // Simular datos de usuarios en línea
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
        ultimaActividad: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos ago
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
        ultimaActividad: new Date(Date.now() - 2 * 60 * 1000), // 2 minutos ago
        estado: 'en_linea',
        distancia: 3.2,
        descripcion: 'Doctora veterinaria, amo a los animales.',
        interesesComunes: ['animales', 'naturaleza'],
        verificada: true
      },
      {
        id: 4,
        nombre: 'Carlos Mendoza',
        edad: 28,
        foto: '/images/tomas.png',
        ultimaActividad: new Date(Date.now() - 8 * 60 * 1000), // 8 minutos ago
        estado: 'en_linea',
        distancia: 5.1,
        descripcion: 'Amante del deporte y la vida saludable.',
        interesesComunes: ['deporte', 'fitness'],
        verificada: true
      },
      {
        id: 5,
        nombre: 'Miguel Torres',
        edad: 32,
        foto: '/images/andres.png',
        ultimaActividad: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos ago
        estado: 'recientemente_activo',
        distancia: 7.8,
        descripcion: 'Ingeniero apasionado por la tecnología.',
        interesesComunes: ['tecnología', 'gaming'],
        verificada: true
      },
      {
        id: 6,
        nombre: 'Patricia López',
        edad: 26,
        foto: '/images/chica.jpg',
        ultimaActividad: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos ago
        estado: 'recientemente_activo',
        distancia: 4.3,
        descripcion: 'Profesora y amante de la lectura.',
        interesesComunes: ['lectura', 'educación'],
        verificada: false
      }
    ];

    setOnlineUsers(mockUsers);
    setLoading(false);
  };

  const updateUserStatus = () => {
    setOnlineUsers(prevUsers => 
      prevUsers.map(user => {
        // Simular cambios aleatorios en el estado
        const timeSinceLastActivity = Date.now() - user.ultimaActividad.getTime();
        
        if (timeSinceLastActivity > 20 * 60 * 1000) { // Más de 20 minutos
          return { ...user, estado: 'recientemente_activo' };
        }
        
        return user;
      })
    );
  };

  const getFilteredUsers = () => {
    switch (filter) {
      case 'en_linea':
        return onlineUsers.filter(user => user.estado === 'en_linea');
      case 'recientemente_activo':
        return onlineUsers.filter(user => user.estado === 'recientemente_activo');
      case 'verificados':
        return onlineUsers.filter(user => user.verificada);
      case 'cerca':
        return onlineUsers.filter(user => user.distancia <= 5);
      default:
        return onlineUsers;
    }
  };

  const formatLastActivity = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  const sendMessage = (user) => {
    console.log('Enviando mensaje a:', user.nombre);
    // Aquí se abriría el chat con el usuario
  };

  const likeUser = (user) => {
    console.log('Me gusta:', user.nombre);
    // Aquí se enviaría el like
  };

  const viewProfile = (user) => {
    console.log('Ver perfil de:', user.nombre);
    // Aquí se abriría el perfil completo
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
