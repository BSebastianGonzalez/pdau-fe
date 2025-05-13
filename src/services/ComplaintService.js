import axios from "../api/axios";

const ComplaintService = {
  // Obtener todas las denuncias
  getAllComplaints: async () => {
    try {
      const response = await axios.get("/denuncias/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener las denuncias:", error);
      throw error;
    }
  },

  // Obtener una denuncia por ID
  getComplaintById: async (id) => {
    try {
      const response = await axios.get(`/denuncias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener una denuncia por token
  getComplaintByToken: async (token) => {
    try {
      const response = await axios.get(`/denuncias/token/${token}`);
      console.log("Respuesta de la API:", response.data); // Depuración 
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la denuncia con el token ${token}:`, error);
      throw error;
    }
  },

  // Crear una nueva denuncia
  createComplaint: async (complaintData) => {
    try {
      const response = await axios.post("/denuncias", complaintData);
      return response.data;
    } catch (error) {
      console.error("Error al crear la denuncia:", error);
      throw error;
    }
  },

  // Actualizar una denuncia existente
  updateComplaint: async (id, complaintData) => {
    try {
      const response = await axios.put(`/denuncias/${id}`, complaintData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una denuncia por ID
  deleteComplaint: async (id) => {
    try {
      await axios.delete(`/denuncias/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener denuncias por categoría
  getComplaintsByCategory: async (categoryId) => {
    try {
      const response = await axios.get(`/denuncias/categorias/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener denuncias de la categoría con ID ${categoryId}:`, error);
      throw error;
    }
  },

  // Obtener todas las categorías
  getAllCategories: async () => {
    try {
      const response = await axios.get("/categorias/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      throw error;
    }
  },

  // Obtener una categoría por ID
  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la categoría con ID ${id}:`, error);
      throw error;
    }
  },
};

export default ComplaintService;