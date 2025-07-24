import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación final
    const requiredFields = ['nombre', 'apellido', 'email', 'password', 'edad', 'genero', 'busco', 'edad_min', 'edad_max', 'descripcion'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Por favor completa los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }

    if (formData.intereses.length === 0) {
      alert('Por favor selecciona al menos un interés');
      return;
    }

    if (!formData.foto) {
      alert('Por favor selecciona una foto de perfil');
      return;
    }

    // Aquí irían las llamadas a la API o backend
    console.log('Datos de registro:', formData);
    
    // Simulación de proceso de registro
    alert('Registro completado con éxito! Datos enviados a consola.');
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
                {['deportes', 'musica', 'viajes', 'lectura', 'cine', 'gastronomia', 'tecnologia', 'arte'].map(interes => (
                  <div key={interes} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id={interes} 
                      name="intereses" 
                      value={interes}
                      checked={formData.intereses.includes(interes)}
                      onChange={handleChange}
                    />
                    <label htmlFor={interes}>{interes.charAt(0).toUpperCase() + interes.slice(1)}</label>
                  </div>
                ))}
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
                placeholder="Comparte algo interesante para que te conozcan mejor..."
              />
            </div>

            <div className="input-group">
              <label htmlFor="foto">Foto de perfil:</label>
              <input 
                type="file" 
                id="foto" 
                name="foto" 
                accept="image/*" 
                onChange={handleChange}
                required 
                className="file-input" 
              />
            </div>

            <div className="form-navigation">
              <button type="button" className="btn btn-prev" onClick={prevStep}>Anterior</button>
              <button type="submit" className="btn-primary">Completar Registro</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Header />

      {/* Formulario */}
      <div className="form-container">
        <div className="form-header">
          <img src="/images/GifCora.webp" alt="Corazón" className="heart-icon" />
          <h1>Registro en <span>SweetMatch</span></h1>
          <p>¡Únete a nuestra comunidad y encuentra el amor verdadero!</p>
        </div>

        <form onSubmit={handleSubmit} className="sweet-form multi-step-form">
          {/* Indicador de pasos */}
          <div className="form-steps">
            <div className="step-indicator">
              {[1, 2, 3, 4].map(step => (
                <div 
                  key={step}
                  className={`step ${step <= currentStep ? 'active' : ''}`}
                >
                  {step}
                </div>
              ))}
              <div className="progress-line" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
            </div>
            <div className="step-titles">
              <div className={`step-title ${currentStep === 1 ? 'active' : ''}`}>Información Básica</div>
              <div className={`step-title ${currentStep === 2 ? 'active' : ''}`}>Preferencias</div>
              <div className={`step-title ${currentStep === 3 ? 'active' : ''}`}>Intereses</div>
              <div className={`step-title ${currentStep === 4 ? 'active' : ''}`}>Biografía y Foto</div>
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
