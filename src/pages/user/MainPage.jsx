import React from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import HomeButton from "../../modules/user/components/HomeButton";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <UserLayout title="Client Home">
      <div className="main-content px-4 py-8">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Plataforma de denuncias anónimas
        </h1>
        <p className="text-center mb-8">
          En el entorno universitario, es fundamental contar con un espacio
          seguro donde la comunidad pueda reportar de manera confidencial
          situaciones como acoso, fraude o corrupción. Para garantizar la
          seguridad y el bienestar de todos, esta plataforma permite realizar
          denuncias anónimas de forma sencilla y ofrece un sistema de
          seguimiento seguro, asegurando que cada caso sea tratado con
          responsabilidad y transparencia.
        </p>
        <div className="flex flex-wrap justify-center gap-10 mt-12">
          <div className="w-100 text-center"> {/* Contenedor con ancho fijo */}
            <Link to="/complaint">
            <HomeButton
              text="Registrar Denuncia Anónima"
              imageSrc="img/complaint_register.png"
              onClick={() => console.log("Registrar Denuncia Anónima")}
            />
            </Link>
            <p className="text-base font-bold text-black mt-2">
              Envía una denuncia de forma anónima, selecciona una categoría y adjunta evidencia opcional.
            </p>
          </div>
          <div className="w-100 text-center"> {/* Contenedor con ancho fijo */}
            <Link to="/consult">
            <HomeButton
              text="Consultar Estado De Denuncia Anónima"
              imageSrc="img/status_consult.png"
              onClick={() => console.log("Consultar Estado De Denuncia Anónima")}
            />
            </Link>
            <p className="text-base font-bold text-black mt-2">
              Usa tu token de seguimiento para conocer el estado y próximos pasos de tu denuncia.
            </p>
          </div>
          <div className="w-100 text-center"> {/* Contenedor con ancho fijo */}
            <HomeButton
              text="Consultar Marco Legal"
              imageSrc="img/law_consult.png"
              onClick={() => console.log("Consultar Marco Legal")}
            />
            <p className="text-base font-bold text-black mt-2">
              Accede a la normativa vigente, busca información por palabras clave o descarga el documento completo.
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default MainPage;