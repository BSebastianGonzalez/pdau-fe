import axios from "../api/axios";

const AdminService = {
  // Iniciar sesión
  login: async (correo, contrasenia) => {
    try {
      const response = await axios.post("/login", { correo, contrasenia });
      return response.data;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  },
};

export default AdminService;