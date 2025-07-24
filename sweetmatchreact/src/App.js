import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Importar estilos
import './styles/styles.css';
import './styles/components/header.css';
import './styles/components/footer.css';
import './styles/modules/login/formulario.css';
import './styles/modules/crearCuenta/formularioCrear.css';
import './styles/modules/crearCuenta/multi-step-form.css';
function App() {
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
