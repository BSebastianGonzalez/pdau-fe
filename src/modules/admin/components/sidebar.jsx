import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [selectedSection, setSelectedSection] = useState("Inicio"); // Estado para la sección seleccionada
  const navigate = useNavigate();

  const handleSectionClick = (section) => {
    setSelectedSection(section); // Actualizar la sección seleccionada
    if (section === "Inicio") {
      navigate("/admin"); // Navegar a la página de inicio
    }
  };

  const handleLogout = () => {
    navigate("/"); // Navegar a la página de inicio de sesión
  };

  return (
    <div className="h-full w-full bg-[#DB4747] text-white flex flex-col justify-between py-6">
      {/* Parte superior */}
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <img
            src="img/ufps.png"
            alt="UFPS Logo"
            className="w-22 h-auto"
          />
        </div>

        {/* Sección de Inicio */}
        <div
          className={`w-full px-4 py-3 flex items-center gap-4 cursor-pointer ${
            selectedSection === "Inicio" ? "bg-white/40 rounded-lg" : ""
          }`}
          onClick={() => handleSectionClick("Inicio")}
        >
          <img src="img/home-alt.svg" alt="Inicio" className="w-6 h-6" />
          <span className="text-lg font-medium">Inicio</span>
        </div>
      </div>

      {/* Parte inferior */}
      <div
        className="w-full px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-white/20"
        onClick={handleLogout}
      >
        <img src="img/cerrar-sesion.png" alt="Cerrar sesión" className="w-6 h-6" />
        <span className="text-lg font-medium">Cerrar sesión</span>
      </div>
    </div>
  );
};

export default Sidebar;