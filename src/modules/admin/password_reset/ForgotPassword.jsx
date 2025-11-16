import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import AdminService from "../../../services/AdminService";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSendLink = async () => {
		if (!email) {
			setError("Por favor ingresa un correo electrónico.");
			setMessage("");
			return;
		}

		try {
			setLoading(true);
			setError("");
			setMessage("");
			const resp = await AdminService.forgotPassword(email);
			// Backend devuelve mensaje en resp o sólo OK
			setMessage(resp?.message || "Se ha enviado un enlace de recuperación al correo.");
		} catch (err) {
			const serverMsg = err?.response?.data || err.message || "Error al solicitar el enlace.";
			setError(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
			<h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2">Reestablecer contraseña</h2>
			<p className="text-center text-sm text-gray-600 mb-6">Ingresa el correo asociado a tu cuenta.</p>

			<label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
			<div className="flex items-center border border-gray-200 rounded-lg p-2 mb-6">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4-4 4m8 0l-4 4-4-4" />
				</svg>
				<input
					type="email"
					placeholder="tu@correo.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="ml-3 w-full bg-transparent outline-none px-2 py-2"
				/>
			</div>

				<div className="flex justify-center">
					<Button
						text={loading ? "Enviando..." : "Enviar enlace"}
						className="bg-red-600 text-white"
						onClick={handleSendLink}
					/>
				</div>

				{message && <p className="text-green-600 text-center mt-3">{message}</p>}
				{error && <p className="text-red-500 text-center mt-3">{error}</p>}

				<div className="text-center mt-4">
					<button
						type="button"
						className="text-sm text-red-600 hover:underline"
						onClick={() => navigate("/admin_login")}
					>
						Volver al inicio de sesión
					</button>
				</div>
		</div>
	);
};

export default ForgotPassword;
