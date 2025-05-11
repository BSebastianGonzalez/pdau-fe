import React from "react";
import Tag from "../../../../components/Tag";
import TextField from "../../../../components/TextField";
import CategorySelector from "./CategorySelector";
import FileUploader from "./FileUploader";
import Button from "../../../../components/Button";
import { Link } from "react-router-dom";

const validateText = (text) => {
  // Asegúrate de que el texto tenga al menos 3 caracteres y no contenga caracteres especiales
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
  return text.trim().length >= 3 && regex.test(text);
};

const handleFilesChange = (files) => {
  console.log("Archivos seleccionados:", files);
};

const categories = ["Acoso", "Discriminación", "Fraude", "Otro"]; // Ejemplo de categorías

const RegisterSection = () => {
  const handleCategorySelect = (category) => {
    console.log("Categoría seleccionada:", category);
  };

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

      {/* Campo de Título */}
      <div className="flex flex-col md:flex-row items-start gap-4 mt-8">
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

      {/* Campo de Descripción */}
      <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
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

      {/* Campo de Seleccionar Categoría */}
      <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
        <div className="flex items-center gap-2">
          <img
            src="img/obligatory.svg" // Cambia esta ruta por la correcta
            alt="Campo obligatorio"
            className="w-6 h-6"
          />
          <Tag text="Seleccionar categoría" />
        </div>
        <CategorySelector
          categories={categories}
          onSelect={handleCategorySelect}
        />
      </div>
      {/* Campo de Subir Archivo de Evidencia */}
      <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
        <div className="flex items-center gap-2">
          {/* Imagen invisible */}
          <img
            src="img/obligatory.svg" // Cambia esta ruta por la correcta
            alt="Campo obligatorio"
            className="w-6 h-6"
            style={{ visibility: "hidden" }}
          />
          <Tag text="Subir archivo de evidencia" />
        </div>

        <FileUploader onFilesChange={handleFilesChange} />
      </div>
      {/* Botones de acción */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          text="Enviar denuncia"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => console.log("Enviar denuncia")}
        />

        <Link
          to="/"
          onClick={(e) => {
            if (
              !window.confirm(
                "¿Estás seguro de que deseas cancelar la denuncia?"
              )
            ) {
              e.preventDefault(); // Evita la redirección si el usuario cancela
            }
          }}
        >
          <Button
            text="Cancelar"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => console.log("Cancelar")}
          />
        </Link>
      </div>
    </section>
  );
};

export default RegisterSection;
