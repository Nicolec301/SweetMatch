import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './frontend/pages/Home';
import Login from './frontend/pages/components/Login/Login';
import Register from './frontend/pages/components/Register/Register';
import Chat from './frontend/pages/components/Chat/Chat';
import Busqueda from './frontend/pages/components/Busqueda/Busqueda';
import Perfil from './frontend/pages/components/Perfil/Perfil';
import EnLinea from './frontend/pages/components/EnLinea/EnLinea';
import initializeGoogleAuth from './services/googleAuthService';

// Importar estilos
import './frontend/styles/main.css';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/busqueda" element={<Busqueda />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/en-linea" element={<EnLinea />} />
        </Routes>
    </Router>
  );
}

export default App;
