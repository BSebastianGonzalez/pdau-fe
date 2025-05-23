import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-[#DB4747] p-4 flex items-center justify-between fixed top-0 left-0 w-full z-50 shadow-md">
      <Link to="/">
      <div className="flex items-center gap-3 flex-col md:flex-row text-white">
        <img 
          src="img/ufps.png" 
          alt="UFPS Logo" 
          className="h-12 md:h-16" 
        />
        <p className="text-base md:text-lg font-bold">
          Plataforma de denuncias anónimas para la comunidad universitaria
        </p>
      </div>
      </Link>
    </header>
  );
};

export default Header;