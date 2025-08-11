import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config.js';
import Home from './frontend/pages/Home';
import Login from './frontend/pages/components/Login/Login';
import Register from './frontend/pages/components/Register/Register';
import CompleteProfile from './frontend/pages/components/CompleteProfile/CompleteProfile';
import Chat from './frontend/pages/components/Chat/Chat';
import Busqueda from './frontend/pages/components/Busqueda/Busqueda';
import Perfil from './frontend/pages/components/Perfil/Perfil';
import EnLinea from './frontend/pages/components/EnLinea/EnLinea';

// Importar estilos
import './frontend/styles/main.css';

function App() {
  // Verificar que tenemos el ID de cliente de Google
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('ERROR: No se ha configurado el ID de cliente de Google.');
    } else {
      console.log('Configuración de Google OAuth inicializada correctamente');
    }
  }, []);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error de configuración</h2>
        <p>No se ha configurado el ID de cliente de Google OAuth.</p>
        <p>Por favor, verifica tu archivo .env</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/busqueda" element={<Busqueda />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/en-linea" element={<EnLinea />} />
          </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
