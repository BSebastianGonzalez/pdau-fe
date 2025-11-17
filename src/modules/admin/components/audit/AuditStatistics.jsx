import React, { useEffect, useState, useRef } from "react";
import AdminService from "../../../../services/AdminService";
import ComplaintService from "../../../../services/ComplaintService";
import StateChangeService from "../../../../services/StateChangeService";
import FileComplaintService from "../../../../services/FileComplaintService";

// Reuse a small Bars component for SVG rendering (same shape as in statistics)
const Bars = ({ data, width = 1000, height = 420, palette = [], xLabel = "", generation = 0, svgRef = null }) => {
  const [animate, setAnimate] = useState(false);
  const leftPad = 72;
  const rightPad = 48;
  const topPad = 32;
  const adjustedBottomPad = 64;
  const chartWidth = width - leftPad - rightPad;
  const chartHeight = height - topPad - adjustedBottomPad;
  const safeData = Array.isArray(data) ? data : [];
  const max = safeData.length === 0 ? 0 : Math.max(...safeData.map((d) => d.value), 0);
  const gap = 14;
  const barWidth = Math.max(20, chartWidth / Math.max(1, safeData.length) - gap);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 30);
    return () => clearTimeout(t);
  }, [generation]);

  return (
    <div className="overflow-x-auto">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="mx-auto">
        <g transform={`translate(${leftPad}, ${topPad})`}>
          {[...Array(6)].map((_, i) => {
            const y = (chartHeight * i) / 5;
            const value = Math.round(max - (i * max) / 5);
            return (
              <g key={`tick-${i}`}>
                <line x1={0} y1={y} x2={chartWidth} y2={y} stroke="#eef2f7" />
                <text x={-12} y={y + 4} textAnchor="end" fontSize={12} fill="#6b7280">{value}</text>
              </g>
            );
          })}

          {safeData.map((d, i) => {
            const barHeight = max === 0 ? 0 : (d.value / max) * chartHeight;
            const x = i * (barWidth + gap);
            const y = chartHeight - barHeight;
            const color = palette[i % palette.length] || '#3b82f6';
            return (
              <g key={`${d.label}-${i}`}>
                <title>{`${d.label}: ${d.value}`}</title>
                <g transform={`translate(${x}, ${chartHeight})`}>
                  <rect x={0} y={animate ? -barHeight : 0} width={barWidth} height={animate ? barHeight : 0} fill={color} rx={6}
                    style={{ transition: 'height 700ms cubic-bezier(0.2,0.8,0.2,1), y 700ms cubic-bezier(0.2,0.8,0.2,1)', transitionDelay: `${i * 80}ms` }} />
                </g>
                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize={12} fill="#111827">{d.value}</text>
                <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" fontSize={12} fill="#374151">{i + 1}</text>
              </g>
            );
          })}

          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e5e7eb" />
          {xLabel && <text x={chartWidth / 2} y={chartHeight + 44} textAnchor="middle" fontSize={13} fill="#374151">{xLabel}</text>}
        </g>
      </svg>
    </div>
  );
};

// Minimal modal wrapper
const ModalWrapper = ({ children, active = false, onClose = () => {} }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true">
    <div className="absolute inset-0 bg-black" onClick={onClose} style={{ opacity: active ? 0.4 : 0, transition: 'opacity 220ms ease' }} />
    <div style={{ animation: active ? 'modalScale 220ms cubic-bezier(.2,.8,.2,1) both' : 'modalScale 180ms cubic-bezier(.2,.8,.2,1) reverse both' }}>{children}</div>
  </div>
);

// Helpers (svg -> png, fetch image, pdf/xlsx generators) - adapted from Graph.jsx
async function svgElementToPngDataUrl(svgEl, scale = 2) {
  if (!svgEl) throw new Error('SVG element no proporcionado');
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgEl);
  if (!svgString.match(/^<svg[^>]+xmlns="http:\/\//)) {
    svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const svgData = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  const img = new Image();
  img.src = svgData;
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
  const rect = svgEl.getBoundingClientRect();
  const width = rect.width || img.width; const height = rect.height || img.height;
  const canvas = document.createElement('canvas'); canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d'); ctx.scale(scale, scale); ctx.clearRect(0,0,canvas.width, canvas.height); ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}

async function fetchImageAsDataUrl(url) {
  const res = await fetch(url); const blob = await res.blob();
  return await new Promise((res2) => { const reader = new FileReader(); reader.onload = () => res2(reader.result); reader.readAsDataURL(blob); });
}

async function generatePdfReport(node, name, description) {
  if (!node) throw new Error('Elemento no encontrado');
  let chartDataUrl;
  if (typeof SVGElement !== 'undefined' && node instanceof SVGElement) {
    chartDataUrl = await svgElementToPngDataUrl(node, 2);
  } else if (node instanceof HTMLElement) {
        try {
          const html2canvasModule = await import('html2canvas');
          const html2canvas = html2canvasModule.default || html2canvasModule;
          const canvas = await html2canvas(node, { scale: 2 }); chartDataUrl = canvas.toDataURL('image/png');
        } catch (err) {
          void err;
          const innerSvg = node.querySelector && node.querySelector('svg');
          if (innerSvg) chartDataUrl = await svgElementToPngDataUrl(innerSvg, 2);
          else throw new Error('Instala html2canvas: npm install html2canvas');
        }
  }
  let jsPDFModule; try { jsPDFModule = await import('jspdf'); } catch (err) { void err; throw new Error('Instala jspdf'); }
  const { jsPDF } = jsPDFModule; const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const margin = 72; const pageW = doc.internal.pageSize.getWidth(); const pageH = doc.internal.pageSize.getHeight();
  let logoDataUrl = null; try { logoDataUrl = await fetchImageAsDataUrl('/img/ufps.png'); } catch (err) { void err; }
  let headerBottom = margin + 8; if (logoDataUrl) { const img = new Image(); await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = logoDataUrl; }); const targetH = 56; const ratio = img.width && img.height ? img.width / img.height : 1; const lw = Math.round(targetH * ratio); const lh = targetH; doc.addImage(logoDataUrl, 'PNG', margin, margin, lw, lh); headerBottom = Math.max(headerBottom, margin + lh); }
  doc.setFont('times','bold'); doc.setFontSize(22); const titleY = margin + 20; doc.text(name, pageW/2, titleY, { align: 'center' }); headerBottom = Math.max(headerBottom, titleY + 6);
  if (description) { doc.setFont('times','normal'); doc.setFontSize(12); doc.setTextColor(60); const descY = headerBottom + 12; doc.text(description, pageW/2, descY, { maxWidth: pageW - margin*2, align: 'center' }); headerBottom = Math.max(headerBottom, descY + 6); }
  const lineY = headerBottom + 12; doc.setDrawColor(180); doc.setLineWidth(0.8); doc.line(margin, lineY, pageW - margin, lineY); const chartStartY = lineY + 18;
  const imageRatio = await new Promise((resolve) => { const img = new Image(); img.onload = () => resolve(img.width / img.height); img.src = chartDataUrl; });
  const maxChartWidth = pageW - margin*2; const chartWidth = maxChartWidth; const chartHeight = chartWidth / imageRatio;
  doc.addImage(chartDataUrl, 'PNG', (pageW - chartWidth)/2, chartStartY, chartWidth, chartHeight);
  doc.setDrawColor(200); doc.line(margin, pageH - margin - 16, pageW - margin, pageH - margin - 16); doc.setFont('times','italic'); doc.setFontSize(10); doc.setTextColor(100); doc.text(`Generado el ${new Date().toLocaleString()}`, margin, pageH - margin);
  doc.save(`${name.replace(/[^a-z0-9-_ ]/gi,'') || 'reporte'}.pdf`);
}

async function generateExcelReport(node, dataRows, name = 'reporte') {
  if (!node) throw new Error('Elemento no encontrado');
  let imageDataUrl;
  if (typeof SVGElement !== 'undefined' && node instanceof SVGElement) imageDataUrl = await svgElementToPngDataUrl(node, 2);
  else if (node instanceof HTMLElement) {
        try {
          const html2canvasModule = await import('html2canvas'); 
          const html2canvas = html2canvasModule.default || html2canvasModule; 
          const canvas = await html2canvas(node, { scale: 2 }); 
          imageDataUrl = canvas.toDataURL('image/png'); 
        } catch (err) { 
          void err; 
          const innerSvg = node.querySelector && node.querySelector('svg'); 
          if (innerSvg) imageDataUrl = await svgElementToPngDataUrl(innerSvg, 2); 
          else throw new Error('Instala html2canvas'); 
        }
  }
  let ExcelJSModule; try { ExcelJSModule = await import('exceljs'); } catch (err) { void err; throw new Error('Instala exceljs'); }
  const ExcelJS = ExcelJSModule && (ExcelJSModule.default || ExcelJSModule);
  const workbook = new ExcelJS.Workbook(); const ws = workbook.addWorksheet('Datos'); ws.mergeCells('A1:D1'); ws.getCell('A1').value = name; ws.getCell('A1').font = { bold: true, size: 14 }; ws.addRow([]);
  ws.addRow(['#', 'Administrador', 'Acción', 'Conteo']);
  dataRows.forEach((r, i) => { ws.addRow([i+1, r.label, r.action || 'Total', r.value]); });
  const imgSheet = workbook.addWorksheet('Gráfica'); const base64 = imageDataUrl.split(',')[1]; const imgId = workbook.addImage({ base64, extension: 'png' }); imgSheet.addImage(imgId, { tl: { col: 0, row: 0 }, ext: { width: 800, height: 450 } });
  const buf = await workbook.xlsx.writeBuffer(); const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${name.replace(/[^a-z0-9-_ ]/gi,'') || 'reporte'}.xlsx`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

const AuditStatistics = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [metric, setMetric] = useState('total'); // total | reviews | stateChanges | archives
  const [chartData, setChartData] = useState([]);
  const [generation, setGeneration] = useState(0);
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null); // { id, label }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [admList, complaints] = await Promise.all([AdminService.getAllAdmins(), ComplaintService.getAllComplaints()]);
        const adminsSafe = Array.isArray(admList) ? admList : [];
        setAdmins(adminsSafe);

        // Aggregate actions per admin
        const map = new Map();
        const missingStateChangeComplaintIds = [];
        // initialize map
        adminsSafe.forEach(a => map.set(String(a.id || a._id || a.correo || a.nombre), { label: a.nombre || a.correo || String(a.id || a._id), reviews: 0, stateChanges: 0, archives: 0 }));

        // Inspect complaints for admin-related fields
        for (const c of (Array.isArray(complaints) ? complaints : [])) {
          // date filter
          const fecha = c.fechaCreacion ? new Date(c.fechaCreacion) : null;
          if (fromDate && fecha && new Date(fromDate) > fecha) continue;
          if (toDate && fecha && new Date(toDate) < fecha) continue;

          // reviews: look for reviewers or 'revisadoPor'
          if (c.revisadoPor) {
            const id = String(c.revisadoPor.id || c.revisadoPor || c.revisadoPorId || c.revisadoPorEmail || c.revisadoPorCorreo || c.revisadoPor);
            if (!map.has(id)) map.set(id, { label: id, reviews: 0, stateChanges: 0, archives: 0 });
            map.get(id).reviews += 1;
          }

          // archives: check archivar info
          if (c.archivadoPor) {
            const id = String(c.archivadoPor.id || c.archivadoPor || c.archivadoPorId);
            if (!map.has(id)) map.set(id, { label: id, reviews: 0, stateChanges: 0, archives: 0 });
            map.get(id).archives += 1;
          }

            // state changes: if complaint includes history
            if (Array.isArray(c.cambiosEstado) && c.cambiosEstado.length) {
              for (const ch of c.cambiosEstado) {
                const actorId = String(ch.usuarioId || ch.adminId || ch.actorId || ch.usuario || ch.admin || ch.usuarioId);
                if (!map.has(actorId)) map.set(actorId, { label: actorId, reviews: 0, stateChanges: 0, archives: 0 });
                map.get(actorId).stateChanges += 1;
              }
            } else {
              // collect complaints that miss cambiosEstado to fetch in batch later (avoid serial awaits)
              missingStateChangeComplaintIds.push(c.id || c._id || c.denunciaId || c.idDenuncia);
            }
        }

        // If there are complaints missing cambiosEstado, fetch them with limited concurrency
        if (missingStateChangeComplaintIds.length && StateChangeService.getCambiosEstadoByDenunciaId) {
          const ids = missingStateChangeComplaintIds.filter(Boolean);
          const concurrency = 6; // tune this value based on backend capacity
          let idx = 0;
          const workers = Array.from({ length: concurrency }).map(async () => {
            while (true) {
              const i = idx;
              idx += 1;
              if (i >= ids.length) break;
              const complaintId = ids[i];
              try {
                const changes = await StateChangeService.getCambiosEstadoByDenunciaId(complaintId);
                if (Array.isArray(changes)) {
                  for (const ch of changes) {
                    const actorId = String(ch.usuarioId || ch.adminId || ch.actorId || ch.usuario || ch.admin || ch.usuarioId);
                    if (!map.has(actorId)) map.set(actorId, { label: actorId, reviews: 0, stateChanges: 0, archives: 0 });
                    map.get(actorId).stateChanges += 1;
                  }
                }
              } catch (err) { void err; }
            }
          });
          try { await Promise.all(workers); } catch (err) { void err; }
        }

        // Build dataset per selected metric
        const rows = [];
        for (const [id, v] of map.entries()) {
          const label = v.label || id;
          if (metric === 'reviews') rows.push({ id, label, value: v.reviews });
          else if (metric === 'stateChanges') rows.push({ id, label, value: v.stateChanges });
          else if (metric === 'archives') rows.push({ id, label, value: v.archives });
          else rows.push({ id, label, value: v.reviews + v.stateChanges + v.archives });
        }

        rows.sort((a,b) => b.value - a.value);
        const top = rows.slice(0, 12);
        // If a specific admin was selected, show only that admin's row (if exists)
        if (selectedAdmin && selectedAdmin.id) {
          const found = rows.find(r => String(r.id) === String(selectedAdmin.id));
          setChartData(found ? [found] : []);
        } else {
          setChartData(top);
        }
        setGeneration(g => g + 1);
      } catch (err) {
        console.error('Error obteniendo estadísticas de auditoría', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [fromDate, toDate, metric, selectedAdmin]);

  if (loading) return <p>Cargando estadísticas de auditoría...</p>;

  const palette = ["#ef4444","#f97316","#f59e0b","#10b981","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#ef6b8a","#14b8a6"];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Estadísticas de acciones administrativas</h2>
      <div className="text-sm text-gray-600 mb-2">Administradores: {admins.length}</div>
      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm">Métrica</label>
          <select value={metric} onChange={(e) => setMetric(e.target.value)} className="px-3 py-2 border rounded">
            <option value="total">Por Total de Acciones</option>
            <option value="reviews">Revisiones</option>
            <option value="stateChanges">Cambios de Estado</option>
            <option value="archives">Archivamientos</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Desde</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Hasta</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-3 py-2 border rounded" />
        </div>
        <div className="flex gap-2 items-center">
          <div>
            <button type="button" onClick={() => setShowAdminModal(true)} className="px-3 py-2 bg-gray-200 text-black rounded">Seleccionar administrador</button>
          </div>
          <div className="flex items-center gap-2">
            {selectedAdmin ? (
              <>
                <span className="text-sm text-gray-800">{selectedAdmin.label}</span>
                <button className="px-2 py-1 text-sm text-red-600" onClick={() => setSelectedAdmin(null)}>Limpiar</button>
              </>
            ) : (
              <span className="text-sm text-gray-600">Todos los administradores</span>
            )}
          </div>

        </div>

        {/* Export buttons */}
        <div className="flex gap-2">
          <button onClick={async () => {
            const name = window.prompt('Nombre del reporte:'); if (!name) return; const description = window.prompt('Descripción (opcional):') || '';
            try { await generatePdfReport(containerRef.current, name, description); } catch (err) { console.error(err); alert('Error generando PDF. Revisa la consola.'); }
          }} className="px-3 py-2 bg-blue-600 text-white rounded">Generar reporte PDF</button>

          <button onClick={async () => {
            const name = window.prompt('Nombre del archivo Excel:'); if (!name) return;
            try { await generateExcelReport(containerRef.current, chartData, name); } catch (err) { console.error(err); alert('Error generando Excel. Revisa la consola.'); }
          }} className="px-3 py-2 bg-green-600 text-white rounded">Exportar Excel</button>
        </div>
      </div>

      {/* Admin selection modal */}
      {showAdminModal && (
        <ModalWrapper active={showAdminModal} onClose={() => setShowAdminModal(false)}>
          <div className="bg-white p-6 rounded shadow-md w-[min(1000px,94vw)] max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-2">Seleccionar administrador</h3>
            <input value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} placeholder="Buscar por nombre o correo..." className="w-full px-3 py-2 border rounded mb-3" />
            <div className="space-y-2">
              {admins
                .filter(a => {
                  const label = a.nombre || a.correo || String(a.id || a._id || '');
                  return label.toLowerCase().includes(adminSearch.toLowerCase());
                })
                .map(a => {
                  const id = String(a.id || a._id || a.correo || a.nombre || '');
                  const label = a.nombre || a.correo || String(a.id || a._id || '');
                  return (
                    <div key={id} className="cursor-pointer px-3 py-2 hover:bg-gray-100 rounded flex justify-between items-center" onClick={() => { setSelectedAdmin({ id, label }); setShowAdminModal(false); setAdminSearch(''); }}>
                      <div className="truncate">{label}</div>
                      <div className="text-sm text-gray-500">Seleccionar</div>
                    </div>
                  );
                })}
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-3 py-2 bg-gray-200 rounded" onClick={() => setShowAdminModal(false)}>Cerrar</button>
            </div>
          </div>
        </ModalWrapper>
      )}

      <div className="bg-white p-4 rounded shadow">
        <div className="flex gap-6">
          <div className="flex-1">
            <Bars key={`bars-${generation}`} data={chartData} palette={palette} xLabel={"Administradores"} generation={generation} svgRef={chartRef} />
          </div>
          <aside className="w-96 border-l pl-6 flex flex-col">
            <h3 className="text-sm font-medium mb-2">Leyenda</h3>
            <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
              {chartData.map((d,i) => (
                <div key={d.label} className="flex items-center">
                  <span className="text-sm font-medium w-6 text-right mr-2">{i+1}.</span>
                  <span style={{ background: palette[i % palette.length] }} className="w-5 h-5 rounded-sm inline-block flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate ml-3 flex-1">{d.label}</span>
                  <span className="ml-4 text-sm text-gray-500">{d.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AuditStatistics;
        
