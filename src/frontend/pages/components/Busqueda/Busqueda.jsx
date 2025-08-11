import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionManager from '../../../../backend/services/SessionManager';
import SearchService from '../../../../backend/services/SearchService';
import Header from '../Header';
import './Busqueda.css';

const Busqueda = () => {
  const navigate = useNavigate();
  const sessionManager = SessionManager.getInstance();
  const currentUser = sessionManager.getCurrentUser();

  const [searchFilters, setSearchFilters] = useState({
    edad: { min: 18, max: 35 },
    distancia: 50,
    genero: 'ambos',
    intereses: [],
    estado: 'todos'
  });

  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [availableInterests, setAvailableInterests] = useState([]);
  const [loading, setLoading] = useState(false); // loading general (filtros / perfiles)
  const [sendingMessage, setSendingMessage] = useState(false); // estado solo para enviar mensaje directo
  const [error, setError] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const messageTextareaRef = useRef(null);

  // Verificar autenticación y perfil completado
  useEffect(() => {
    if (!sessionManager.isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (currentUser && !currentUser.perfil_completado) {
      navigate('/complete-profile');
      return;
    }
  }, [sessionManager, navigate, currentUser]);

  // --- mover definición de loadProfiles antes de este efecto ---

  useEffect(() => {
    const applyFilters = () => {
      // Verificar que profiles esté definido y sea un array
      if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
        setFilteredProfiles([]);
        setCurrentProfileIndex(0);
        return;
      }

      let filtered = profiles.filter(profile => {
        // Filtro por edad
        if (profile.edad < searchFilters.edad.min || profile.edad > searchFilters.edad.max) {
          return false;
        }

        // Filtro por distancia
        if (profile.distancia > searchFilters.distancia) {
          return false;
        }

        // Filtro por género
        if (searchFilters.genero !== 'ambos' && profile.genero !== searchFilters.genero) {
          return false;
        }

        // Filtro por estado
        if (searchFilters.estado !== 'todos' && profile.estado !== searchFilters.estado) {
          return false;
        }

        // Filtro por intereses (al menos uno en común)
        if (searchFilters.intereses.length > 0) {
          const hasCommonInterest = searchFilters.intereses.some(interes => 
            profile.intereses.includes(interes)
          );
          if (!hasCommonInterest) {
            return false;
          }
        }

        return true;
      });

      setFilteredProfiles(filtered);
      setCurrentProfileIndex(0);
    };

    applyFilters();
  }, [searchFilters, profiles]);

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Construir filtros para la API
      const apiFilters = {
        edadMin: searchFilters.edad.min,
        edadMax: searchFilters.edad.max,
        distancia: searchFilters.distancia,
        genero: searchFilters.genero !== 'ambos' ? searchFilters.genero : undefined,
        intereses: searchFilters.intereses,
        estado: searchFilters.estado !== 'todos' ? searchFilters.estado : undefined,
        excluirUsuario: currentUser?.id
      };

      // Filtrar valores undefined
      const cleanFilters = Object.fromEntries(
        Object.entries(apiFilters).filter(([_, value]) => value !== undefined)
      );

      const result = await SearchService.searchUsers(cleanFilters, 1, 50);
      
      if (result.success && result.data) {
        const formattedProfiles = result.data.map(user => 
          SearchService.formatUserForDisplay(user)
        );
        setProfiles(formattedProfiles);
      } else {
        // Fallback a datos simulados en caso de error
        console.warn('Error en API, usando datos simulados:', result.error);
        setProfiles(getMockProfiles());
      }
    } catch (error) {
      console.error('Error cargando perfiles:', error);
      setError('Error al cargar perfiles');
      setProfiles(getMockProfiles());
    } finally {
      setLoading(false);
    }
  }, [searchFilters, currentUser]);

  // Efecto inicial para cargar datos
  useEffect(() => {
    loadProfiles();
    loadInterests();
  }, [loadProfiles]);

  const loadInterests = async () => {
    try {
      const result = await SearchService.getAvailableInterests();
      if (result.success && result.data) {
        setAvailableInterests(result.data);
      }
    } catch (error) {
      console.error('Error cargando intereses:', error);
      setAvailableInterests([
        'viajes', 'fotografía', 'música', 'cocina', 'deporte', 'cine', 
        'fitness', 'lectura', 'arte', 'pintura', 'museos', 'café',
        'tecnología', 'gaming', 'programación', 'ciencia', 'animales', 
        'naturaleza', 'senderismo', 'veterinaria'
      ]);
    }
  };

  const getMockProfiles = () => {
    // Datos de perfiles simulados como fallback
    const mockProfiles = [
      {
        id: 1,
        nombre: 'Ana García',
        edad: 25,
        distancia: 5,
        genero: 'femenino',
        foto: '/images/chica.jpg',
        descripcion: 'Me encanta viajar y conocer nuevas culturas. Buscando alguien con quien compartir aventuras.',
        intereses: ['viajes', 'fotografía', 'música', 'cocina'],
        estado: 'en_linea',
        verificada: true
      },
      {
        id: 2,
        nombre: 'Carlos Mendoza',
        edad: 28,
        distancia: 12,
        genero: 'masculino',
        foto: '/images/tomas.png',
        descripcion: 'Amante del deporte y la vida saludable. Me gusta el cine y las buenas conversaciones.',
        intereses: ['deporte', 'cine', 'fitness', 'lectura'],
        estado: 'en_linea',
        verificada: true
      },
      {
        id: 3,
        nombre: 'Sofía Martínez',
        edad: 23,
        distancia: 8,
        genero: 'femenino',
        foto: '/images/Sofia.png',
        descripcion: 'Estudiante de arte, me fascina la creatividad en todas sus formas.',
        intereses: ['arte', 'pintura', 'museos', 'café'],
        estado: 'recientemente_activa',
        verificada: false
      },
      {
        id: 4,
        nombre: 'Miguel Torres',
        edad: 32,
        distancia: 25,
        genero: 'masculino',
        foto: '/images/andres.png',
        descripcion: 'Ingeniero apasionado por la tecnología y los videojuegos.',
        intereses: ['tecnología', 'gaming', 'programación', 'ciencia'],
        estado: 'en_linea',
        verificada: true
      },
      {
        id: 5,
        nombre: 'Laura Fernández',
        edad: 27,
        distancia: 15,
        genero: 'femenino',
        foto: '/images/laura.png',
        descripcion: 'Doctora veterinaria, amo a los animales y la naturaleza.',
        intereses: ['animales', 'naturaleza', 'senderismo', 'veterinaria'],
        estado: 'en_linea',
        verificada: true
      }
    ];

    setProfiles(mockProfiles);
  };

  // Recargar perfiles cuando cambien los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('Filtros aplicados:', searchFilters);
      loadProfiles();
    }, 500); // Debounce para evitar demasiadas llamadas

    return () => clearTimeout(timeoutId);
  }, [searchFilters, loadProfiles]);

  const handleFilterChange = (filterType, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleInterestToggle = (interes) => {
    setSearchFilters(prev => ({
      ...prev,
      intereses: prev.intereses.includes(interes)
        ? prev.intereses.filter(i => i !== interes)
        : [...prev.intereses, interes]
    }));
  };

  const nextProfile = () => {
    if (currentProfileIndex < filteredProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    }
  };

  const previousProfile = () => {
    if (currentProfileIndex > 0) {
      setCurrentProfileIndex(currentProfileIndex - 1);
    }
  };

  const likeProfile = async () => {
    try {
      const profile = filteredProfiles[currentProfileIndex];
      if (!profile) return;

      setLoading(true);
      const result = await SearchService.likeProfile(profile.id);
      
      if (result.success) {
        console.log('Profile liked:', profile);
        // Mostrar notificación de éxito si es necesario
        if (result.data?.isMatch) {
          alert('¡Es un match! 💖');
        }
      } else {
        console.error('Error dando like:', result.error);
      }
    } catch (error) {
      console.error('Error dando like:', error);
    } finally {
      setLoading(false);
      nextProfile();
    }
  };

  const passProfile = async () => {
    try {
      const profile = filteredProfiles[currentProfileIndex];
      if (!profile) return;

      setLoading(true);
      const result = await SearchService.passProfile(profile.id);
      
      if (result.success) {
        console.log('Profile passed:', profile);
      } else {
        console.error('Error pasando perfil:', result.error);
      }
    } catch (error) {
      console.error('Error pasando perfil:', error);
    } finally {
      setLoading(false);
      nextProfile();
    }
  };

  const openMessageModal = (user) => {
    setSelectedUser(user);
    setShowMessageModal(true);
    setMessageText('');
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setSelectedUser(null);
    setMessageText('');
  };

  // Enfocar automáticamente el textarea al abrir el modal
  useEffect(() => {
    if (showMessageModal && messageTextareaRef.current) {
      // Usar requestAnimationFrame para enfocar después del render completo
      const focusTextarea = () => {
        const textarea = messageTextareaRef.current;
        if (textarea) {
          textarea.focus();
        }
      };
      
      requestAnimationFrame(focusTextarea);
    }
  }, [showMessageModal]);

  const sendDirectMessage = async () => {
    if (!messageText.trim() || !selectedUser || !currentUser || sendingMessage) return;

    try {
      setSendingMessage(true);
      const textToSend = messageText.trim();
      const result = await SearchService.sendDirectMessage(
        selectedUser.id, 
        textToSend,
        currentUser.id
      );
      
      if (result.success) {
        alert('¡Mensaje enviado exitosamente!');
        closeMessageModal();
      } else {
        alert('Error al enviar mensaje: ' + result.error);
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar mensaje');
    } finally {
      setSendingMessage(false);
    }
  };

  const currentProfile = filteredProfiles[currentProfileIndex];

  // Eliminado componente interno para evitar remount que mueve el cursor al inicio.
  // Se renderiza inline más abajo sólo cuando showMessageModal es true.

  return (
    <div>
      <Header />
      <div className="busqueda-container">
      {error && (
        <div style={{background:'#ffebee',color:'#c62828',padding:'8px',margin:'8px 0',borderRadius:'4px'}}>{error}</div>
      )}
      <div className="search-sidebar">
        <div className="search-header">
          <h3>Filtros de Búsqueda</h3>
          <button 
            className="clear-filters"
            onClick={() => setSearchFilters({
              edad: { min: 18, max: 35 },
              distancia: 50,
              genero: 'ambos',
              intereses: [],
              estado: 'todos'
            })}
          >
            Limpiar
          </button>
        </div>

        <div className="filter-section">
          <h4>Edad</h4>
          <div className="age-filter">
            <input
              type="range"
              min="18"
              max="65"
              value={searchFilters.edad.min}
              onChange={(e) => handleFilterChange('edad', {
                ...searchFilters.edad,
                min: parseInt(e.target.value)
              })}
            />
            <input
              type="range"
              min="18"
              max="65"
              value={searchFilters.edad.max}
              onChange={(e) => handleFilterChange('edad', {
                ...searchFilters.edad,
                max: parseInt(e.target.value)
              })}
            />
            <div className="age-display">
              {searchFilters.edad.min} - {searchFilters.edad.max} años
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h4>Distancia</h4>
          <div className="distance-filter">
            <input
              type="range"
              min="1"
              max="100"
              value={searchFilters.distancia}
              onChange={(e) => handleFilterChange('distancia', parseInt(e.target.value))}
            />
            <div className="distance-display">
              Hasta {searchFilters.distancia} km
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h4>Género</h4>
          <div className="gender-filter">
            <label>
              <input
                type="radio"
                name="genero"
                value="ambos"
                checked={searchFilters.genero === 'ambos'}
                onChange={(e) => handleFilterChange('genero', e.target.value)}
              />
              Ambos
            </label>
            <label>
              <input
                type="radio"
                name="genero"
                value="femenino"
                checked={searchFilters.genero === 'femenino'}
                onChange={(e) => handleFilterChange('genero', e.target.value)}
              />
              Mujeres
            </label>
            <label>
              <input
                type="radio"
                name="genero"
                value="masculino"
                checked={searchFilters.genero === 'masculino'}
                onChange={(e) => handleFilterChange('genero', e.target.value)}
              />
              Hombres
            </label>
          </div>
        </div>

        <div className="filter-section">
          <h4>Estado</h4>
          <select
            value={searchFilters.estado}
            onChange={(e) => handleFilterChange('estado', e.target.value)}
            className="status-filter"
          >
            <option value="todos">Todos</option>
            <option value="en_linea">En línea</option>
            <option value="recientemente_activa">Recientemente activo</option>
          </select>
        </div>

        <div className="filter-section">
          <h4>Intereses</h4>
          <div className="interests-filter">
            {availableInterests.map(interes => (
              <button
                key={interes}
                className={`interest-tag ${searchFilters.intereses.includes(interes) ? 'selected' : ''}`}
                onClick={() => handleInterestToggle(interes)}
              >
                {interes}
              </button>
            ))}
          </div>
        </div>

        <div className="results-count">
          {filteredProfiles.length} perfiles encontrados
        </div>
      </div>

      <div className="search-main">
        {currentProfile ? (
          <div className="profile-card">
            <div className="profile-image-container">
              <img 
                src={currentProfile.foto} 
                alt={currentProfile.nombre}
                className="profile-image"
              />
              {currentProfile.verificada && (
                <div className="verified-badge">✓</div>
              )}
              <div className="profile-nav">
                <button
                  onClick={previousProfile}
                  disabled={currentProfileIndex === 0}
                  className="nav-btn prev"
                >
                  ‹
                </button>
                <span className="profile-counter">
                  {currentProfileIndex + 1} de {filteredProfiles.length}
                </span>
                <button
                  onClick={nextProfile}
                  disabled={currentProfileIndex === filteredProfiles.length - 1}
                  className="nav-btn next"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-header">
                <h2>{currentProfile.nombre}, {currentProfile.edad}</h2>
                <div className="profile-distance">📍 {currentProfile.distancia} km</div>
              </div>

              <div className="profile-status">
                <div className={`status-indicator ${currentProfile.estado}`}>
                  {currentProfile.estado === 'en_linea' ? '🟢 En línea' : '🟡 Recientemente activo'}
                </div>
              </div>

              <div className="profile-description">
                <p>{currentProfile.descripcion}</p>
              </div>

              <div className="profile-interests">
                <h4>Intereses</h4>
                <div className="interests-list">
                  {currentProfile.intereses.map(interes => (
                    <span key={interes} className="interest-chip">
                      {interes}
                    </span>
                  ))}
                </div>
              </div>

              <div className="profile-actions">
                <button 
                  onClick={passProfile}
                  className="action-btn pass"
                  title="Pasar"
                  disabled={loading}
                >
                  ✕
                </button>
                <button 
                  onClick={() => openMessageModal(currentProfile)}
                  className="action-btn message"
                  title="Enviar mensaje"
                  disabled={loading}
                >
                  💬
                </button>
                <button 
                  onClick={likeProfile}
                  className="action-btn like"
                  title="Me gusta"
                  disabled={loading}
                >
                  💖
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-profiles">
            <div className="empty-state">
              <h3>No hay perfiles que coincidan</h3>
              <p>Intenta ajustar tus filtros de búsqueda</p>
            </div>
          </div>
        )}
      </div>
    </div>
    
    {showMessageModal && (
      <div className="message-modal show">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Enviar mensaje a {selectedUser?.nombre}</h3>
            <button onClick={closeMessageModal} className="close-btn">×</button>
          </div>
          <div className="modal-body">
            <textarea
              ref={messageTextareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Escribe tu mensaje..."
              rows={4}
              maxLength={500}
              // autoFocus removido para no forzar refocus que puede interferir con la posición del caret
            />
            <div className="char-count">{messageText.length}/500</div>
          </div>
          <div className="modal-actions">
            <button onClick={closeMessageModal} className="btn-cancel">
              Cancelar
            </button>
            <button
              onClick={sendDirectMessage}
              className="btn-send"
              disabled={!messageText.trim() || sendingMessage}
            >
              {sendingMessage ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </div>
    )}
    
    </div>
  );
};

export default Busqueda;
