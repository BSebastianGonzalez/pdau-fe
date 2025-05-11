import React from 'react';

const Button = ({ text, className }) => {
  return (
    <button
      className={`min-w-[220px] py-3 px-6 text-center font-bold rounded-full shadow transition duration-300 ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
