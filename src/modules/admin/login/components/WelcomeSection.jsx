import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ComplaintService from '../../../../services/ComplaintService';

const WelcomeSection = () => {
  const navigate = useNavigate();
  // Obtener los datos del administrador desde localStorage
  const adminData = JSON.parse(localStorage.getItem("admin")) || {};
  const adminName = adminData?.nombre || adminData?.name || "Administrador";
  const adminEmail = adminData?.correo || adminData?.email || "-";

  // Stats fetched from backend
  const [nuevas24h, setNuevas24h] = useState('-');
  const [totalDenuncias, setTotalDenuncias] = useState('-');
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchCounts = async () => {
      setLoadingStats(true);
      try {
        const all = await ComplaintService.getAllComplaints();
        if (!mounted) return;
        const now = Date.now();
        const dayAgo = now - 24 * 60 * 60 * 1000;
        const total = Array.isArray(all) ? all.length : 0;
        const recent = Array.isArray(all) ? all.filter((c) => {
          // try common date fields
          const dStr = c.fechaCreacion || c.createdAt || c.fecha || c.fechaDenuncia || c.fecha_creacion;
          if (!dStr) return false;
          const d = new Date(dStr);
          if (isNaN(d.getTime())) return false;
          return d.getTime() >= dayAgo;
        }).length : 0;

        setTotalDenuncias(total);
        setNuevas24h(recent);
      } catch (err) {
        console.error('Error fetching complaint stats', err);
        setTotalDenuncias('-');
        setNuevas24h('-');
      } finally {
        if (mounted) setLoadingStats(false);
      }
    };
    fetchCounts();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1F3A8A]">Panel de Administración</h1>
            <p className="mt-2 text-lg text-gray-700">Bienvenido, <span className="font-semibold">{adminName}</span></p>
            <p className="text-sm text-gray-500">{adminEmail}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-md bg-green-50 text-green-700 text-sm">Sistema Activo</span>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-5 bg-white rounded-lg shadow-md flex flex-col">
            <div className="text-sm text-gray-500">Denuncias nuevas (24h)</div>
            <div className="mt-2 text-2xl font-bold text-[#DB4747]">{loadingStats ? '...' : nuevas24h}</div>
          </div>
          <div className="p-5 bg-white rounded-lg shadow-md flex flex-col">
            <div className="text-sm text-gray-500">Denuncias totales</div>
            <div className="mt-2 text-2xl font-bold text-[#DB4747]">{loadingStats ? '...' : totalDenuncias}</div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Funcionalidades Principales</h2>
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => navigate('/data')} className="text-left p-5 bg-white rounded-lg shadow hover:shadow-md transition">
              <div className="text-lg font-semibold">Gestión de perfil</div>
              <div className="text-sm text-gray-500 mt-2">Ver mis datos</div>
            </button>

            <button onClick={() => navigate('/read_complaint')} className="text-left p-5 bg-white rounded-lg shadow hover:shadow-md transition">
              <div className="text-lg font-semibold">Gestión de denuncias</div>
              <div className="text-sm text-gray-500 mt-2">Ver denuncias anónimas</div>
            </button>

            <button onClick={() => navigate('/statistics')} className="text-left p-5 bg-white rounded-lg shadow hover:shadow-md transition">
              <div className="text-lg font-semibold">Estadísticas</div>
              <div className="text-sm text-gray-500 mt-2">Generar estadísticas</div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WelcomeSection;
