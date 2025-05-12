import React, { useEffect, useState } from "react";
import ComplaintService from "../services/ComplaintService";

const TestPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await ComplaintService.getAllComplaints();
        setComplaints(data);
      } catch (err) {
        setError("Error al cargar las denuncias.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <p>Cargando denuncias...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Denuncias</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Título</th>
            <th className="border border-gray-300 px-4 py-2">Descripción</th>
            <th className="border border-gray-300 px-4 py-2">Categorías</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td className="border border-gray-300 px-4 py-2">{complaint.id}</td>
              <td className="border border-gray-300 px-4 py-2">{complaint.titulo}</td>
              <td className="border border-gray-300 px-4 py-2">{complaint.descripcion}</td>
              <td className="border border-gray-300 px-4 py-2">
                {complaint.categorias && complaint.categorias.length > 0
                  ? complaint.categorias.map((categoria) => categoria.nombre).join(", ")
                  : "Sin categorías"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestPage;