import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import initializeGoogleAuth from './backend/services/googleAuthService';

// Importar estilos
import './styles/styles.css';

function App() {
  // Inicializar la autenticación de Google cuando se carga la aplicación
  useEffect(() => {
    const googleAuthInitialized = initializeGoogleAuth();
    if (googleAuthInitialized) {
      console.log('Configuración de Google OAuth inicializada correctamente');
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
