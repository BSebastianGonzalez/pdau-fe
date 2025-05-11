import React from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import Button from "../../modules/user/components/Button";

const MainPage = () => {
  return (
    <UserLayout title="Client Home">
      <div className="main-content">
        <h1>Plataforma de denuncias anónimas</h1>
        <p>
          En el entorno universitario, es fundamental contar con un espacio
          seguro donde la comunidad pueda reportar de manera confidencial
          situaciones como acoso, fraude o corrupción. Para garantizar la
          seguridad y el bienestar de todos, esta plataforma permite realizar
          denuncias anónimas de forma sencilla y ofrece un sistema de
          seguimiento seguro, asegurando que cada caso sea tratado con
          responsabilidad y transparencia.
        </p>
        <div className="flex justify-center gap-15 mt-15">
          <Button
            text="Registrar Denuncia Anónima"
            imageSrc="img/complaint_register.png"
            onClick={() => console.log("Registrar Denuncia Anónima")}
          />
          <Button
            text="Consultar Estado De Denuncia Anónima"
            imageSrc="img/status_consult.png"
            onClick={() => console.log("Consultar Estado De Denuncia Anónima")}
          />
          <Button
            text="Consultar Marco Legal"
            imageSrc="img/law_consult.png"
            onClick={() => console.log("Consultar Marco Legal")}
          />
        </div>
      </div>
    </UserLayout>
  );
};

export default MainPage;