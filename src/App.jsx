import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/user/MainPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<MainPage />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;