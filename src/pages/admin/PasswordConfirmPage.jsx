import React from "react";
import LoginLayout from "../../modules/admin/login/layouts/LoginLayout";
import ResetPasswordSection from "../../modules/admin/password_reset/ResetPasswordSection";

const PasswordConfirmPage = () => {
  return (
    <LoginLayout>
      <ResetPasswordSection />
    </LoginLayout>
  );
};

export default PasswordConfirmPage;
