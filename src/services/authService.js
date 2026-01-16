import axiosInstance from "./api/axiosConfig";

const authService = {
  // Login
  login: (email, password) => {
    return axiosInstance.post("/api/account/login/", { email, password });
  },

  // Signup
  signup: (fullName, email, password) => {
    return axiosInstance.post("/auth/signup/", {
      full_name: fullName,
      email,
      password,
    });
  },

  // Forgot Password
  forgotPassword: (email) => {
    return axiosInstance.post("/auth/forgot-password/", { email });
  },

  // Reset Password
  resetPassword: (token, password, confirmPassword) => {
    return axiosInstance.post("/auth/reset-password/", {
      token,
      password,
      confirm_password: confirmPassword,
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem("authToken");
    return Promise.resolve();
  },

  // Get current user
  getCurrentUser: () => {
    return axiosInstance.get("/auth/me/");
  },

  // Refresh token
  refreshToken: (refreshToken) => {
    return axiosInstance.post("/auth/refresh/", { refresh: refreshToken });
  },
};

export default authService;
