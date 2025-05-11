import React from "react";
import Header from "../components/header";

const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header fijo en la parte superior */}
      <Header />
      {/* Contenido principal con fondo blanco */}
      <main style={{ flex: 1, backgroundColor: 'white', paddingTop: '70px' }}>
        {children}
      </main>
    </div>
  );
};

export default UserLayout;