import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import SessionManager from '../../../../backend/services/SessionManager';
import ProfileService from '../../../../backend/services/ProfileService';
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
  
  // Cargar fotos del usuario
  const loadUserPhotos = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      setLoading(true);
      const result = await ProfileService.getUserPhotos(currentUser.id);
      
      if (result.success) {
        const photos = result.data.map(photo => ({
          ...photo,
          url: ProfileService.buildImageUrl(photo.url)
        }));
        setUserPhotos(photos);
        
        // Actualizar la foto principal en el perfil
        const mainPhoto = photos.find(p => p.es_principal);
        if (mainPhoto) {
          setProfile(prev => ({
            ...prev,
            foto: mainPhoto.url,
            fotos: photos.map(p => p.url)
          }));
        }
      }
    } catch (error) {
      console.error('Error cargando fotos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

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

      // Cargar fotos del usuario
      loadUserPhotos();
    }
  }, [sessionManager, navigate, currentUser, loadUserPhotos]);
  
  const [profile, setProfile] = useState({
    nombre: currentUser?.nombre || 'Usuario',
    edad: currentUser?.edad || 25,
    ubicacion: currentUser?.ubicacion || 'Madrid, España',
    foto: currentUser?.foto || '/images/chica.jpg',
    fotos: [],
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
  const [loading, setLoading] = useState(false);
  const [userPhotos, setUserPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const additionalPhotosRef = useRef(null);

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

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !currentUser?.id) return;

    try {
      setLoading(true);
      const result = await ProfileService.uploadProfilePhoto(currentUser.id, file);
      
      if (result.success) {
        // Recargar fotos después de subir
        await loadUserPhotos();
        console.log('Foto de perfil subida exitosamente');
      } else {
        console.error('Error subiendo foto:', result.error);
        alert('Error al subir la foto: ' + result.error);
      }
    } catch (error) {
      console.error('Error subiendo foto:', error);
      alert('Error al subir la foto');
    } finally {
      setLoading(false);
    }
  };

  const handleAdditionalPhotosUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0 || !currentUser?.id) return;

    try {
      setLoading(true);
      const result = await ProfileService.uploadAdditionalPhotos(currentUser.id, files);
      
      if (result.success) {
        // Recargar fotos después de subir
        await loadUserPhotos();
        console.log('Fotos adicionales subidas exitosamente');
      } else {
        console.error('Error subiendo fotos:', result.error);
        alert('Error al subir las fotos: ' + result.error);
      }
    } catch (error) {
      console.error('Error subiendo fotos:', error);
      alert('Error al subir las fotos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!currentUser?.id || !photoId) return;
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta foto?')) return;

    try {
      setLoading(true);
      const result = await ProfileService.deleteUserPhoto(currentUser.id, photoId);
      
      if (result.success) {
        // Recargar fotos después de eliminar
        await loadUserPhotos();
        console.log('Foto eliminada exitosamente');
      } else {
        console.error('Error eliminando foto:', result.error);
        alert('Error al eliminar la foto: ' + result.error);
      }
    } catch (error) {
      console.error('Error eliminando foto:', error);
      alert('Error al eliminar la foto');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!currentUser?.id) {
      alert('Error: Usuario no identificado');
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos para enviar al backend
      const profileData = {
        nombre: profile.nombre,
        edad: parseInt(profile.edad),
        ubicacion: profile.ubicacion,
        descripcion: profile.descripcion,
        trabajo: profile.trabajo,
        educacion: profile.educacion,
        altura: profile.altura,
        signo: profile.signo,
        fumador: profile.fumador,
        bebe: profile.bebe,
        mascotas: profile.mascotas,
        hijos: profile.hijos,
        religion: profile.religion,
        politica: profile.politica,
        intereses: profile.intereses,
        configuracion: profile.configuracion
      };

      console.log('Guardando perfil:', profileData);
      
      const result = await ProfileService.updateUserProfile(currentUser.id, profileData);
      
      if (result.success) {
        // Actualizar los datos en SessionManager
        const updatedUserData = {
          ...currentUser,
          ...result.data
        };
        
        const sessionResult = sessionManager.updateUser(updatedUserData);
        if (sessionResult.success) {
          console.log('Perfil actualizado exitosamente');
          setEditMode(false);
          alert('Perfil actualizado exitosamente');
        } else {
          console.error('Error actualizando SessionManager:', sessionResult.message);
        }
      } else {
        console.error('Error guardando perfil:', result.error);
        alert('Error al guardar el perfil: ' + result.error);
      }
    } catch (error) {
      console.error('Error guardando perfil:', error);
      alert('Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser?.id) return;
    
    const confirmMessage = `¿Estás seguro de que quieres eliminar tu cuenta permanentemente?

Esta acción no se puede deshacer y se eliminará:
- Tu perfil y todas las fotos
- Todos tus matches y conversaciones
- Todo tu historial de actividad

Escribe "ELIMINAR" para confirmar:`;
    
    const confirmation = prompt(confirmMessage);
    if (confirmation !== 'ELIMINAR') return;

    try {
      setLoading(true);
      const result = await ProfileService.deleteUserAccount(currentUser.id);
      
      if (result.success) {
        alert('Cuenta eliminada exitosamente');
        sessionManager.logout();
        navigate('/');
      } else {
        console.error('Error eliminando cuenta:', result.error);
        alert('Error al eliminar la cuenta: ' + result.error);
      }
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      alert('Error al eliminar la cuenta');
    } finally {
      setLoading(false);
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
              <button 
                className="save-btn" 
                onClick={saveProfile}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button 
                className="cancel-btn" 
                onClick={() => setEditMode(false)}
                disabled={loading}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button 
              className="edit-btn" 
              onClick={() => setEditMode(true)}
              disabled={loading}
            >
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
                {(() => {
                  const mainPhoto = userPhotos.find(p => p.es_principal);
                  const photoSrc = mainPhoto?.url || profile.foto || '/images/default-avatar.svg';
                  
                  return (
                    <img 
                      src={photoSrc} 
                      alt={profile.nombre}
                      className="main-photo"
                      onError={(e) => {
                        console.log('Error loading main photo:', photoSrc);
                        e.target.src = '/images/default-avatar.svg';
                      }}
                    />
                  );
                })()}
                {profile.verificada && (
                  <div className="verified-badge">Verificado</div>
                )}
                {editMode && (
                  <button 
                    className="upload-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Cambiar foto principal"
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
                {userPhotos.filter(photo => !photo.es_principal).map((foto, index) => (
                  <div key={foto.id} className="additional-photo">
                    <img 
                      src={foto.url} 
                      alt={`Foto ${index + 2}`}
                      onError={(e) => {
                        console.log('Error loading additional photo:', foto.url);
                        e.target.style.display = 'none';
                      }}
                    />
                    {editMode && (
                      <button 
                        className="delete-photo-btn"
                        onClick={() => handleDeletePhoto(foto.id)}
                        title="Eliminar foto"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {editMode && userPhotos.length < 5 && (
                  <div 
                    className="add-photo-placeholder"
                    onClick={() => additionalPhotosRef.current?.click()}
                  >
                    <span>+</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={additionalPhotosRef}
                  onChange={handleAdditionalPhotosUpload}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
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
            <div className="account-info">
              <p><strong>Usuario:</strong> {profile.nombre}</p>
              <p><strong>Email:</strong> {currentUser?.email || 'No disponible'}</p>
              <p><strong>Fecha de registro:</strong> {currentUser?.fecha_registro ? new Date(currentUser.fecha_registro).toLocaleDateString() : 'No disponible'}</p>
            </div>
            
            <div className="danger-zone">
              <h4>Zona de Peligro</h4>
              <p className="danger-text">
                ⚠️ Esta acción eliminará permanentemente tu cuenta y no se puede deshacer.
              </p>
              <button 
                className="danger-btn"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar Cuenta Permanentemente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Perfil;
