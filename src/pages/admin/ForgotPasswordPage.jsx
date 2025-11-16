import React from "react";
import LoginLayout from "../../modules/admin/login/layouts/LoginLayout";
import ForgotPassword from "../../modules/admin/password_reset/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <LoginLayout>
      <ForgotPassword/>
    </LoginLayout>
  );
};

export default ForgotPasswordPage;