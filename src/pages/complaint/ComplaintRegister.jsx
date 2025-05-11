import React from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import Button from "../../components/button";
import { Link } from "react-router-dom";
import RegisterSection from "../../modules/user/complaint/RegisterSection";

const ComplaintRegister = () => {
    return (
        <UserLayout title="Formulario de denuncia anónima">
        <RegisterSection />
        </UserLayout>
    );
  };
  
  export default ComplaintRegister;