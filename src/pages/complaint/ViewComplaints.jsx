import React from "react";
import MainLayout from "../../modules/admin/layouts/MainLayout";
import ComplaintsList from "../../modules/admin/components/ComplaintsList";

const ComplaintCheckout = () => {
  return (
    <MainLayout>
      <ComplaintsList />
    </MainLayout>
  );
};

export default ComplaintCheckout;
