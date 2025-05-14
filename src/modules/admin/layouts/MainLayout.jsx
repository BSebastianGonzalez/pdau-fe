import Sidebar from "../components/sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen">
      {/* Barra lateral */}
      <div className="w-60 flex-shrink-0">
        <Sidebar />
      </div>
      {/* Contenido principal */}
      <div className="flex-grow h-full bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;