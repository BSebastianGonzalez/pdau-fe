import React from "react";
import Button from "../../../components/Button";

const ComplaintMainInfo = ({
  complaint,
  departamentos,
  selectedDepartamento,
  assigningDept,
  onDepartamentoChange,
  onRemitir,
}) => (
  <div className="flex-1">
    <h1 className="text-5xl font-bold mb-8 text-center">
      Revision de denuncia anonima
    </h1>
    <div className="flex flex-col gap-6">
      {/* Título */}
      <div className="flex items-center gap-4">
        <span className="bg-black text-white px-6 py-3 rounded font-bold text-lg min-w-[160px] text-center">
          Título
        </span>
        <input
          type="text"
          value={complaint.titulo}
          readOnly
          className="flex-1 border px-3 py-2 rounded"
        />
      </div>
      {/* Descripción */}
      <div className="flex items-center gap-4">
        <span className="bg-black text-white px-5 py-3 rounded font-bold text-lg min-w-[160px] text-center">
          Descripción
        </span>
        <textarea
          value={complaint.descripcion}
          readOnly
          className="flex-1 border px-3 py-2 rounded h-32 resize-none"
        />
      </div>
      {/* Departamento actual */}
      {complaint.departamento && (
        <div className="flex items-center gap-4">
          <span className="bg-black text-white px-5 py-3 rounded font-bold text-lg min-w-[160px] text-center">
            Departamento actual
          </span>
          <input
            type="text"
            value={complaint.departamento.nombre}
            readOnly
            className="flex-1 border px-3 py-2 rounded bg-gray-100"
          />
        </div>
      )}
      {/* Remitir a departamento */}
      <form onSubmit={onRemitir} className="flex items-center gap-4">
        <span className="bg-black text-white px-5 py-3 rounded font-bold text-lg min-w-[160px] text-center">
          Remitir a departamento
        </span>
        <select
          className="flex-1 border px-3 py-2 rounded"
          value={selectedDepartamento}
          onChange={(e) => onDepartamentoChange(e.target.value)}
          required
          disabled={assigningDept}
        >
          <option value="">Selecciona un departamento...</option>
          {departamentos.map((dep) => (
            <option key={dep.id} value={dep.id}>
              {dep.nombre}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          text={assigningDept ? "Remitiendo..." : "Remitir"}
          className="bg-blue-600 hover:bg-blue-800 text-white"
          disabled={assigningDept}
        />
      </form>
    </div>
  </div>
);

export default ComplaintMainInfo;