import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GifCora from '../images/GifCora.webp';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../styles/modules/login/formulario.css';

const Login = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Aquí irían las llamadas a la API o backend
    console.log('Datos de login:', formData);
    
    // Simulación de proceso de login
    // En una implementación real, aquí harías la validación con tu backend
    alert('Función de login en desarrollo. Datos enviados a consola.');
  };

  // Manejar respuesta exitosa de Google
  const handleGoogleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Usuario de Google:', decoded);
      
      // Guardar la información del usuario en el estado
      setUser(decoded);
      
      // Aquí puedes enviar la información a tu backend para
      // verificar y autenticar al usuario en tu sistema
      // Por ejemplo:
      // loginWithGoogle(decoded)
      
      // Mostrar mensaje de éxito
      alert(`¡Bienvenido ${decoded.name}! Has iniciado sesión correctamente con Google.`);
      
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      setError('Error al iniciar sesión con Google. Por favor, intenta de nuevo.');
    }
  };

  // Manejar errores de Google
  const handleGoogleLoginError = () => {
    console.error('Error en el login con Google');
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
              <button type="submit" className="btn-primary">Iniciar Sesión</button>
            </div>
            
            <div className="social-login" style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ marginBottom: '10px' }}>O inicia sesión con:</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  text="signin_with"
                  shape="rectangular"
                  locale="es"
                />
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
