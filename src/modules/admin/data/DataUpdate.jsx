import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button"; // Importar el componente Button
import AdminService from "../../../services/AdminService"; // Importar el servicio AdminService

const DataUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener los datos del administrador desde el estado de navegación o localStorage
  const adminData = location.state?.adminData ||
    JSON.parse(localStorage.getItem("admin")) || {
      id: 1, // Asegúrate de que el ID esté disponible
      nombre: "Juan Diego",
      apellido: "Castañeda Bohórquez",
      correo: "juandiegocb@ufps.edu.co",
      telefono: "3214208500",
      direccion: "Av 1a Calle 28",
    };

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    cedula: adminData.cedula || "",
    nombre: adminData.nombre,
    apellido: adminData.apellido,
    correo: adminData.correo,
    contrasenia: adminData.contrasenia || adminData.contrasenia, // Mantener el valor actual
    telefono: adminData.telefono,
    direccion: adminData.direccion,
    role: adminData.role || "admin",
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.telefono ||
      !formData.direccion
    ) {
      alert("Por favor, completa todos los campos antes de actualizar.");
      return;
    }

    try {
      // Llamar al servicio para actualizar los datos
      const updatedData = await AdminService.updateAdmin(
        adminData.id,
        formData
      );
      console.log("Datos actualizados exitosamente:", updatedData);

      // Actualizar los datos en localStorage
      localStorage.setItem("admin", JSON.stringify(updatedData));

      alert("Datos actualizados exitosamente.");
      navigate("/data"); // Redirigir a la página de datos
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      alert(
        "Hubo un error al actualizar los datos. Por favor, inténtalo de nuevo."
      );
    }
  };

  useEffect(() => {
    // Verificar si el estado del formulario está bien inicializado
    console.log(formData);
  }, [formData]);

  return (
    <div className="h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Actualizar datos personales</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>
        <Button
          text="Guardar cambios"
          className="bg-red-600 text-white hover:bg-red-700"
          type="submit"
        />
      </form>
    </div>
  );
};

export default DataUpdate;
