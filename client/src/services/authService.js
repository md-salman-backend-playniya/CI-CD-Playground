import api from "./api";

// Register user
const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
