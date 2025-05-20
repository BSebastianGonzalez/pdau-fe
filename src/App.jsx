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
import ViewComplaints from './pages/complaint/ViewComplaints';
import ViewArchivedComplaints from './pages/complaint/ViewArchivedComplaints';
import LawFrame from './pages/user/LawFrame';
import ViewLaw from './pages/user/ViewLaw';
import ComplaintCheckout from './pages/admin/ComplaintCheckout';

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
        <Route path="/law_frame" element={<LawFrame />} />
        <Route path="/:id" element={<ViewLaw />} />
        <Route path="/admin_login" element={<LoginPage />} />"
        <Route path="/admin_main" element={<AdminPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/data_update" element={<DataUpdatePage />} />
        <Route path="/read_complaint" element={<ViewComplaints />} />
        <Route path="/archived_complaints" element={<ViewArchivedComplaints />} />
        <Route path="/complaint_checkout" element={<ComplaintCheckout />} />
      </Routes>
    </Router>
  );
}

export default App;