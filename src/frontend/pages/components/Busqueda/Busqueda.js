import React, { useState, useEffect } from 'react';
import Header from '../Header';
import './Busqueda.css';

const Busqueda = () => {
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

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
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

  const loadProfiles = () => {
    // Datos de perfiles simulados
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

  const likeProfile = () => {
    console.log('Profile liked:', filteredProfiles[currentProfileIndex]);
    nextProfile();
  };

  const passProfile = () => {
    console.log('Profile passed:', filteredProfiles[currentProfileIndex]);
    nextProfile();
  };

  const availableInterests = [
    'viajes', 'fotografía', 'música', 'cocina', 'deporte', 'cine', 
    'fitness', 'lectura', 'arte', 'pintura', 'museos', 'café',
    'tecnología', 'gaming', 'programación', 'ciencia', 'animales', 
    'naturaleza', 'senderismo', 'veterinaria'
  ];

  const currentProfile = filteredProfiles[currentProfileIndex];

  return (
    <div>
      <Header />
      <div className="busqueda-container">
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
                >
                  ✕
                </button>
                <button 
                  onClick={likeProfile}
                  className="action-btn like"
                  title="Me gusta"
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
    </div>
  );
};

export default Busqueda;
