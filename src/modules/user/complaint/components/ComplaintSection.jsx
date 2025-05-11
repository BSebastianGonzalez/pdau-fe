import React from "react";
import Button from "../../../../components/Button";
import { Link } from "react-router-dom";

const ComplaintSection = () => {
  return (
    <div className="flex flex-col items-center space-y-12 w-full px-4">
      {/* Título principal alineado a la izquierda */}
      <div className="w-full max-w-5xl">
        <h1 className="text-6xl text-center font-bold mt-10">
          Registro de denuncia anónima
        </h1>
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row justify-center w-full max-w-5xl space-y-8 md:space-y-0 md:space-x-8 mt-9">
        {/* Primer contenedor */}
        <div className="flex flex-col border border-gray-300 rounded-2xl shadow-lg w-full md:w-1/2">
          <div className="bg-black text-white text-center font-bold py-4 rounded-t-2xl">
            Importancia de la denuncia anónima
          </div>
          <div className="p-6 text-justify text-sm leading-relaxed">
            Realizar una denuncia es un paso esencial para salvaguardar la
            integridad y transparencia dentro de nuestra comunidad
            universitaria. Con tu aporte, contribuyes a prevenir y combatir
            situaciones como acoso, fraude o corrupción, permitiendo que sean
            investigadas sin exponer tu identidad.
          </div>
        </div>

        {/* Segundo contenedor */}
        <div className="flex flex-col border border-gray-300 rounded-2xl shadow-lg w-full md:w-1/2">
          <div className="bg-black text-white text-center font-bold py-4 rounded-t-2xl">
            Sustento legal en Colombia
          </div>
          <div className="p-6 text-justify text-sm leading-relaxed">
            Esta plataforma se fundamenta en la Ley 1474 de 2011 (Estatuto
            Anticorrupción), que protege el derecho a denunciar y garantiza la
            confidencialidad, asegurando el acceso a la justicia y la protección
            de tu identidad y derechos.
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
        <Link to="/register" className="flex">
        <Button
          text="Seguir con la denuncia"
          className="bg-red-600 hover:bg-red-700 text-white"
        />
        </Link>
        <Link to="/" className="flex">
          <Button
            text="Cancelar"
            className="bg-red-600 hover:bg-red-700 text-white"
          />
        </Link>
      </div>
    </div>
  );
};

export default ComplaintSection;
