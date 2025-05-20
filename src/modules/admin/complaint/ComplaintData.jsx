import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ComplaintService from "../../../services/ComplaintService";
import StateChangeService from "../../../services/StateChangeService";
import Button from "../../../components/Button";
import ComplaintSidebar from "../components/ComplaintSidebar";
import SidebarCategories from "../components/SidebarCategories";
import SidebarFiles from "../components/SidebarFiles";
import SidebarState from "../components/SidebarState";

const ComplaintData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [nextStates, setNextStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [justification, setJustification] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Obtén el ID de la denuncia desde el estado de navegación o query param
  const complaintId =
    location.state?.complaintId ||
    new URLSearchParams(window.location.search).get("complaintId");

  // Obtén el idAdministrador desde el objeto guardado en localStorage al iniciar sesión
  const adminId = (() => {
    try {
      const admin = JSON.parse(localStorage.getItem("admin"));
      return admin?.id || null;
    } catch {
      return null;
    }
  })();

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

        // Obtener los estados siguientes del estado actual
        if (data.estado?.siguientes?.length > 0) {
          const promises = data.estado.siguientes.map((id) =>
            ComplaintService.getEstadoById(id)
          );
          const estados = await Promise.all(promises);
          setNextStates(estados);
        } else {
          setNextStates([]);
        }
      } catch (error) {
        console.error("Error al obtener la denuncia:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [complaintId, navigate]);

  const handleOpenModal = () => {
    setSelectedState("");
    setJustification("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedState("");
    setJustification("");
  };

  const handleSubmitStateChange = async (e) => {
    e.preventDefault();
    if (!selectedState || !justification.trim()) return;
    setSubmitting(true);
    try {
      await StateChangeService.registrarCambioEstado({
        idDenuncia: complaintId,
        idAdministrador: adminId,
        idEstado: Number(selectedState),
        justificacion: justification,
      });
      // Recargar datos
      setShowModal(false);
      setSubmitting(false);
      setLoading(false);
      // Recarga la denuncia para mostrar el nuevo estado
      const data = await ComplaintService.getComplaintById(complaintId);
      setComplaint(data);
      // Actualiza los estados siguientes
      if (data.estado?.siguientes?.length > 0) {
        const promises = data.estado.siguientes.map((id) =>
          ComplaintService.getEstadoById(id)
        );
        const estados = await Promise.all(promises);
        setNextStates(estados);
      } else {
        setNextStates([]);
      }
    } catch (error) {
      alert("Error al cambiar el estado. Intenta nuevamente.");
      setSubmitting(false);
    }
  };

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
        <ComplaintSidebar>
          <SidebarCategories categorias={complaint.categorias} />
          <SidebarFiles files={files} />
          <SidebarState estado={complaint.estado} />
          <Button
            text="Cambiar estado"
            className="bg-red-600 hover:bg-red-700 text-white mt-2"
            onClick={handleOpenModal}
          />
        </ComplaintSidebar>
      </div>

      {/* Modal de cambio de estado */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={handleCloseModal}
              disabled={submitting}
              aria-label="Cerrar"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
              Cambiar estado de la denuncia
            </h2>
            <form onSubmit={handleSubmitStateChange} className="flex flex-col gap-4">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Selecciona el nuevo estado
                </label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value="">Selecciona un estado...</option>
                  {nextStates.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Justificación del cambio
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  required
                  rows={3}
                  disabled={submitting}
                  placeholder="Explica la razón del cambio de estado"
                />
              </div>
              <Button
                text={submitting ? "Enviando..." : "Confirmar cambio"}
                className="bg-red-500 hover:bg-red-800 text-white w-full py-3 text-lg rounded-lg mt-2"
                type="submit"
                disabled={submitting}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintData;
