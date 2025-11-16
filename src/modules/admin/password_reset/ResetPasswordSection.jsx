import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import AdminService from "../../../services/AdminService";

const ResetPasswordSection = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Token no proporcionado en la URL.");
    }
  }, [token]);

  const validate = () => {
    if (!newPassword || !confirmPassword) {
      setError("Por favor completa ambos campos de contraseña.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    setError("");
    return true;
  };

  const handleReset = async () => {
    if (!validate()) return;
    if (!token) {
      setError("Token inválido o expirado.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      await AdminService.resetPassword(token, newPassword);
      setMessage("La contraseña ha sido cambiada correctamente.");
      setTimeout(() => navigate("/admin_login"), 1800);
    } catch (err) {
      const serverMsg = err?.response?.data || err.message || "Error al cambiar la contraseña.";
      setError(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2">Confirmar nueva contraseña</h2>
      <p className="text-center text-sm text-gray-600 mb-6">Ingresa y confirma tu nueva contraseña.</p>

      <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
      <div className="flex items-center border border-gray-200 rounded-lg p-2 mb-4">
        <input
          type={showNew ? "text" : "password"}
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="ml-2 w-full bg-transparent outline-none px-2 py-2"
        />
        <button
          type="button"
          className="ml-2 text-sm text-gray-600"
          onClick={() => setShowNew((s) => !s)}
        >
          {showNew ? "Ocultar" : "Ver"}
        </button>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
      <div className="flex items-center border border-gray-200 rounded-lg p-2 mb-4">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Repite la contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="ml-2 w-full bg-transparent outline-none px-2 py-2"
        />
        <button
          type="button"
          className="ml-2 text-sm text-gray-600"
          onClick={() => setShowConfirm((s) => !s)}
        >
          {showConfirm ? "Ocultar" : "Ver"}
        </button>
      </div>

      <div className="flex justify-center">
        <Button
          text={loading ? "Procesando..." : "Confirmar contraseña"}
          className="bg-red-600 text-white"
          onClick={handleReset}
        />
      </div>

      {message && <p className="text-green-600 text-center mt-3">{message}</p>}
      {error && <p className="text-red-500 text-center mt-3">{error}</p>}
    </div>
  );
};

export default ResetPasswordSection;
