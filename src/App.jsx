import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/user/MainPage';
import ComplaintInfo from './pages/complaint/ComplaintInfo';
import ComplaintRegister from './pages/complaint/ComplaintRegister';
import ComplaintCreated from './pages/complaint/ComplaintCreated';
import ComplaintConsult from './pages/complaint/ComplaintConsult';
import ConsultResponse from './pages/complaint/ConsultResponse';
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<MainPage />} />
        <Route path="/complaint" element={<ComplaintInfo />} />
        <Route path="/register" element={<ComplaintRegister />} />
        <Route path="/finished_register" element={<ComplaintCreated/>} />"
        <Route path="/consult" element={<ComplaintConsult />} />
        <Route path="/consult_response" element={<ConsultResponse />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;