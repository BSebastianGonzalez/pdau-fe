import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/user/MainPage';
import ComplaintInfo from './pages/complaint/ComplaintInfo';
import ComplaintRegister from './pages/complaint/ComplaintRegister';
import ComplaintCreated from './pages/complaint/ComplaintCreated';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<MainPage />} />
        <Route path="/complaint" element={<ComplaintInfo />} />
        <Route path="/register" element={<ComplaintRegister />} />
        <Route path="/finished_register" element={<ComplaintCreated/>} />"
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;