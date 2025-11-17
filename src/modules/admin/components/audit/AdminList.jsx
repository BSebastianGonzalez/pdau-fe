import React, { useEffect, useState } from 'react';
import AdminService from "../../../../services/AdminService";
import ComplaintService from "../../../../services/ComplaintService";
import StateChangeService from "../../../../services/StateChangeService";
import { useNavigate } from 'react-router-dom';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await AdminService.getAllAdmins();
        const adminsSafe = Array.isArray(data) ? data : [];
        if (mounted) setAdmins(adminsSafe);

        // Also fetch complaints to compute action counts per admin
        try {
          const complaints = await ComplaintService.getAllComplaints();
          const complaintsArr = Array.isArray(complaints) ? complaints : [];

          // Map adminKey -> counts
          const counts = new Map();
          const ensure = (key, label) => {
            if (!counts.has(key)) counts.set(key, { label: label || key, reviews: 0, stateChanges: 0, archives: 0 });
          };

          // Build a lookup of possible identifiers -> canonical admin key
          const adminLookup = new Map();
          const normalize = (v) => (v === undefined || v === null) ? '' : String(v).toLowerCase();
          adminsSafe.forEach(a => {
            const key = String(a.id || a._id || a.correo || a.nombre || '');
            ensure(key, a.nombre || a.correo || '');
            // register multiple identifier forms
            const ids = [a.id, a._id, a.correo, a.email, a.nombre, a.apellido, a.apellidos, a.lastName];
            ids.forEach(x => {
              const n = normalize(x);
              if (n) adminLookup.set(n, key);
            });
          });

          const missingStateChangeComplaintIds = [];

          for (const c of complaintsArr) {
            // reviews
            if (c.revisadoPor) {
              // revisadoPor may be id, email or object
              let raw = c.revisadoPor;
              if (typeof raw === 'object' && raw !== null) {
                raw = raw.id || raw._id || raw.correo || raw.email || raw.nombre || raw;
              }
              const idKey = normalize(raw);
              const mapped = adminLookup.get(idKey) || raw;
              ensure(mapped);
              counts.get(mapped).reviews += 1;
            }
            // archives
            if (c.archivadoPor) {
              let raw = c.archivadoPor;
              if (typeof raw === 'object' && raw !== null) {
                raw = raw.id || raw._id || raw.correo || raw.email || raw.nombre || raw;
              }
              const idKey = normalize(raw);
              const mapped = adminLookup.get(idKey) || raw;
              ensure(mapped);
              counts.get(mapped).archives += 1;
            }
            // cambiosEstado
            if (Array.isArray(c.cambiosEstado) && c.cambiosEstado.length) {
              for (const ch of c.cambiosEstado) {
                let raw = ch.usuarioId || ch.adminId || ch.actorId || ch.usuario || ch.admin || ch.usuarioId || ch.email || ch.correo || ch.nombre;
                if (typeof raw === 'object' && raw !== null) raw = raw.id || raw._id || raw.correo || raw.email || raw.nombre || raw;
                const idKey = normalize(raw);
                const mapped = adminLookup.get(idKey) || raw;
                ensure(mapped);
                counts.get(mapped).stateChanges += 1;
              }
            } else {
              const cid = c.id || c._id || c.denunciaId || c.idDenuncia;
              if (cid) missingStateChangeComplaintIds.push(cid);
            }
          }

          // Fetch missing cambiosEstado with limited concurrency
          if (missingStateChangeComplaintIds.length && StateChangeService.getCambiosEstadoByDenunciaId) {
            const ids = missingStateChangeComplaintIds.filter(Boolean);
            const concurrency = 6;
            let idx = 0;
            const workers = Array.from({ length: concurrency }).map(async () => {
              while (true) {
                const i = idx; idx += 1;
                if (i >= ids.length) break;
                const complaintId = ids[i];
                try {
                  const changes = await StateChangeService.getCambiosEstadoByDenunciaId(complaintId);
                  if (Array.isArray(changes)) {
                    for (const ch of changes) {
                      let raw = ch.usuarioId || ch.adminId || ch.actorId || ch.usuario || ch.admin || ch.usuarioId || ch.email || ch.correo || ch.nombre;
                      if (typeof raw === 'object' && raw !== null) raw = raw.id || raw._id || raw.correo || raw.email || raw.nombre || raw;
                      const idKey = normalize(raw);
                      const mapped = adminLookup.get(idKey) || raw;
                      ensure(mapped);
                      counts.get(mapped).stateChanges += 1;
                    }
                  }
                } catch (err) { void err; }
              }
            });
            try { await Promise.all(workers); } catch (err) { void err; }
          }

          // Merge total count into admins state
          if (mounted) {
            const enriched = adminsSafe.map(a => {
              const key = String(a.id || a._id || a.correo || a.nombre || '');
              const summary = counts.get(key) || { reviews: 0, stateChanges: 0, archives: 0 };
              const total = (summary.reviews || 0) + (summary.stateChanges || 0) + (summary.archives || 0);
              return { ...a, accionesTotal: total, _adminSummary: summary };
            });
            setAdmins(enriched);
          }
        } catch (err) {
          // If complaints fetch fails, we still show admins
          console.error('No se pudieron obtener denuncias para calcular acciones', err);
        }
      } catch (err) {
        console.error('Error cargando administradores', err);
        if (mounted) setError('No se pudo cargar la lista de administradores');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Derived list: filter + sort (search across name, lastname, email, phone)
  const filtered = admins
    .filter(a => {
      if (!search) return true;
      const haystack = (
        (a.nombre || '') + ' ' + (a.apellido || a.apellidos || a.lastName || '') + ' ' +
        (a.correo || a.email || '') + ' ' + (a.telefono || a.celular || a.phone || '')
      ).toString().toLowerCase();
      return haystack.includes(search.toLowerCase());
    })
    .sort((x, y) => {
      const nx = ((x.nombre || '') + ' ' + (x.apellido || x.apellidos || x.lastName || '')).toString().trim();
      const ny = ((y.nombre || '') + ' ' + (y.apellido || y.apellidos || y.lastName || '')).toString().trim();
      return sortAsc ? nx.localeCompare(ny) : ny.localeCompare(nx);
    });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  if (loading) return <div>Cargando administradores...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const getPageNumbers = (maxButtons = 9) => {
    const pages = [];
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Administradores registrados</h3>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-2 border rounded w-72"
          />
          <button
            className="px-3 py-2 bg-white border rounded shadow-sm"
            onClick={() => { setSortAsc(s => !s); setPage(1); }}
            title={`Ordenar por nombre (${sortAsc ? 'asc' : 'desc'})`}
          >
            Orden: {sortAsc ? 'A→Z' : 'Z→A'}
          </button>
        </div>
      </div>

      <div className="overflow-hidden border rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Apellido</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Teléfono</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Correo</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No se encontraron administradores</td>
              </tr>
            ) : (
              visible.map((a) => (
                <tr key={a.id || a._id || a.correo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 align-top text-sm text-gray-800">{a.nombre || '-'}</td>
                  <td className="px-6 py-4 align-top text-sm text-gray-800">{a.apellido || a.apellidos || a.lastName || '-'}</td>
                  <td className="px-6 py-4 align-top text-sm text-gray-600">{a.telefono || a.celular || a.phone || '-'}</td>
                  <td className="px-6 py-4 align-top text-sm text-gray-600">{a.correo || a.email || '-'}</td>
                  <td className="px-6 py-4 align-top text-sm text-gray-700">
                    <ActionCell admin={a} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">Mostrando {visible.length} de {total} administradores</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-md bg-gray-100 text-sm" onClick={() => setPage(1)} disabled={currentPage === 1}>Anterior</button>
          <div className="flex items-center gap-2">
            {getPageNumbers().map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-2 rounded-full ${p === currentPage ? 'bg-red-500 text-white' : 'bg-gray-100 text-sm'}`}>{p}</button>
            ))}
          </div>
          <button className="px-3 py-2 rounded-md bg-red-500 text-white text-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente</button>
        </div>
      </div>
    </div>
  );
};

const ActionCell = ({ admin }) => {
  const navigate = useNavigate();
  const adminId = admin.id || admin._id || admin.correo || admin.email;
  const handle = () => {
    if (!adminId) return;
    navigate(`/audit_actions/${adminId}`);
  };
  return (
    <div>
      <button onClick={handle} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Ver acciones administrativas</button>
    </div>
  );
};

export default AdminList;
