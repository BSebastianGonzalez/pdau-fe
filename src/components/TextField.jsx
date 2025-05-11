import React from 'react';

const TextField = ({ placeholder }) => {
  return (
    <textarea
      placeholder={placeholder}
      className="w-full h-12 p-2 border border-gray-300 rounded-md resize-none overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default TextField;