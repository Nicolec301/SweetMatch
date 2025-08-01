import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GifCora from '../images/GifCora.webp';
import { GoogleLogin } from '@react-oauth/google';
import { handleGoogleLogin, handleTraditionalLogin, isAuthenticated } from '../backend/utils/session';
import '../styles/modules/login/formulario.css';

const Login = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Verificar si ya hay una sesión activa
  useEffect(() => {
    if (isAuthenticated()) {
      // Si ya hay una sesión, redireccionar al usuario
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    setLoading(true);
    try {
      const result = await handleTraditionalLogin(formData);
      
      if (result.success) {
        // Mostrar mensaje de éxito
        alert(result.message);
        // Redireccionar al inicio
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar respuesta exitosa de Google
  const handleGoogleLoginSuccess = (credentialResponse) => {
    setLoading(true);
    const result = handleGoogleLogin(credentialResponse);
    
    if (result.success) {
      // Mostrar mensaje de éxito
      alert(result.message);
      // Redireccionar al inicio
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // Manejar errores de Google
  const handleGoogleLoginError = () => {
    setError('Error al iniciar sesión con Google. Por favor, intenta de nuevo.');
  };

  return (
    <div>
      <Header />

      {/* Formulario de Login */}
      <div className="form-container">
        <div className="form-header">
          <img src={GifCora} alt="Corazón" className="heart-icon" />
          <h1>Iniciar Sesión en <span>SweetMatch</span></h1>
          <p>¡Bienvenido de nuevo al amor!</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="sweet-form">
          <div className="form-section">
            <h2>Datos de acceso</h2>
            <div className="input-group">
              <label htmlFor="email">Email o nombre de usuario:</label>
              <input 
                type="text" 
                id="email" 
                name="nombre" 
                value={formData.nombre}
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

            <div className="input-group" style={{ textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ color: 'var(--primary)' }}>¿Olvidaste tu contraseña?</Link>
            </div>

            <div className="submit-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
            
            <div className="social-login" style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ marginBottom: '10px' }}>O inicia sesión con:</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {loading ? (
                  <div className="loading-spinner">Cargando...</div>
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                    text="signin_with"
                    shape="rectangular"
                    locale="es"
                    disabled={loading}
                  />
                )}
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Regístrate aquí</Link></p>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
