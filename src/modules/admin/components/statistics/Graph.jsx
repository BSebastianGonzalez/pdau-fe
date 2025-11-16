import React, { useEffect, useState, useRef } from "react";
import ComplaintService from "../../../../services/ComplaintService";

// Simple SVG bar chart renderer with Y axis and more padding
const Bars = ({ data, width = 1000, height = 420, palette = [], xLabel = "", generation = 0, svgRef = null }) => {
  const [animate, setAnimate] = useState(false);

  const leftPad = 72;
  const rightPad = 48;
  const topPad = 32;
  // replaced rotated text labels with numeric labels, use a smaller bottom padding
  const adjustedBottomPad = 64;

  const chartWidth = width - leftPad - rightPad;
  const chartHeight = height - topPad - adjustedBottomPad;
  const safeData = Array.isArray(data) ? data : [];
  const max = safeData.length === 0 ? 0 : Math.max(...safeData.map((d) => d.value), 0);
  const gap = 14;
  const barWidth = Math.max(20, chartWidth / Math.max(1, safeData.length) - gap);

  const ticks = 5;

  // trigger animation when generation changes (remount-safe)
  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 30);
    return () => clearTimeout(t);
  }, [generation]);

  return (
    <div className="overflow-x-auto">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="mx-auto">
        <g transform={`translate(${leftPad}, ${topPad})`}>
          {/* y-axis gridlines and ticks */}
          {[...Array(ticks + 1)].map((_, i) => {
            const y = (chartHeight * i) / ticks;
            const value = Math.round(max - (i * max) / ticks);
            return (
              <g key={`tick-${i}`}>
                <line x1={0} y1={y} x2={chartWidth} y2={y} stroke="#eef2f7" />
                <text x={-12} y={y + 4} textAnchor="end" fontSize={12} fill="#6b7280">
                  {value}
                </text>
              </g>
            );
          })}

          {/* y-axis label */}
          <text x={-leftPad / 2} y={chartHeight / 2} transform={`rotate(-90, ${-leftPad / 2}, ${chartHeight / 2})`} textAnchor="middle" fontSize={12} fill="#374151">
            Cantidad
          </text>

          {/* bars */}
          {safeData.map((d, i) => {
            const barHeight = max === 0 ? 0 : (d.value / max) * chartHeight;
            const x = i * (barWidth + gap);
            const y = chartHeight - barHeight;
            const label = d.label;
            const barColor = palette[i % palette.length] || "#ef4444";
            return (
              <g key={`${d.label}-${i}`}>
                <title>{`${label}: ${d.value}`}</title>

                <g transform={`translate(${x}, ${chartHeight})`}>
                  <rect
                    x={0}
                    y={animate ? -barHeight : 0}
                    width={barWidth}
                    height={animate ? barHeight : 0}
                    fill={barColor}
                    rx={6}
                    style={{
                      transition: "height 700ms cubic-bezier(0.2,0.8,0.2,1), y 700ms cubic-bezier(0.2,0.8,0.2,1)",
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                </g>

                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize={12} fill="#111827">
                  {d.value}
                </text>
                <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" fontSize={12} fill="#374151">
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* x-axis baseline */}
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e5e7eb" />

          {/* x-axis label */}
          {xLabel && (
            <text x={chartWidth / 2} y={chartHeight + 44} textAnchor="middle" fontSize={13} fill="#374151">
              {xLabel}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};

// Small modal wrapper that handles overlay and entry/exit animations
const ModalWrapper = ({ children, active = false, onClose = () => {} }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true">
      <div
        className="absolute inset-0 bg-black"
        onClick={onClose}
        style={{ opacity: active ? 0.4 : 0, transition: 'opacity 220ms ease' }}
      />
      <div style={{ animation: active ? 'modalScale 220ms cubic-bezier(.2,.8,.2,1) both' : 'modalScale 180ms cubic-bezier(.2,.8,.2,1) reverse both' }}>
        {children}
      </div>
    </div>
  );
};

const Graph = () => {
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generation, setGeneration] = useState(0);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const [metric, setMetric] = useState("category"); // category | status
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chartData, setChartData] = useState([]);

  // Inject animation keyframes once
  useEffect(() => {
    const id = 'graph-animations-style';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = `
      @keyframes legendFade {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes modalScale {
        from { opacity: 0; transform: translateY(8px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      `;
    document.head.appendChild(style);
  }, []);

  const [showExportModal, setShowExportModal] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [exportMode, setExportMode] = useState("pdf"); // 'pdf' | 'excel'
  const [exportName, setExportName] = useState("");
  const [exportDescription, setExportDescription] = useState("");

  // control modal active state for entry animation
  useEffect(() => {
    if (showExportModal) {
      const t = setTimeout(() => setModalActive(true), 20);
      return () => clearTimeout(t);
    } else {
      setModalActive(false);
    }
  }, [showExportModal]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [compls, cats] = await Promise.all([
          ComplaintService.getAllComplaints(),
          ComplaintService.getAllCategories(),
        ]);
        setComplaints(Array.isArray(compls) ? compls : []);
        setCategories(Array.isArray(cats) ? cats : []);
        // optionally attempt to fetch estados if the service exposes it (ignored if not needed)
        if (ComplaintService.getEstados) {
          try {
            await ComplaintService.getEstados();
          } catch {
            /* ignore errors fetching estados for now */
          }
        }
      } catch (err) {
        console.error("Error al obtener datos para estadísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    // Compute chart data whenever complaints, metric or filters change
    const filtered = complaints.filter((c) => {
      if (!fromDate && !toDate) return true;
      const fecha = c.fechaCreacion ? new Date(c.fechaCreacion) : null;
      if (!fecha) return true;
      if (fromDate && new Date(fromDate) > fecha) return false;
      if (toDate && new Date(toDate) < fecha) return false;
      return true;
    });

    let data = [];
    if (metric === "category") {
      // Count complaints per category name
      const map = new Map();
      // complaints may have 'categorias' array
      filtered.forEach((c) => {
        (c.categorias || []).forEach((cat) => {
          const name = cat?.nombre || String(cat?.id || "Sin categoría");
          map.set(name, (map.get(name) || 0) + 1);
        });
        // fallback if complaint has categoriaId or categoria
        if (!c.categorias || c.categorias.length === 0) {
          const id = c.categoriaId || c.categoria?.id;
          if (id) {
            const catName = categories.find((x) => x.id === id)?.nombre || String(id);
            map.set(catName, (map.get(catName) || 0) + 1);
          } else {
            map.set("Sin categoría", (map.get("Sin categoría") || 0) + 1);
          }
        }
      });
      data = Array.from(map.entries()).map(([label, value]) => ({ label, value }));
    } else if (metric === "status") {
      const map = new Map();
      filtered.forEach((c) => {
        const name = c.estado?.nombre || (c.estadoId ? String(c.estadoId) : "Sin estado");
        map.set(name, (map.get(name) || 0) + 1);
      });
      data = Array.from(map.entries()).map(([label, value]) => ({ label, value }));
    }

    // Sort descending and limit to top 12 for readability
    data.sort((a, b) => b.value - a.value);
    const slice = data.slice(0, 12);
    setChartData(slice);
    // bump generation so Bars knows a new chart was produced
    setGeneration((g) => g + 1);
  }, [complaints, categories, metric, fromDate, toDate]);

  if (loading) return <p>Cargando estadísticas...</p>;
  const palette = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#ef6b8a",
    "#14b8a6",
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Estadísticas de denuncias</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm">Métrica</label>
          <select value={metric} onChange={(e) => setMetric(e.target.value)} className="px-3 py-2 border rounded">
            <option value="category">Por Categoría</option>
            <option value="status">Por Estado</option>
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

        <div>
          <button onClick={() => { setFromDate(""); setToDate(""); }} className="px-3 py-2 bg-gray-200 rounded">Limpiar fechas</button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setExportMode("pdf"); setExportName(""); setExportDescription(""); setShowExportModal(true); }} className="px-3 py-2 bg-blue-600 text-white rounded">Generar reporte PDF</button>

          <button onClick={() => { setExportMode("excel"); setExportName(""); setExportDescription(""); setShowExportModal(true); }} className="px-3 py-2 bg-green-600 text-white rounded">Exportar Excel</button>
        </div>
      </div>

      <div ref={containerRef} className="bg-white p-4 rounded shadow">
        <div className="flex gap-6">
          <div className="flex-1">
            <Bars key={`bars-${generation}`} data={chartData} palette={palette} xLabel={metric === "category" ? "Categorías" : "Estados"} generation={generation} svgRef={chartRef} />
          </div>

          <aside className="w-96 border-l pl-6 flex flex-col">
            <h3 className="text-sm font-medium mb-2">Leyenda</h3>
            <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
              {chartData.map((d, i) => (
                <div key={d.label} className="flex items-center" style={{ animation: `legendFade 420ms ease ${i * 80}ms both` }}>
                  <span className="text-sm font-medium w-6 text-right mr-2">{i + 1}.</span>
                  <span style={{ background: palette[i % palette.length] }} className="w-5 h-5 rounded-sm inline-block flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate ml-3 flex-1">{d.label}</span>
                  <span className="ml-4 text-sm text-gray-500">{d.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
      {showExportModal && (
        <ModalWrapper active={modalActive} onClose={() => {
          // play closing animation then hide
          setModalActive(false);
          setTimeout(() => setShowExportModal(false), 220);
        }}>
          <div
            className="bg-white rounded shadow-lg p-10 z-60 transform-gpu"
            style={{
              transition: 'transform 220ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease',
              width: 'min(1100px, 94vw)',
              maxWidth: '1100px',
            }}
          >
            <h3 className="text-lg font-semibold mb-2">{exportMode === "pdf" ? "Exportar PDF" : "Exportar Excel"}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm">Nombre</label>
                <input value={exportName} onChange={(e) => setExportName(e.target.value)} className="w-full px-4 py-3 border rounded text-sm" />
              </div>
              {exportMode === "pdf" && (
                <div>
                  <label className="block text-sm">Descripción (opcional)</label>
                  <textarea rows={6} value={exportDescription} onChange={(e) => setExportDescription(e.target.value)} className="w-full px-4 py-3 border rounded text-sm" />
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 border rounded" onClick={() => { setModalActive(false); setTimeout(() => setShowExportModal(false), 220); }}>Cancelar</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={async () => {
                if (!exportName) { alert('Ingresa un nombre para el archivo'); return; }
                setModalActive(false);
                setTimeout(async () => {
                  try {
                    if (exportMode === "pdf") {
                      await generatePdfReport(containerRef.current, exportName, exportDescription);
                    } else {
                      await generateExcelReport(containerRef.current, chartData, exportName);
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Error exportando. Revisa la consola para más detalles.');
                  }
                  setShowExportModal(false);
                }, 220);
              }}>Exportar</button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

// --- EXCEL export helper ---
async function generateExcelReport(node, dataRows, name = "reporte") {
  if (!node) throw new Error("Elemento no encontrado para exportar");

  // Obtain image of the container (try html2canvas, fallback to inner SVG)
  let imageDataUrl;
  if (typeof SVGElement !== "undefined" && node instanceof SVGElement) {
    imageDataUrl = await svgElementToPngDataUrl(node, 2);
  } else if (node instanceof HTMLElement) {
    try {
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const canvas = await html2canvas(node, { scale: 2 });
      imageDataUrl = canvas.toDataURL("image/png");
    } catch (e) {
      void e;
      // fallback: try to rasterize inner SVG
      const innerSvg = node.querySelector && node.querySelector("svg");
      if (innerSvg) {
        imageDataUrl = await svgElementToPngDataUrl(innerSvg, 2);
      } else {
        throw new Error('Instala "html2canvas" con: npm install html2canvas');
      }
    }
  } else {
    throw new Error("Tipo de elemento no soportado para exportar");
  }

  // Import exceljs dynamically
  let ExcelJSModule;
  try {
    ExcelJSModule = await import("exceljs");
  } catch (err) {
    void err;
    throw new Error('Instala "exceljs" con: npm install exceljs');
  }
  const ExcelJS = ExcelJSModule && (ExcelJSModule.default || ExcelJSModule);

  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet("Datos");

  // Title and metadata
  ws.mergeCells('A1:D1');
  ws.getCell('A1').value = name;
  ws.getCell('A1').font = { bold: true, size: 14 };
  ws.addRow([]);

  // Header
  ws.addRow(["#", "Etiqueta", "Valor", "Leyenda"]);
  dataRows.forEach((r, i) => {
    ws.addRow([i + 1, r.label, r.value, r.label]);
  });

  // Add image to a separate sheet
  const imgSheet = workbook.addWorksheet('Gráfica');
  const base64 = imageDataUrl.split(',')[1];
  const imgId = workbook.addImage({ base64: base64, extension: 'png' });
  imgSheet.addImage(imgId, { tl: { col: 0, row: 0 }, ext: { width: 800, height: 450 } });

  // Generate file and trigger download
  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9-_ ]/gi, "") || 'reporte'}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// --- PDF export helpers ---
async function svgElementToPngDataUrl(svgEl, scale = 2) {
  if (!svgEl) throw new Error('SVG element no proporcionado');
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgEl);
  // ensure xmlns
  if (!svgString.match(/^<svg[^>]+xmlns="http:\/\//)) {
    svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const svgData = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

  // create image and canvas
  const img = new Image();
  img.src = svgData;
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
  });

  const rect = svgEl.getBoundingClientRect();
  const width = rect.width || img.width;
  const height = rect.height || img.height;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}

async function fetchImageAsDataUrl(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise((res2) => {
    const reader = new FileReader();
    reader.onload = () => res2(reader.result);
    reader.readAsDataURL(blob);
  });
}

async function generatePdfReport(node, name, description) {
  if (!node) throw new Error("Elemento no encontrado para exportar");

  // Rasterize node (prefer html2canvas for full container, fallback to inner SVG)
  let chartDataUrl;
  if (typeof SVGElement !== "undefined" && node instanceof SVGElement) {
    chartDataUrl = await svgElementToPngDataUrl(node, 2);
  } else if (node instanceof HTMLElement) {
    try {
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const canvas = await html2canvas(node, { scale: 2 });
      chartDataUrl = canvas.toDataURL("image/png");
    } catch (e) {
      console.warn("html2canvas not available or failed, attempting SVG fallback:", e);
      const innerSvg = node.querySelector && node.querySelector("svg");
      if (innerSvg) {
        chartDataUrl = await svgElementToPngDataUrl(innerSvg, 2);
      } else {
        throw new Error('Instala "html2canvas" con: npm install html2canvas');
      }
    }
  } else {
    throw new Error("Tipo de elemento no soportado para exportar");
  }

  // Import jsPDF
  let jsPDFModule;
  try {
    jsPDFModule = await import("jspdf");
  } catch (err) {
    void err;
    throw new Error('Instala "jspdf" con: npm install jspdf');
  }
  const { jsPDF } = jsPDFModule;

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const margin = 72;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // --- LOGO ---
  let logoDataUrl = null;
  try {
    logoDataUrl = await fetchImageAsDataUrl("/img/ufps.png");
  } catch (err) {
    void err;
  }
  let headerBottom = margin + 8;
  if (logoDataUrl) {
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = logoDataUrl;
    });
    const targetH = 56;
    const ratio = img.width && img.height ? img.width / img.height : 1;
    const lw = Math.round(targetH * ratio);
    const lh = targetH;
    doc.addImage(logoDataUrl, "PNG", margin, margin, lw, lh);
    headerBottom = Math.max(headerBottom, margin + lh);
  }

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  const titleY = margin + 20;
  doc.text(name, pageW / 2, titleY, { align: "center" });
  headerBottom = Math.max(headerBottom, titleY + 6);

  if (description) {
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(60);
    const descY = headerBottom + 12;
    doc.text(description, pageW / 2, descY, { maxWidth: pageW - margin * 2, align: "center" });
    headerBottom = Math.max(headerBottom, descY + 6);
  }

  const lineY = headerBottom + 12;
  doc.setDrawColor(180);
  doc.setLineWidth(0.8);
  doc.line(margin, lineY, pageW - margin, lineY);

  let chartStartY = lineY + 18;

  const imageRatio = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width / img.height);
    img.src = chartDataUrl;
  });

  const maxChartWidth = pageW - margin * 2;
  const chartWidth = maxChartWidth;
  const chartHeight = chartWidth / imageRatio;

  doc.addImage(chartDataUrl, "PNG", (pageW - chartWidth) / 2, chartStartY, chartWidth, chartHeight);

  // Footer
  doc.setDrawColor(200);
  doc.line(margin, pageH - margin - 16, pageW - margin, pageH - margin - 16);
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el ${new Date().toLocaleString()}`, margin, pageH - margin);

  doc.save(`${name.replace(/[^a-z0-9-_ ]/gi, "") || "reporte"}.pdf`);
}


export default Graph;
