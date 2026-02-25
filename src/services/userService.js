import axiosInstance from "./api/axiosConfig";

const userService = {
  // Get all users
  getAllUsers: () => {
    return axiosInstance.get("/admin/users/");
  },

  // Get a specific user by ID
  getUserById: (id) => {
    return axiosInstance.get(`/admin/users/${id}/`);
  },
};

export default userService;
