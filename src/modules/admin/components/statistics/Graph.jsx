import React, { useEffect, useState } from "react";
import ComplaintService from "../../../../services/ComplaintService";

// Simple SVG bar chart renderer with Y axis and more padding
const Bars = ({ data, width = 1000, height = 420, palette = [], xLabel = "", generation = 0 }) => {
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
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="mx-auto">
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

const Graph = () => {
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generation, setGeneration] = useState(0);

  const [metric, setMetric] = useState("category"); // category | status
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chartData, setChartData] = useState([]);

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
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex gap-6">
          <div className="flex-1">
            <Bars key={`bars-${generation}`} data={chartData} palette={palette} xLabel={metric === "category" ? "Categorías" : "Estados"} generation={generation} />
          </div>

          <aside className="w-96 border-l pl-6 flex flex-col">
            <h3 className="text-sm font-medium mb-2">Leyenda</h3>
            <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
              {chartData.map((d, i) => (
                <div key={d.label} className="flex items-center">
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
    </div>
  );
};

export default Graph;
