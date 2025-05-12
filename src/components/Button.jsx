import React from 'react';

const Button = ({ text, className, onClick }) => {
  return (
    <button
      onClick={onClick} 
      className={`min-w-[220px] py-3 px-6 text-center font-bold rounded-lg shadow transition duration-300 transform hover:scale-105 hover:opacity-90 ${className}`}
    >
      {text}
    </button>
  );
};


export default Button;