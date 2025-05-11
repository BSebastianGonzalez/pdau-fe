import React from 'react';

const Header = () => {
  return (
    <header className="bg-[#DB4747] bg#DB4747 p-4 flex items-center fixed top-0 left-0 w-full z-50">
      <div className="flex flex-col items-center">
        <img 
          src="img/ufps.png" 
          alt="UFPS Logo" 
          className="h-16 mb-1" 
        />
      </div>
    </header>
  );
};

export default Header;