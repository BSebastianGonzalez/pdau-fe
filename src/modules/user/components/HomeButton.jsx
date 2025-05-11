import React from 'react';

const HomeButton = ({ text = "Registrar Denuncia Anónima", imageSrc = "img/default-icon.png", onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-5 bg-gray-200 border border-black rounded-lg shadow-md w-100 h-30 hover:bg-gray-300 transform transition-transform duration-300 hover:scale-105"
    >
      <span className="text-base mb-2">{text}</span>
      <img
        src={imageSrc}
        alt="Button Icon"
        className="max-w-15 max-h-15 object-contain"
      />
    </button>
  );
};

export default HomeButton;