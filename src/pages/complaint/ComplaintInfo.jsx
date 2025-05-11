import React from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import Button from "../../components/button";
import ComplaintSection from "../../modules/user/components/ComplaintSection";

const ComplaintInfo = () => {

  return (
    <UserLayout title="Registro de denuncia anonima">
    <ComplaintSection />
    </UserLayout>
  );
};

export default ComplaintInfo;