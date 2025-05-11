import React from 'react';

const Tag = ({ text }) => {
  return (
    <div
      className="bg-gray-800 text-white text-center font-bold py-2 px-4 rounded-lg"
      style={{
        width: '200px', // Ancho fijo
        wordWrap: 'break-word', // Permitir salto de línea si el texto es largo
        whiteSpace: 'normal', // Asegurar que el texto se envuelva
      }}
    >
      {text}
    </div>
  );
};

export default Tag;