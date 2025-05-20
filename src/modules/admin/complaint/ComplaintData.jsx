import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ComplaintService from "../../../services/ComplaintService";
import StatusTag from "../../../components/StatusTag";
import Button from "../../../components/Button";

const ComplaintData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtén el ID de la denuncia desde el estado de navegación o query param
  const complaintId = location.state?.complaintId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!complaintId) {
          navigate("/admin"); // Redirige si no hay ID
          return;
        }
        const data = await ComplaintService.getComplaintById(complaintId);
        setComplaint(data);

        const archivos = await ComplaintService.getFilesByComplaintId(
          complaintId
        );
        setFiles(archivos);
      } catch (error) {
        console.error("Error al obtener la denuncia:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [complaintId, navigate]);

  if (loading) {
    return <div className="p-8 text-center">Cargando denuncia...</div>;
  }

  if (!complaint) {
    return (
      <div className="p-8 text-center text-red-500">
        No se encontró la denuncia.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-gray-100 min-h-screen">
      {/* Columna principal */}
      <div className="flex-1">
        <h1 className="text-5xl font-bold mb-8 text-center">
          Revision de denuncia anonima
        </h1>
        <div className="flex flex-col gap-6">
          {/* Etiqueta y campo de Título */}
          <div className="flex items-center gap-4">
            <span className="bg-black text-white px-6 py-3 rounded font-bold text-lg min-w-[160px] text-center">
              Título
            </span>
            <input
              type="text"
              value={complaint.titulo}
              readOnly
              className="flex-1 border px-3 py-2 rounded"
            />
          </div>
          {/* Etiqueta y campo de Descripción */}
          <div className="flex items-center gap-4">
            <span className="bg-black text-white px-6 py-3 rounded font-bold text-lg min-w-[160px] text-center">
              Descripción
            </span>
            <textarea
              value={complaint.descripcion}
              readOnly
              className="flex-1 border px-3 py-2 rounded h-32 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Columna lateral */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        {/* Categorías */}
        <div className="bg-gray-900 text-white rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-bold mb-2 text-center w-full">Categorias</div>
          <div className="flex flex-wrap gap-2 justify-center w-full">
            {(complaint.categorias || []).map((cat) => (
              <span
                key={cat.id}
                className="bg-gray-300 text-black px-3 py-1 rounded-full font-semibold"
              >
                {cat.nombre}
              </span>
            ))}
          </div>
        </div>
        {/* Archivos de evidencia */}
        <div className="bg-purple-200 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-bold mb-3 bg-gray-900 text-white px-4 py-2 rounded text-center">
            Archivos de evidencia
          </div>
          {files.length > 0 ? (
            <ul className="space-y-2 w-full">
              {files.map((file) => {
                const name = (file.nombreArchivo || file.urlArchivo || "").toLowerCase();
                let icon = "/img/document.png";
                if (/\.(jpg|jpeg|png|gif|bmp|webp|tif|tiff|ico|svg)$/.test(name)) {
                  icon = "/img/photo.png";
                } else if (/\.(mp4|webm|ogv|ogg|mov|flv|m3u8|3gp)$/.test(name)) {
                  icon = "/img/video.png";
                } else if (/\.(mp3|wav|aac)$/.test(name)) {
                  icon = "/img/audio.png";
                }
                return (
                  <li
                    key={file.id}
                    className="flex items-center gap-3 bg-white rounded px-2 py-2 shadow-sm hover:bg-gray-50 transition"
                  >
                    <img
                      src={icon}
                      alt="Archivo"
                      className="w-6 h-6"
                    />
                    <a
                      href={file.urlArchivo || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 font-medium hover:underline break-all"
                      title={file.nombreArchivo || file.urlArchivo}
                    >
                      {file.nombreArchivo || file.urlArchivo}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <span className="text-gray-500">No hay archivos</span>
          )}
        </div>
        {/* Estado actual */}
        <div className="bg-purple-200 rounded-lg p-4 shadow flex flex-col items-center">
          <div className="font-bold mb-3 bg-gray-900 text-white px-4 py-2 rounded text-center">
            Estado actual
          </div>
          <div className="mt-1 w-full flex justify-center">
            <StatusTag
              text={complaint.estado?.nombre}
              className="text-lg font-bold px-6 py-2 rounded-lg shadow bg-white text-purple-900 border border-purple-300"
            />
          </div>
        </div>
        {/* Botón cambiar estado */}
        <Button
          text="Cambiar estado"
          className="bg-red-600 hover:bg-red-700 text-white mt-2"
          onClick={() => {
            alert(
              "Funcionalidad de cambio de estado pendiente de implementar."
            );
          }}
        />
      </div>
    </div>
  );
};

export default ComplaintData;
