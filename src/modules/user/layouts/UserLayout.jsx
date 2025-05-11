import React from "react";
import Header from "../components/header";

const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header fijo en la parte superior */}
      <Header />
      {/* Contenido principal con margen superior dinámico */}
      <main className="flex-1 w-full bg-white pt-16 md:pt-20">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;