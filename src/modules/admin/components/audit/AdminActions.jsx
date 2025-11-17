import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminService from '../../../../services/AdminService';

const TABS = {
  ARCHIVOS: 'archivaciones',
  CAMBIOS: 'cambios-estado',
  COMENTARIOS: 'comentarios'
};

const AdminActions = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const renderRef = (...vals) => {
    for (const v of vals) {
      if (v === null || v === undefined || v === '') continue;
      if (typeof v === 'object') {
        if (v.titulo) return v.titulo;
        if (v.title) return v.title;
        if (v.descripcion) return v.descripcion;
        if (v.descripcionComentario) return v.descripcionComentario;
        if (v.id) return String(v.id);
        if (v._id) return String(v._id);
        try { return JSON.stringify(v); } catch { continue; }
      }
      return String(v);
    }
    return '-';
  };

  const formatDate = (val) => {
    if (!val) return '-';
    // if it's an object with fechaCreacion/fechaArchivado
    if (typeof val === 'object') {
      if (val.fechaCreacion) val = val.fechaCreacion;
      else if (val.fechaArchivado) val = val.fechaArchivado;
      else if (val.fechaArchivar) val = val.fechaArchivar;
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString();
    }
    return String(val);
  };

  
  const [tab, setTab] = useState(TABS.ARCHIVOS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [archivados, setArchivados] = useState([]);
  const [cambios, setCambios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  // UI state: filters and animations
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [archiveStatus, setArchiveStatus] = useState('all'); // all / archived / unarchived
  const [estadoFilter, setEstadoFilter] = useState('all'); // all / Validada / Cerrada (text match)
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true); setError(null);
      try {
        const [a, c, m] = await Promise.allSettled([
          AdminService.getArchivarDenunciasByAdminId(adminId),
          AdminService.getCambiosEstadoByAdminId(adminId),
          AdminService.getComentariosByAdminId(adminId)
        ]);
        if (a.status === 'fulfilled') setArchivados(Array.isArray(a.value) ? a.value : []);
        if (c.status === 'fulfilled') setCambios(Array.isArray(c.value) ? c.value : []);
        if (m.status === 'fulfilled') setComentarios(Array.isArray(m.value) ? m.value : []);
      } catch (err) {
        setError('Error cargando acciones administrativas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // small reveal animation after mount
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [adminId]);

  // animate when switching tabs
  useEffect(() => {
    setTabVisible(false);
    const id = setTimeout(() => setTabVisible(true), 140);
    return () => clearTimeout(id);
  }, [tab]);

  const normalizeDate = (val) => {
    if (!val) return null;
    if (typeof val === 'object') {
      if (val.fechaArchivar) val = val.fechaArchivar;
      else if (val.fechaCambio) val = val.fechaCambio;
      else if (val.fechaComentario) val = val.fechaComentario;
      else if (val.fechaCreacion) val = val.fechaCreacion;
      else if (val.fechaArchivado) val = val.fechaArchivado;
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  const inDateRange = (itemDate) => {
    const d = normalizeDate(itemDate);
    if (!d) return false;
    if (dateFrom) {
      const from = new Date(dateFrom);
      if (d < from) return false;
    }
    if (dateTo) {
      // include day
      const to = new Date(dateTo);
      to.setHours(23,59,59,999);
      if (d > to) return false;
    }
    return true;
  };

  const matchesSearch = (denunciaObj) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const candidates = [];
    if (typeof denunciaObj === 'string') candidates.push(denunciaObj);
    if (denunciaObj && typeof denunciaObj === 'object') {
      candidates.push(denunciaObj.nombre, denunciaObj.titulo, denunciaObj.tokenSeguimiento);
    }
    return candidates.filter(Boolean).some(c => String(c).toLowerCase().includes(s));
  };

  const filterArchivados = (list) => list.filter(it => {
    // archive status
    if (archiveStatus !== 'all') {
      const archivedFlag = it.archivar ?? it.archivado ?? null;
      if (archiveStatus === 'archived' && archivedFlag !== true) return false;
      if (archiveStatus === 'unarchived' && archivedFlag === true) return false;
    }
    // dates
    if (dateFrom || dateTo) {
      const date = it.fechaArchivar || it.fechaArchivado || it.fecha || it.createdAt;
      if (!inDateRange(date)) return false;
    }
    // search
    const denunciaObj = it.denuncia || it.denunciaId;
    if (!matchesSearch(denunciaObj)) return false;
    return true;
  });

  const filterCambios = (list) => list.filter(it => {
    // estado filter (text match against estado.nombre or estado.titulo)
    if (estadoFilter !== 'all') {
      const estadoNombre = (it.estado && (it.estado.nombre || it.estado.titulo)) || it.estado;
      if (!estadoNombre || String(estadoNombre).toLowerCase() !== estadoFilter.toLowerCase()) return false;
    }
    // dates
    if (dateFrom || dateTo) {
      const date = it.fechaCambio || it.fecha || it.createdAt || it.fechaCreacion;
      if (!inDateRange(date)) return false;
    }
    // search
    const denunciaObj = it.denuncia || it.denunciaId;
    if (!matchesSearch(denunciaObj)) return false;
    return true;
  });

  const filterComentarios = (list) => list.filter(it => {
    if (dateFrom || dateTo) {
      const date = it.fechaComentario || it.fecha || it.createdAt;
      if (!inDateRange(date)) return false;
    }
    const denunciaObj = it.denuncia || it.denunciaId;
    if (!matchesSearch(denunciaObj)) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Acciones administrativas</h2>
          <button
            type="button"
            onClick={() => navigate('/audit_actions')}
            className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            ← Volver
          </button>
        </div>
      <div className="mb-4">
        <div className="flex gap-2">
          <button className={`px-3 py-2 rounded ${tab===TABS.ARCHIVOS ? 'bg-red-500 text-white' : 'bg-gray-100'}`} onClick={() => setTab(TABS.ARCHIVOS)}>Archivaciones</button>
          <button className={`px-3 py-2 rounded ${tab===TABS.CAMBIOS ? 'bg-red-500 text-white' : 'bg-gray-100'}`} onClick={() => setTab(TABS.CAMBIOS)}>Cambios de estado</button>
          <button className={`px-3 py-2 rounded ${tab===TABS.COMENTARIOS ? 'bg-red-500 text-white' : 'bg-gray-100'}`} onClick={() => setTab(TABS.COMENTARIOS)}>Comentarios</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre de denuncia..."
            className="px-3 py-2 border rounded w-64"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm">Desde</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-2 py-1 border rounded" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Hasta</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-2 py-1 border rounded" />
          </div>
          {tab === TABS.ARCHIVOS && (
            <select value={archiveStatus} onChange={(e) => setArchiveStatus(e.target.value)} className="px-2 py-1 border rounded">
              <option value="all">Todos</option>
              <option value="archived">Archivados</option>
              <option value="unarchived">No archivados</option>
            </select>
          )}
          {tab === TABS.CAMBIOS && (
            <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="px-2 py-1 border rounded">
              <option value="all">Todos los estados</option>
              <option value="Validada">Validada</option>
              <option value="Cerrada">Cerrada</option>
            </select>
          )}
        </div>
      </div>

      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <div>
          {tab === TABS.ARCHIVOS && (
            <div>
              {archivados.length === 0 ? <div>No hay archivaciones registradas.</div> : (
                <ul className="space-y-4">
                  {filterArchivados(archivados).map((it) => (
                    <li key={it.id || it._id} className="p-4 border rounded-lg shadow-sm bg-white">
                      <div className={`grid grid-cols-1 gap-2 transform transition-all duration-300 ${visible && tabVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Denuncia:</div>
                          <div className="text-sm text-gray-800">{renderRef(it.denuncia?.nombre, it.denuncia?.titulo, it.denuncia?.tokenSeguimiento, it.denunciaId)}</div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Tipo:</div>
                          <div className="text-sm text-gray-800">{(it.archivar === true) ? 'Archivación' : (it.archivar === false ? 'Desarchivación' : (it.archivado === true ? 'Archivación' : (it.archivado === false ? 'Desarchivación' : '-')))}</div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Fecha archivado:</div>
                          <div className="text-sm text-gray-800">{formatDate(it.fechaArchivar || it.fechaArchivado || it.fecha || it.createdAt)}</div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Justificación:</div>
                          <div className="text-sm text-gray-800">{renderRef(it.justificacion, it.detalle, it.motivo, it.descripcion)}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === TABS.CAMBIOS && (
            <div>
              {cambios.length === 0 ? <div>No hay cambios de estado registrados.</div> : (
                <ul className="space-y-4">
                  {filterCambios(cambios).map((it) => (
                    <li key={it.id || it._id} className="p-4 border rounded-lg shadow-sm bg-white">
                      <div className={`grid grid-cols-1 gap-2 transform transition-all duration-300 ${visible && tabVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Denuncia:</div>
                          <div className="text-sm text-gray-800">{renderRef(it.denuncia?.nombre, it.denuncia?.titulo, it.denunciaId)}</div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Estado anterior:</div>
                          <div className="text-sm text-gray-800">{renderRef(it.estadoAnterior?.nombre, it.estadoAnterior?.titulo, it.estadoAnterior)}</div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Estado actual:</div>
                          <div className="text-sm text-gray-800">{renderRef(it.estado?.nombre, it.estado?.titulo, it.estado)}</div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Fecha:</div>
                          <div className="text-sm text-gray-800">{formatDate(it.fechaCambio || it.fecha || it.createdAt || it.fechaCreacion)}</div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Justificación:</div>
                          <div className="text-sm text-gray-800">{renderRef(it.justificacion, it.justificacion || it.motivo || it.detalle || it.descripcion)}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === TABS.COMENTARIOS && (
            <div>
              {comentarios.length === 0 ? <div>No hay comentarios registrados.</div> : (
                <ul className="space-y-4">
                  {filterComentarios(comentarios).map((it) => (
                    <li key={it.id || it._id} className="p-4 border rounded-lg shadow-sm bg-white">
                      <div className={`grid grid-cols-1 gap-2 transform transition-all duration-300 ${visible && tabVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Denuncia:</div>
                          <div className="text-sm text-gray-800">{renderRef(it.denuncia?.nombre, it.denuncia?.titulo, it.denunciaId)}</div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Comentario:</div>
                          <div className="text-sm text-gray-800">{renderRef(it.comentario, it.comentario || it.texto || it.mensaje)}</div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-40 text-sm font-semibold">Fecha:</div>
                          <div className="text-sm text-gray-800">{formatDate(it.fechaComentario || it.fecha || it.createdAt)}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminActions;
