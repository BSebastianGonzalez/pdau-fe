import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusTag from "../../../../components/StatusTag";
import Button from "../../../../components/Button";

const ComplaintResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    // Verificar si los datos de la denuncia están disponibles en el estado de navegación
    if (location.state && location.state.complaint) {
      setComplaint(location.state.complaint);
    } else {
      // Si no hay datos, redirigir al inicio
      navigate("/");
    }
  }, [location, navigate]);

  if (!complaint) {
    return null; // Mostrar nada mientras se cargan los datos
  }

  return (
    <section className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-5xl font-bold text-center">
        Consultar estado de denuncia anónima
      </h1>
      <div className="mt-10 w-full max-w-md text-center">
        <h2 className="text-xl font-bold">Denuncia anónima</h2>
        <p className="text-lg mt-2">{complaint.titulo}</p>
        <h2 className="text-xl font-bold mt-6">El estado actual de la denuncia es:</h2>
        <StatusTag text={complaint.estadoNombre} />
      </div>
      <div className="flex gap-4 mt-6">
        <Button
          text="Volver al inicio"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => navigate("/")}
        />
      </div>
    </section>
  );
};

export default ComplaintResponse;