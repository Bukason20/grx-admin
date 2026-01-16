import React, { useState } from "react";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import authService from "../../services/authService";

export default function ForgotPasswordPage({ setAuthPage }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = () => {
    if (!email) {
      return { email: "Email is required" };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { email: "Please enter a valid email" };
    }
    return {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateEmail();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Call API service
        await authService.forgotPassword(email);

        setSuccessMessage("Password reset link sent to your email!");
        setTimeout(() => {
          setAuthPage("reset");
        }, 2000);
      } catch (error) {
        setErrors({
          submit:
            error.response?.data?.detail ||
            "Failed to send reset link. Please try again.",
        });
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-purple-100 rounded-full p-3 mb-4">
            <Mail size={32} className="text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email to receive reset link
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-green-700 text-sm">{successMessage}</span>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-700 text-sm">{errors.submit}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({});
                }}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.email && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                {errors.email}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setAuthPage("login")}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
