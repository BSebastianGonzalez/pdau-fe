import React, { useState } from 'react';

const TextField = ({ 
  placeholder, 
  width = "w-full", 
  height = "h-12", 
  required = false, 
  validate = null, 
  value,                // <-- Aceptar value como prop
  onChange              // <-- Aceptar onChange como prop
}) => {
  const [error, setError] = useState("");

  const handleBlur = () => {
    if (required && !value.trim()) {
      setError("Este campo es obligatorio.");
    } else if (validate && !validate(value)) {
      setError("El texto ingresado no es válido.");
    } else {
      setError("");
    }
  };

  return (
    <div className="w-full">
      <textarea
        placeholder={placeholder}
        value={value}                 // <-- Usar valor del padre
        onChange={onChange}          // <-- Llamar a onChange del padre
        onBlur={handleBlur}
        className={`${width} ${height} p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md resize-none overflow-auto focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};


export default TextField;