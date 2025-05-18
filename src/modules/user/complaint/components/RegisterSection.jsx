import React, { useEffect, useState } from "react";
import Tag from "../../../../components/Tag";
import TextField from "../../../../components/TextField";
import CategorySelector from "./CategorySelector";
import FileUploader from "./FileUploader";
import Button from "../../../../components/Button";
import { useNavigate } from "react-router-dom";
import ComplaintService from "../../../../services/ComplaintService"; // Importar el servicio

const RegisterSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
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

  // Animación del modal de carga
  useEffect(() => {
    if (loadingModal) {
      setTimeout(() => setIsLoadingModalOpen(true), 10);
    } else {
      setIsLoadingModalOpen(false);
    }
  }, [loadingModal]);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
  };

  const handleFilesChange = (files) => {
    setFiles(files);
    console.log("Archivos seleccionados:", files);
  };

  const handleSubmit = async () => {
    // Eliminadas las comprobaciones de texto válido
    if (!title || !description || selectedCategories.length === 0) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    setLoadingModal(true); // Mostrar modal de carga

    const complaintData = {
      titulo: title,
      descripcion: description,
      categoriaIds: selectedCategories.map((category) => category.id),
    };

    try {
      const response = await ComplaintService.createComplaint(complaintData);
      const token = response.token; // Asume que el backend devuelve un token
      const denunciaId = response.id; // Asegúrate que el backend devuelve el id de la denuncia

      console.log("Archivos en estado actual:", files);

      // 2. Subir archivos de evidencia si hay
      if (files && files.length > 0 && denunciaId) {
        for (const file of files) {
          console.log("Enviando archivo:", file, "con denunciaId:", denunciaId);
          await ComplaintService.uploadFile(file, denunciaId);
        }
      }

      setLoadingModal(false); // Ocultar modal de carga
      // 3. Redirigir
      navigate("/finished_register", { state: { token } });
    } catch (error) {
      setLoadingModal(false); // Ocultar modal de carga
      console.error("Error al registrar la denuncia:", error);
      alert("Hubo un error al registrar la denuncia. Inténtelo nuevamente.");
    }
  };

  return (
    <section className="mt-10 relative">
      {/* Modal de carga animado */}
      {loadingModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/30">
          <div
            className={`bg-white rounded-lg shadow-lg px-8 py-6 flex flex-col items-center transition-all duration-300
              ${isLoadingModalOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
            style={{ minWidth: "320px" }}
          >
            <span className="text-lg font-semibold mb-4 text-center">
              Enviando denuncia. Esto podría demorar un poco.
            </span>
            {/* Barra de carga simulada */}
            <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-red-500 animate-pulse-bar" style={{ width: "60%" }}></div>
            </div>
          </div>
        </div>
      )}

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
