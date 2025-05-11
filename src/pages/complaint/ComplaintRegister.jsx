import React from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import Button from "../../components/button";
import { Link } from "react-router-dom";

const ComplaintRegister = () => {
    return (
        <UserLayout title="Formulario de denuncia anónima">
            <h1 className="text-2xl text-center font-bold mt-10">
                Registro de denuncia anónima
            </h1>
        </UserLayout>
    );
  };
  
  export default ComplaintRegister;