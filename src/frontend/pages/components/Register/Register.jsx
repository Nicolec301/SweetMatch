import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import GifCora from '../../../images/GifCora.webp';
import ApiService from '../../../../services/ApiService';
import SessionManager from '../../../../services/SessionManager';
import '../../../styles/modules/crearCuenta/formularioCrear.css';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [interests, setInterests] = useState([]);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    messages: []
  });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Paso 1: Información Personal
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    edad: '',
    genero: '',
    
    // Paso 2: Preferencias
    busco: '',
    edad_min: '',
    edad_max: '',
    
    // Paso 3: Intereses
    intereses: [],
    
    // Paso 4: Biografía y Foto
    descripcion: '',
    foto: null
  });

  // Cargar intereses al montar el componente
  useEffect(() => {
    const loadInterests = async () => {
      try {
        const response = await ApiService.getInterests();
        if (response.success) {
          setInterests(response.data);
        }
      } catch (error) {
        console.error('Error cargando intereses:', error);
      }
    };
    
    loadInterests();
  }, []);

  // Función para validar contraseña en tiempo real
  const validatePassword = (password) => {
    const messages = [];
    let isValid = true;

    if (!password) {
      return { isValid: false, messages: [] };
    }

    if (password.length < 6) {
      messages.push('Mínimo 6 caracteres');
      isValid = false;
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      messages.push('Al menos una mayúscula');
      isValid = false;
    }

    if (!/(?=.*\d)/.test(password)) {
      messages.push('Al menos un número');
      isValid = false;
    }

    return { isValid, messages };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          intereses: [...formData.intereses, value]
        });
      } else {
        setFormData({
          ...formData,
          intereses: formData.intereses.filter(interes => interes !== value)
        });
      }
    } else if (type === 'file') {
      setFormData({
        ...formData,
        [name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });

      // Validar contraseña en tiempo real
      if (name === 'password') {
        const validation = validatePassword(value);
        setPasswordValidation(validation);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación final
    const requiredFields = ['nombre', 'apellido', 'email', 'password', 'edad', 'genero', 'busco', 'edad_min', 'edad_max', 'descripcion'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Por favor completa los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }

    if (formData.intereses.length === 0) {
      setError('Por favor selecciona al menos un interés');
      return;
    }

    // Validar longitud de descripción específicamente
    if (formData.descripcion.length < 10) {
      setError(`La descripción debe tener al menos 10 caracteres. Actualmente tiene ${formData.descripcion.length}.`);
      return;
    }

    // Validar contraseña antes de enviar
    const passwordValidationResult = validatePassword(formData.password);
    if (!passwordValidationResult.isValid) {
      setError(`Contraseña inválida: ${passwordValidationResult.messages.join(', ')}`);
      return;
    }

    // Foto es opcional por ahora para facilitar pruebas
    // if (!formData.foto) {
    //   setError('Por favor selecciona una foto de perfil');
    //   return;
    // }

    try {
      setLoading(true);
      setError('');

      // Preparar datos para enviar al backend
      const userData = {
        nombre: `${formData.nombre} ${formData.apellido}`,
        email: formData.email,
        edad: parseInt(formData.edad),
        descripcion: formData.descripcion,
        password: formData.password,
        genero: formData.genero,
        busco: formData.busco,
        edad_min: parseInt(formData.edad_min),
        edad_max: parseInt(formData.edad_max),
        intereses: formData.intereses // Mantener los intereses tal como están
      };

      console.log('🚀 Enviando datos de registro:', { ...userData, password: '***' });

      // Enviar datos al backend usando el endpoint de registro con hash
      const response = await ApiService.registerUser(userData);
      
      if (response.success) {
        alert('¡Registro completado con éxito!');
        
        // Si el registro fue exitoso y hay un usuario, redirigir a completar perfil
        if (response.data && response.data.id) {
          // Actualizar sessionManager con los datos del usuario registrado
          const sessionManager = SessionManager.getInstance();
          sessionManager.setUser(response.data);
          
          // Redirigir a completar perfil
          navigate('/complete-profile');
        } else {
          // Si no hay datos del usuario, ir a login
          navigate('/login');
        }
      } else {
        setError(response.message || 'Error al crear usuario');
      }

    } catch (error) {
      console.error('Error en registro:', error);
      
      // Si el error tiene información específica del servidor
      if (error.errors && error.errors.length > 0) {
        setError(`Errores de validación: ${error.errors.join(', ')}`);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Error de conexión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section">
            <h2>Información Personal</h2>
            <div className="input-group">
              <label htmlFor="nombre">Nombre:</label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                value={formData.nombre}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="apellido">Apellido:</label>
              <input 
                type="text" 
                id="apellido" 
                name="apellido" 
                value={formData.apellido}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Correo electrónico:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              {/* Validación en tiempo real de contraseña */}
              {formData.password && (
                <div className="password-validation" style={{ marginTop: '0.5rem' }}>
                  {passwordValidation.isValid ? (
                    <small style={{ color: 'green' }}>✓ Contraseña válida</small>
                  ) : (
                    <div>
                      <small style={{ color: 'red', display: 'block' }}>
                        Requisitos faltantes:
                      </small>
                      {passwordValidation.messages.map((msg, index) => (
                        <small key={index} style={{ color: 'red', display: 'block', marginLeft: '10px' }}>
                          • {msg}
                        </small>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="edad">Edad:</label>
              <input 
                type="number" 
                id="edad" 
                name="edad" 
                min="18" 
                value={formData.edad}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="genero">Género:</label>
              <select 
                id="genero" 
                name="genero" 
                value={formData.genero}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="nobinario">No binario</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="form-navigation">
              <button type="button" className="btn btn-next" onClick={nextStep}>Siguiente</button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <h2>Preferencias</h2>
            <div className="input-group">
              <label htmlFor="busco">Busco:</label>
              <select 
                id="busco" 
                name="busco" 
                value={formData.busco}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="hombres">Hombres</option>
                <option value="mujeres">Mujeres</option>
                <option value="todos">Todos</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="edad_min">Edad mínima que buscas:</label>
              <input 
                type="number" 
                id="edad_min" 
                name="edad_min" 
                min="18" 
                value={formData.edad_min}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="edad_max">Edad máxima que buscas:</label>
              <input 
                type="number" 
                id="edad_max" 
                name="edad_max" 
                min="18" 
                value={formData.edad_max}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-navigation">
              <button type="button" className="btn btn-prev" onClick={prevStep}>Anterior</button>
              <button type="button" className="btn btn-next" onClick={nextStep}>Siguiente</button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <h2>Intereses</h2>
            
            <div className="input-group checkbox-group">
              <label className="checkbox-label">¿Qué te gusta hacer?</label>
              <div className="checkbox-options">
                {interests.length > 0 ? interests.map(interes => (
                  <div key={interes.id} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id={`interes-${interes.id}`} 
                      name="intereses" 
                      value={interes.nombre}
                      checked={formData.intereses.includes(interes.nombre)}
                      onChange={handleChange}
                    />
                    <label htmlFor={`interes-${interes.id}`}>{interes.nombre}</label>
                  </div>
                )) : (
                  <p>Cargando intereses...</p>
                )}
              </div>
            </div>

            <div className="form-navigation">
              <button type="button" className="btn btn-prev" onClick={prevStep}>Anterior</button>
              <button type="button" className="btn btn-next" onClick={nextStep}>Siguiente</button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-section">
            <h2>Biografía y Foto</h2>
            <div className="input-group">
              <label htmlFor="descripcion">Cuéntanos sobre ti:</label>
              <textarea 
                id="descripcion" 
                name="descripcion" 
                rows="4" 
                value={formData.descripcion}
                onChange={handleChange}
                required 
                minLength="10"
                placeholder="Comparte algo interesante para que te conozcan mejor... (mínimo 10 caracteres)"
              />
              {formData.descripcion && formData.descripcion.length < 10 && (
                <small style={{ color: 'red', display: 'block', marginTop: '0.25rem' }}>
                  Faltan {10 - formData.descripcion.length} caracteres (mínimo 10)
                </small>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="foto">Foto de perfil (opcional):</label>
              <input 
                type="file" 
                id="foto" 
                name="foto" 
                accept="image/*" 
                onChange={handleChange}
                className="file-input" 
              />
            </div>

            <div className="form-navigation">
              <button type="button" className="btn btn-prev" onClick={prevStep}>Anterior</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Registrando...' : 'Completar Registro'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="register-page">
      <Header />
      
      {/* Formulario */}
      <div className="form-container">
        <div className="form-header">
          <img src={GifCora} alt="Corazón" className="heart-icon" />
          <h1>Registro en <span>SweetMatch</span></h1>
          <p>¡Únete a nuestra comunidad y encuentra el amor verdadero!</p>
        </div>

        {error && (
          <div className="error-message" style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="sweet-form multi-step-form">
          {/* Indicador de pasos */}
          <div className="form-steps">
            <div className="step-indicator" style={{'--progress-width': `${((currentStep - 1) / 3) * 100}%`}}>
              <div className="steps-container">
                <div className={`step-item ${currentStep === 1 ? 'active' : ''}`}>
                  <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                  <div className="step-title">Información Básica</div>
                </div>
                <div className={`step-item ${currentStep === 2 ? 'active' : ''}`}>
                  <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                  <div className="step-title">Preferencias</div>
                </div>
                <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
                  <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
                  <div className="step-title">Intereses</div>
                </div>
                <div className={`step-item ${currentStep === 4 ? 'active' : ''}`}>
                  <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4</div>
                  <div className="step-title">Biografía y Foto</div>
                </div>
              </div>
              <div className="progress-line"></div>
            </div>
          </div>

          {renderStep()}
        </form>

        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Link to="/login" className="btn-back">
            ← Volver a Iniciar Sesión
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;

