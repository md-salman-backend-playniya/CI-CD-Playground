import { createContext, useContext, useReducer } from "react";
import transactionService from "../services/transactionService";

const TransactionContext = createContext();

const initialState = {
  transactions: [],
  stats: null,
  isLoading: false,
  isError: false,
  message: "",
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
  },
};

const transactionReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "GET_TRANSACTIONS":
      return {
        ...state,
        isLoading: false,
        transactions: action.payload.transactions,
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        },
      };
    case "CREATE_TRANSACTION":
      return {
        ...state,
        isLoading: false,
        transactions: [action.payload, ...state.transactions],
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        isLoading: false,
        transactions: state.transactions.map((transaction) =>
          transaction._id === action.payload._id ? action.payload : transaction,
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        isLoading: false,
        transactions: state.transactions.filter(
          (transaction) => transaction._id !== action.payload.id,
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

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Get transactions
  const getTransactions = async (params = {}) => {
    try {
      dispatch({ type: "LOADING" });
      const data = await transactionService.getTransactions(params);
      dispatch({ type: "GET_TRANSACTIONS", payload: data });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Create transaction
  const createTransaction = async (transactionData) => {
    try {
      dispatch({ type: "LOADING" });
      const transaction =
        await transactionService.createTransaction(transactionData);
      dispatch({ type: "CREATE_TRANSACTION", payload: transaction });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      dispatch({ type: "LOADING" });
      const transaction = await transactionService.updateTransaction(
        id,
        transactionData,
      );
      dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      dispatch({ type: "LOADING" });
      await transactionService.deleteTransaction(id);
      dispatch({ type: "DELETE_TRANSACTION", payload: { id } });
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
      const stats = await transactionService.getStats();
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
    <TransactionContext.Provider
      value={{
        ...state,
        getTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        getStats,
        reset,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider",
    );
  }
  return context;
};

export default TransactionContext;
