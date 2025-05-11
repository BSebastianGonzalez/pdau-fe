import React from 'react';

const Tag = ({ text }) => {
  return (
    <div className="bg-gray-800 text-white text-center font-bold py-2 px-4 rounded-lg w-40">
      {text}
    </div>
  );
};

export default Tag;