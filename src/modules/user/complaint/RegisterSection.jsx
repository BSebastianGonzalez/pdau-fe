import React from "react";
import Tag from "../../../components/Tag";
import TextField from "../../../components/TextField";

const validateText = (text) => {
  // Asegúrate de que el texto tenga al menos 3 caracteres y no contenga caracteres especiales
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
  return text.trim().length >= 3 && regex.test(text);
};

const RegisterSection = () => {
  return (
    <section className="mt-10">
      <h1 className="text-2xl text-center font-bold">
        Registro de denuncia anónima
      </h1>
      <p className="text-left text-gray-600 mt-2 ml-4">
        Los campos obligatorios se indican con{" "}
        <img
          src="img/obligatory.svg" // Cambia esta ruta por la correcta
          alt="Campo obligatorio"
          className="inline-block w-6 h-6"
        />
      </p>

      <div className="flex flex-col md:flex-row items-start gap-4 mt-8">
        {/* Campo de Título */}
        <div className="flex items-center gap-2">
          <img
            src="img/obligatory.svg" // Cambia esta ruta por la correcta
            alt="Campo obligatorio"
            className="w-6 h-6"
          />
          <Tag text="Título" />
        </div>
        <TextField 
          placeholder="Escribe un título corto, claro y conciso" 
          required 
          validate={validateText} 
        />
      </div>

      <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
        {/* Campo de Descripción */}
        <div className="flex items-center gap-2">
          <img
            src="img/obligatory.svg" // Cambia esta ruta por la correcta
            alt="Campo obligatorio"
            className="w-6 h-6"
          />
          <Tag text="Descripción" />
        </div>
        <TextField 
          placeholder="Añade una descripción detallada" 
          height="h-32" 
          required 
          validate={validateText} 
        />
      </div>
    </section>
  );
};

export default RegisterSection;