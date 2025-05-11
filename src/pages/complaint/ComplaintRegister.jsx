import React from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import RegisterSection from "../../modules/user/complaint/components/RegisterSection";
const ComplaintRegister = () => {
    return (
        <UserLayout title="Formulario de denuncia anónima">
        <RegisterSection />
        </UserLayout>
    );
  };
  
  export default ComplaintRegister;