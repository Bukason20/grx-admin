import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import ResetPasswordPage from "./ResetPasswordPage";

export default function AuthApp({ setIsAuthenticated }) {
  const [authPage, setAuthPage] = useState("login");

  const handleLoginSuccess = () => {
    // Set authenticated state in parent (Routy)
    setIsAuthenticated(true);
    // Token is already saved in localStorage by LoginPage
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
      {authPage === "login" && (
        <LoginPage
          setAuthPage={setAuthPage}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {authPage === "signup" && <SignupPage setAuthPage={setAuthPage} />}
      {authPage === "forgot" && (
        <ForgotPasswordPage setAuthPage={setAuthPage} />
      )}
      {authPage === "reset" && <ResetPasswordPage setAuthPage={setAuthPage} />}
    </div>
  );
}
