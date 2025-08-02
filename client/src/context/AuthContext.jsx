import { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        isLoading: false,
        isError: true,
        message: action.payload,
        user: null,
        token: null,
      };
    case "AUTH_RESET":
      return {
        ...state,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("token");
    }
  }, [state.token]);

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: "AUTH_LOADING" });
      const data = await authService.register(userData);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: data,
          token: data.token,
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      dispatch({
        type: "AUTH_ERROR",
        payload: message,
      });
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      dispatch({ type: "AUTH_LOADING" });
      const data = await authService.login(userData);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: data,
          token: data.token,
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      dispatch({
        type: "AUTH_ERROR",
        payload: message,
      });
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    dispatch({ type: "LOGOUT" });
  };

  // Reset auth state
  const reset = () => {
    dispatch({ type: "AUTH_RESET" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
