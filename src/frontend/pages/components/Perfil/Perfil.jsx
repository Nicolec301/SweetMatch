import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import SessionManager from '../../../../services/SessionManager';
import './Perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  
  // Obtener datos del usuario autenticado
  const sessionManager = SessionManager.getInstance();
  const currentUser = sessionManager.getCurrentUser();
  
  // Función para normalizar intereses (convertir objetos a strings)
  const normalizeInterests = (intereses) => {
    if (!Array.isArray(intereses)) return ['viajes', 'fotografía', 'música', 'cocina', 'fitness'];
    
    return intereses.map(interes => {
      if (typeof interes === 'string') return interes;
      if (typeof interes === 'object' && interes !== null) {
        return interes.nombre || interes.id || 'Sin nombre';
      }
      return 'Sin nombre';
    });
  };
  
  // Verificar autenticación al cargar el componente
  useEffect(() => {
    if (!sessionManager.isAuthenticated()) {
      // Si no está autenticado, redirigir al login
      navigate('/login');
    } else {
      // Debug: mostrar los datos del usuario
      console.log('🔍 Perfil - Datos del usuario:', currentUser);
      if (currentUser?.intereses) {
        console.log('🏷️ Perfil - Intereses originales:', currentUser.intereses);
        console.log('🏷️ Perfil - Tipo de intereses:', typeof currentUser.intereses, Array.isArray(currentUser.intereses));
      }

      // Si el usuario no ha completado su perfil, redirigir a completar perfil
      if (currentUser && !currentUser.perfil_completado) {
        navigate('/complete-profile');
      }
    }
  }, [sessionManager, navigate, currentUser]);
  
  const [profile, setProfile] = useState({
    nombre: currentUser?.nombre || 'Usuario',
    edad: currentUser?.edad || 25,
    ubicacion: currentUser?.ubicacion || 'Madrid, España',
    foto: currentUser?.foto || '/images/chica.jpg',
    fotos: [
      currentUser?.foto || '/images/chica.jpg',
      '/images/Sofia.png',
      '/images/laura.png'
    ],
    descripcion: currentUser?.descripcion || 'Me encanta viajar y conocer nuevas culturas. Buscando alguien con quien compartir aventuras y crear momentos inolvidables.',
    intereses: normalizeInterests(currentUser?.intereses),
    trabajo: currentUser?.trabajo || 'Diseñadora Gráfica',
    educacion: currentUser?.educacion || 'Universidad de Madrid',
    altura: currentUser?.altura || '1.65m',
    signo: currentUser?.signo || 'Leo',
    fumador: currentUser?.fumador || 'No',
    bebe: currentUser?.bebe || 'Ocasionalmente',
    mascotas: currentUser?.mascotas || 'Me encantan los perros',
    hijos: currentUser?.hijos || 'No tengo, pero me gustarían en el futuro',
    religion: currentUser?.religion || 'Católica',
    politica: currentUser?.politica || 'Liberal',
    verificada: currentUser?.verificada || true,
    configuracion: {
      mostrarEdad: true,
      mostrarUbicacion: true,
      mostrarTrabajo: true,
      perfilPublico: true,
      notificaciones: true,
      mostrarEnLinea: true
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('perfil');
  const [newInterest, setNewInterest] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfigChange = (setting, value) => {
    setProfile(prev => ({
      ...prev,
      configuracion: {
        ...prev.configuracion,
        [setting]: value
      }
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.intereses.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        intereses: [...prev.intereses, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setProfile(prev => ({
      ...prev,
      intereses: prev.intereses.filter(i => i !== interest)
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          foto: e.target.result,
          fotos: [e.target.result, ...prev.fotos.slice(0, 4)]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      // Aquí se guardaría el perfil en la base de datos
      console.log('Guardando perfil:', profile);
      
      // Actualizar los datos en SessionManager
      const updatedUserData = {
        ...currentUser,
        nombre: profile.nombre,
        edad: profile.edad,
        ubicacion: profile.ubicacion,
        foto: profile.foto,
        descripcion: profile.descripcion,
        intereses: profile.intereses,
        trabajo: profile.trabajo,
        educacion: profile.educacion,
        altura: profile.altura,
        signo: profile.signo,
        fumador: profile.fumador,
        bebe: profile.bebe,
        mascotas: profile.mascotas,
        hijos: profile.hijos,
        religion: profile.religion,
        politica: profile.politica
      };
      
      const result = sessionManager.updateUser(updatedUserData);
      if (result.success) {
        console.log('Perfil actualizado en SessionManager:', result.message);
        setEditMode(false);
      } else {
        console.error('Error al actualizar perfil:', result.message);
      }
    } catch (error) {
      console.error('Error guardando perfil:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="perfil-container">
      <div className="profile-header">
        <div className="profile-nav">
          <button 
            className={`nav-tab ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            Mi Perfil
          </button>
          <button 
            className={`nav-tab ${activeTab === 'configuracion' ? 'active' : ''}`}
            onClick={() => setActiveTab('configuracion')}
          >
            Configuración
          </button>
        </div>
        <div className="profile-actions">
          {editMode ? (
            <>
              <button className="save-btn" onClick={saveProfile}>
                Guardar
              </button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>
                Cancelar
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Editar Perfil
            </button>
          )}
        </div>
      </div>

      {activeTab === 'perfil' && (
        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-photos">
              <div className="main-photo-container">
                <img 
                  src={profile.foto} 
                  alt={profile.nombre}
                  className="main-photo"
                />
                {profile.verificada && (
                  <div className="verified-badge">✓ Verificado</div>
                )}
                {editMode && (
                  <button 
                    className="upload-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📷
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>

              <div className="additional-photos">
                {profile.fotos.slice(1).map((foto, index) => (
                  <div key={index} className="additional-photo">
                    <img src={foto} alt={`Foto ${index + 2}`} />
                  </div>
                ))}
                {editMode && profile.fotos.length < 5 && (
                  <div className="add-photo-placeholder">
                    <span>+</span>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-info">
              <div className="basic-info">
                {editMode ? (
                  <input
                    type="text"
                    value={profile.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="name-input"
                  />
                ) : (
                  <h1>{profile.nombre}, {profile.edad}</h1>
                )}

                <div className="location">
                  📍 {editMode ? (
                    <input
                      type="text"
                      value={profile.ubicacion}
                      onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                      className="location-input"
                    />
                  ) : (
                    profile.ubicacion
                  )}
                </div>
              </div>

              <div className="description-section">
                <h3>Sobre mí</h3>
                {editMode ? (
                  <textarea
                    value={profile.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    className="description-textarea"
                    rows={4}
                  />
                ) : (
                  <p>{profile.descripcion}</p>
                )}
              </div>

              <div className="interests-section">
                <h3>Intereses</h3>
                <div className="interests-list">
                  {profile.intereses && profile.intereses.map((interest, index) => (
                    <div key={index} className="interest-tag">
                      {typeof interest === 'string' ? interest : interest.nombre || interest.id || 'Sin nombre'}
                      {editMode && (
                        <button 
                          className="remove-interest"
                          onClick={() => removeInterest(interest)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <div className="add-interest">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Nuevo interés"
                        onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                      />
                      <button onClick={addInterest}>+</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="details-section">
                <h3>Detalles</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Trabajo:</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={profile.trabajo}
                        onChange={(e) => handleInputChange('trabajo', e.target.value)}
                      />
                    ) : (
                      <span>{profile.trabajo}</span>
                    )}
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Educación:</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={profile.educacion}
                        onChange={(e) => handleInputChange('educacion', e.target.value)}
                      />
                    ) : (
                      <span>{profile.educacion}</span>
                    )}
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Altura:</span>
                    {editMode ? (
                      <input
                        type="text"
                        value={profile.altura}
                        onChange={(e) => handleInputChange('altura', e.target.value)}
                      />
                    ) : (
                      <span>{profile.altura}</span>
                    )}
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Signo:</span>
                    {editMode ? (
                      <select
                        value={profile.signo}
                        onChange={(e) => handleInputChange('signo', e.target.value)}
                      >
                        <option>Aries</option>
                        <option>Tauro</option>
                        <option>Géminis</option>
                        <option>Cáncer</option>
                        <option>Leo</option>
                        <option>Virgo</option>
                        <option>Libra</option>
                        <option>Escorpio</option>
                        <option>Sagitario</option>
                        <option>Capricornio</option>
                        <option>Acuario</option>
                        <option>Piscis</option>
                      </select>
                    ) : (
                      <span>{profile.signo}</span>
                    )}
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Fumador:</span>
                    {editMode ? (
                      <select
                        value={profile.fumador}
                        onChange={(e) => handleInputChange('fumador', e.target.value)}
                      >
                        <option>No</option>
                        <option>Sí</option>
                        <option>Ocasionalmente</option>
                      </select>
                    ) : (
                      <span>{profile.fumador}</span>
                    )}
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Bebe:</span>
                    {editMode ? (
                      <select
                        value={profile.bebe}
                        onChange={(e) => handleInputChange('bebe', e.target.value)}
                      >
                        <option>No</option>
                        <option>Sí</option>
                        <option>Ocasionalmente</option>
                        <option>Socialmente</option>
                      </select>
                    ) : (
                      <span>{profile.bebe}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'configuracion' && (
        <div className="settings-content">
          <div className="settings-section">
            <h3>Privacidad del Perfil</h3>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={profile.configuracion.mostrarEdad}
                  onChange={(e) => handleConfigChange('mostrarEdad', e.target.checked)}
                />
                Mostrar mi edad
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={profile.configuracion.mostrarUbicacion}
                  onChange={(e) => handleConfigChange('mostrarUbicacion', e.target.checked)}
                />
                Mostrar mi ubicación
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={profile.configuracion.mostrarTrabajo}
                  onChange={(e) => handleConfigChange('mostrarTrabajo', e.target.checked)}
                />
                Mostrar información laboral
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={profile.configuracion.perfilPublico}
                  onChange={(e) => handleConfigChange('perfilPublico', e.target.checked)}
                />
                Hacer mi perfil visible en búsquedas
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Notificaciones</h3>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={profile.configuracion.notificaciones}
                  onChange={(e) => handleConfigChange('notificaciones', e.target.checked)}
                />
                Recibir notificaciones push
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={profile.configuracion.mostrarEnLinea}
                  onChange={(e) => handleConfigChange('mostrarEnLinea', e.target.checked)}
                />
                Mostrar cuando estoy en línea
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Cuenta</h3>
            <button className="danger-btn">Eliminar Cuenta</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Perfil;
