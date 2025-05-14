import React from "react";
import { useLocation } from "react-router-dom"; // Importar useLocation

const WelcomeSection = () => {
  const location = useLocation(); // Obtener el estado de la navegación
  const adminName = location.state?.adminName || "Administrador"; // Obtener el nombre del administrador

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-center">
        Bienvenido al perfil administrativo {adminName}
      </h1>
    </div>
  );
};

export default WelcomeSection;