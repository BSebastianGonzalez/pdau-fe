import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/user/MainPage';
import ComplaintInfo from './pages/complaint/ComplaintInfo';
import ComplaintRegister from './pages/complaint/ComplaintRegister';
import ComplaintCreated from './pages/complaint/ComplaintCreated';
import ComplaintConsult from './pages/complaint/ComplaintConsult';
import ConsultResponse from './pages/complaint/ConsultResponse';
import LoginPage from './pages/admin/LoginPage';
import AdminPage from './pages/admin/AdminPage';
import DataPage from './pages/admin/DataPage';
import DataUpdatePage from './pages/admin/DataUpdatePage';

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
        <Route path="/admin_login" element={<LoginPage />} />"
        <Route path="/admin_main" element={<AdminPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/data_update" element={<DataUpdatePage />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;