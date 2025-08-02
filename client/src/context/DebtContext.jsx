import { createContext, useContext, useReducer } from "react";
import debtService from "../services/debtService";

const DebtContext = createContext();

const initialState = {
  debts: [],
  stats: null,
  isLoading: false,
  isError: false,
  message: "",
};

const debtReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "GET_DEBTS":
      return {
        ...state,
        isLoading: false,
        debts: action.payload,
      };
    case "CREATE_DEBT":
      return {
        ...state,
        isLoading: false,
        debts: [action.payload, ...state.debts],
      };
    case "UPDATE_DEBT":
      return {
        ...state,
        isLoading: false,
        debts: state.debts.map((debt) =>
          debt._id === action.payload._id ? action.payload : debt,
        ),
      };
    case "DELETE_DEBT":
      return {
        ...state,
        isLoading: false,
        debts: state.debts.filter((debt) => debt._id !== action.payload.id),
      };
    case "ADD_SETTLEMENT":
      return {
        ...state,
        isLoading: false,
        debts: state.debts.map((debt) =>
          debt._id === action.payload._id ? action.payload : debt,
        ),
      };
    case "GET_STATS":
      return {
        ...state,
        isLoading: false,
        stats: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        isLoading: false,
        isError: true,
        message: action.payload,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const DebtProvider = ({ children }) => {
  const [state, dispatch] = useReducer(debtReducer, initialState);

  // Get debts
  const getDebts = async (params = {}) => {
    try {
      dispatch({ type: "LOADING" });
      const debts = await debtService.getDebts(params);
      dispatch({ type: "GET_DEBTS", payload: debts });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Create debt
  const createDebt = async (debtData) => {
    try {
      dispatch({ type: "LOADING" });
      const debt = await debtService.createDebt(debtData);
      dispatch({ type: "CREATE_DEBT", payload: debt });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Update debt
  const updateDebt = async (id, debtData) => {
    try {
      dispatch({ type: "LOADING" });
      const debt = await debtService.updateDebt(id, debtData);
      dispatch({ type: "UPDATE_DEBT", payload: debt });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Delete debt
  const deleteDebt = async (id) => {
    try {
      dispatch({ type: "LOADING" });
      await debtService.deleteDebt(id);
      dispatch({ type: "DELETE_DEBT", payload: { id } });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Add settlement
  const addSettlement = async (id, settlementData) => {
    try {
      dispatch({ type: "LOADING" });
      const debt = await debtService.addSettlement(id, settlementData);
      dispatch({ type: "ADD_SETTLEMENT", payload: debt });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Get stats
  const getStats = async () => {
    try {
      dispatch({ type: "LOADING" });
      const stats = await debtService.getStats();
      dispatch({ type: "GET_STATS", payload: stats });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Reset
  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <DebtContext.Provider
      value={{
        ...state,
        getDebts,
        createDebt,
        updateDebt,
        deleteDebt,
        addSettlement,
        getStats,
        reset,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => {
  const context = useContext(DebtContext);
  if (!context) {
    throw new Error("useDebts must be used within a DebtProvider");
  }
  return context;
};

export default DebtContext;
