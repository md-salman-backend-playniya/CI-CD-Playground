import api from "./api";

// Get transactions
const getTransactions = async (params) => {
  const response = await api.get("/transactions", { params });
  return response.data;
};

// Create transaction
const createTransaction = async (transactionData) => {
  const response = await api.post("/transactions", transactionData);
  return response.data;
};

// Update transaction
const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, transactionData);
  return response.data;
};

// Delete transaction
const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

// Get stats
const getStats = async () => {
  const response = await api.get("/transactions/stats");
  return response.data;
};

const transactionService = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStats,
};

export default transactionService;
