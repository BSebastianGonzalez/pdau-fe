import React, { useEffect, useState } from "react";
import Tag from "../../../../components/Tag";
import TextField from "../../../../components/TextField";
import CategorySelector from "./CategorySelector";
import FileUploader from "./FileUploader";
import Button from "../../../../components/Button";
import { useNavigate } from "react-router-dom";
import ComplaintService from "../../../../services/ComplaintService"; // Importar el servicio

const validateText = (text) => {
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
  return text.trim().length >= 3 && regex.test(text);
};

const RegisterSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ComplaintService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
  };

  const handleFilesChange = (files) => {
    setFiles(files);
  };

  const handleSubmit = async () => {
    if (!title || !description || selectedCategories.length === 0) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const complaintData = {
      titulo: title,
      descripcion: description,
      categoriaIds: selectedCategories.map((category) => category.id),
    };
    
    console.log("Enviando datos:", complaintData);
    try {
      
      const response = await ComplaintService.createComplaint(complaintData);
      const token = response.token; // Asume que el backend devuelve un token
      navigate("/finished_register", { state: { token } }); // Redirige con el token
    } catch (error) {
      console.error("Error al registrar la denuncia:", error);
      alert("Hubo un error al registrar la denuncia. Inténtelo nuevamente.");
    }
  };

  return (
    <section className="mt-10">
      <h1 className="text-2xl text-center font-bold">
        Registro de denuncia anónima
      </h1>
      <p className="text-left text-gray-600 mt-2 ml-4">
        Los campos obligatorios se indican con{" "}
        <img
          src="img/obligatory.svg"
          alt="Campo obligatorio"
          className="inline-block w-6 h-6"
        />
      </p>

      {/* Campo de Título */}
      <div className="flex flex-col md:flex-row items-start gap-4 mt-8">
        <div className="flex items-center gap-2">
          <img
            src="img/obligatory.svg"
            alt="Campo obligatorio"
            className="w-6 h-6"
          />
          <Tag text="Título" />
        </div>
        <TextField
          placeholder="Escribe un título corto, claro y conciso"
          required
          validate={validateText}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Campo de Descripción */}
      <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
        <div className="flex items-center gap-2">
          <img
            src="img/obligatory.svg"
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Campo de Seleccionar Categoría */}
      <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
        <div className="flex items-center gap-2">
          <img
            src="img/obligatory.svg"
            alt="Campo obligatorio"
            className="w-6 h-6"
          />
          <Tag text="Seleccionar categoría" />
        </div>
        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <CategorySelector
            categories={categories}
            onSelect={handleCategorySelect}
          />
        )}
      </div>

      {/* Campo de Subir Archivo de Evidencia */}
      <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
        <div className="flex items-center gap-2">
          <img
            src="img/obligatory.svg"
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
          onClick={handleSubmit}
        />
        <Button
          text="Cancelar"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => {
            if (
              window.confirm(
                "¿Estás seguro de que deseas cancelar la denuncia?"
              )
            ) {
              navigate("/");
            }
          }}
        />
      </div>
    </section>
  );
};

export default RegisterSection;
