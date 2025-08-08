import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import SessionManager from '../../../../services/SessionManager';
import ApiService from '../../../../services/ApiService';
import './CompleteProfile.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const sessionManager = SessionManager.getInstance();
  const currentUser = sessionManager.getCurrentUser();
  const fileInputRef = useRef(null);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    if (!sessionManager.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Si el usuario ya completó su perfil, redirigir a búsqueda
    if (currentUser?.perfil_completado) {
      navigate('/busqueda');
      return;
    }
  }, [sessionManager, navigate, currentUser]);

  const [formData, setFormData] = useState({
    // Información adicional del perfil
    ubicacion: '',
    trabajo: '',
    educacion: '',
    altura: '',
    signo: '',
    fumador: 'No',
    bebe: 'No',
    mascotas: '',
    hijos: 'No tengo',
    religion: '',
    politica: '',
    
    // Fotos adicionales
    foto_perfil: null,
    fotos_adicionales: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Opciones para los selects
  const signosZodiacales = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];

  const opcionesFumador = ['No', 'Sí', 'Ocasionalmente'];
  const opcionesBebe = ['No', 'Sí', 'Ocasionalmente', 'Socialmente'];
  const opcionesHijos = [
    'No tengo',
    'No tengo, pero me gustarían en el futuro',
    'No tengo y no los quiero',
    'Tengo hijos',
    'Tengo hijos y quiero más'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e, isMain = true) => {
    const files = Array.from(e.target.files);
    
    if (isMain && files[0]) {
      setFormData(prev => ({
        ...prev,
        foto_perfil: files[0]
      }));
    } else if (!isMain && files.length > 0) {
      // Máximo 4 fotos adicionales
      const currentPhotos = formData.fotos_adicionales.length;
      const availableSlots = 4 - currentPhotos;
      const newPhotos = files.slice(0, availableSlots);
      
      setFormData(prev => ({
        ...prev,
        fotos_adicionales: [...prev.fotos_adicionales, ...newPhotos]
      }));
    }
  };

  const removeAdditionalPhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      fotos_adicionales: prev.fotos_adicionales.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipProfile = () => {
    // Permitir al usuario saltarse este paso y ir directamente a la aplicación
    navigate('/busqueda');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      // Releer el usuario actual por si la sesión cambió tras el login
      const sessionUser = SessionManager.getInstance().getCurrentUser();
      if (!sessionUser?.id) {
        setError('Sesión no válida. Inicia sesión nuevamente.');
        return;
      }

      // Preparar los datos para enviar
      const tidy = (v) => (typeof v === 'string' ? v.trim() : v);
      const rawId = sessionUser?.id;
      const numericId = Number.isInteger(rawId) ? rawId : parseInt(rawId, 10);
      const profileData = {
        // Asegurar id numérico para el backend (evitar IDs de Google extremadamente largos)
        user_id: numericId,
        ubicacion: tidy(formData.ubicacion) || null,
        trabajo: tidy(formData.trabajo) || null,
        educacion: tidy(formData.educacion) || null,
        altura: tidy(formData.altura) || null,
        signo: tidy(formData.signo) || null,
        fumador: tidy(formData.fumador),
        bebe: tidy(formData.bebe),
        mascotas: tidy(formData.mascotas) || null,
        hijos: tidy(formData.hijos),
        religion: tidy(formData.religion) || null,
        politica: tidy(formData.politica) || null,
        perfil_completado: true
      };

      console.log('🚀 Completando perfil:', profileData);

      // Validación rápida en cliente: ID válido y en rango seguro de Postgres INT
      if (!Number.isInteger(profileData.user_id) || profileData.user_id <= 0 || profileData.user_id > 2147483647) {
        setError('Sesión no válida. Por favor cierra sesión y vuelve a iniciar (ID inválido).');
        return;
      }

      // Enviar datos al backend
      const response = await ApiService.completeProfile(profileData);

      if (response.success) {
        // Preferir datos del backend (normalizados) si están disponibles
        const apiUser = response.data || null;
        const updatedUser = apiUser
          ? { ...sessionUser, ...apiUser, perfil_completado: apiUser.perfil_completado ?? true }
          : { ...sessionUser, ...profileData, perfil_completado: true };

        sessionManager.updateUser(updatedUser);
        console.log('✅ Perfil completado. Redirigiendo al Home…');

        // Redirigir al Home y reemplazar historial para evitar volver al formulario
        navigate('/', { replace: true });
        // Fallback: si navigate no aplica por alguna razón del entorno, forzar redirección
        setTimeout(() => {
          if (window?.location?.pathname !== '/') {
            window.location.replace('/');
          }
        }, 100);
        return;
      } else {
        setError(response.message || 'Error al completar el perfil');
      }

    } catch (error) {
      console.error('Error completando perfil:', error);
      // Mostrar mensajes de validación del backend si existen
      if (error?.errors && Array.isArray(error.errors) && error.errors.length) {
        setError(`${error.message}: ${error.errors[0]}`);
      } else {
        setError(error.message || 'Error de conexión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator-container">
      <div className="step-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <span>1</span>
          <small>Información Básica</small>
        </div>
        <div className="step-line"></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <span>2</span>
          <small>Estilo de Vida</small>
        </div>
        <div className="step-line"></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <span>3</span>
          <small>Fotos</small>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h2>Información Básica</h2>
            <p>Ayúdanos a conocerte mejor completando tu perfil</p>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="ubicacion">Ubicación</label>
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  maxLength={255}
                  placeholder="Ej: Madrid, España"
                />
              </div>

              <div className="input-group">
                <label htmlFor="trabajo">Trabajo</label>
                <input
                  type="text"
                  id="trabajo"
                  name="trabajo"
                  value={formData.trabajo}
                  onChange={handleInputChange}
                  maxLength={255}
                  placeholder="Ej: Diseñador Gráfico"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="educacion">Educación</label>
                <input
                  type="text"
                  id="educacion"
                  name="educacion"
                  value={formData.educacion}
                  onChange={handleInputChange}
                  maxLength={255}
                  placeholder="Ej: Universidad de Madrid"
                />
              </div>

              <div className="input-group">
                <label htmlFor="altura">Altura</label>
                <input
                  type="text"
                  id="altura"
                  name="altura"
                  value={formData.altura}
                  onChange={handleInputChange}
                  maxLength={10}
                  placeholder="Ej: 1.70m"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="signo">Signo Zodiacal</label>
              <select
                id="signo"
                name="signo"
                value={formData.signo}
                onChange={handleInputChange}
              >
                <option value="">Selecciona tu signo</option>
                {signosZodiacales.map(signo => (
                  <option key={signo} value={signo}>{signo}</option>
                ))}
              </select>
            </div>

            <div className="step-navigation">
              <button type="button" className="btn-skip" onClick={skipProfile}>
                Saltar por ahora
              </button>
              <button type="button" className="btn-next" onClick={nextStep}>
                Siguiente
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h2>Estilo de Vida</h2>
            <p>Cuéntanos sobre tu estilo de vida</p>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="fumador">¿Fumas?</label>
                <select
                  id="fumador"
                  name="fumador"
                  value={formData.fumador}
                  onChange={handleInputChange}
                >
                  {opcionesFumador.map(opcion => (
                    <option key={opcion} value={opcion}>{opcion}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="bebe">¿Bebes alcohol?</label>
                <select
                  id="bebe"
                  name="bebe"
                  value={formData.bebe}
                  onChange={handleInputChange}
                >
                  {opcionesBebe.map(opcion => (
                    <option key={opcion} value={opcion}>{opcion}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="mascotas">Mascotas</label>
              <input
                type="text"
                id="mascotas"
                name="mascotas"
                value={formData.mascotas}
                onChange={handleInputChange}
                maxLength={1000}
                placeholder="Ej: Tengo un perro, Me gustan los gatos"
              />
            </div>

            <div className="input-group">
              <label htmlFor="hijos">Hijos</label>
              <select
                id="hijos"
                name="hijos"
                value={formData.hijos}
                onChange={handleInputChange}
              >
                {opcionesHijos.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="religion">Religión</label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  maxLength={100}
                  placeholder="Ej: Católica, Agnóstico, etc."
                />
              </div>

              <div className="input-group">
                <label htmlFor="politica">Orientación Política</label>
                <input
                  type="text"
                  id="politica"
                  name="politica"
                  value={formData.politica}
                  onChange={handleInputChange}
                  maxLength={100}
                  placeholder="Ej: Liberal, Conservador, etc."
                />
              </div>
            </div>

            <div className="step-navigation">
              <button type="button" className="btn-prev" onClick={prevStep}>
                Anterior
              </button>
              <button type="button" className="btn-skip" onClick={skipProfile}>
                Saltar por ahora
              </button>
              <button type="button" className="btn-next" onClick={nextStep}>
                Siguiente
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h2>Fotos de Perfil</h2>
            <p>Agrega fotos para que otros usuarios te conozcan mejor</p>

            <div className="photo-upload-section">
              <div className="main-photo-upload">
                <h3>Foto Principal</h3>
                <div className="photo-upload-area">
                  {formData.foto_perfil ? (
                    <div className="photo-preview">
                      <img 
                        src={URL.createObjectURL(formData.foto_perfil)} 
                        alt="Vista previa"
                      />
                      <button 
                        type="button" 
                        className="remove-photo"
                        onClick={() => setFormData(prev => ({...prev, foto_perfil: null}))}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                      <span className="upload-icon">📷</span>
                      <p>Sube tu foto principal</p>
                      <small>Recomendado: 500x500px</small>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handlePhotoUpload(e, true)}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>

              <div className="additional-photos-upload">
                <h3>Fotos Adicionales (Opcional)</h3>
                <div className="additional-photos-grid">
                  {formData.fotos_adicionales.map((foto, index) => (
                    <div key={index} className="photo-preview small">
                      <img src={URL.createObjectURL(foto)} alt={`Foto ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-photo"
                        onClick={() => removeAdditionalPhoto(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {formData.fotos_adicionales.length < 4 && (
                    <div className="upload-placeholder small">
                      <input
                        type="file"
                        onChange={(e) => handlePhotoUpload(e, false)}
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        id="additional-photos"
                      />
                      <label htmlFor="additional-photos">
                        <span className="upload-icon">+</span>
                        <small>Agregar foto</small>
                      </label>
                    </div>
                  )}
                </div>
                <small className="photo-help">
                  Puedes agregar hasta 4 fotos adicionales para mostrar tu personalidad
                </small>
              </div>
            </div>

            <div className="step-navigation">
              <button type="button" className="btn-prev" onClick={prevStep}>
                Anterior
              </button>
              <button type="button" className="btn-skip" onClick={skipProfile}>
                Saltar por ahora
              </button>
              <button 
                type="submit" 
                className="btn-complete" 
                disabled={loading}
              >
                {loading ? 'Completando...' : 'Completar Perfil'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="complete-profile-page">
      <Header />
      
      <div className="complete-profile-container">
        <div className="complete-profile-header">
          <h1>Completa tu Perfil</h1>
          <p>¡Estás a un paso de encontrar conexiones increíbles! Completa tu perfil para obtener mejores matches.</p>
        </div>

        {renderStepIndicator()}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="complete-profile-form">
          {renderStep()}
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CompleteProfile;
