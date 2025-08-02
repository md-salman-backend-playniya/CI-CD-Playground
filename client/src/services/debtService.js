import api from "./api";

// Get debts
const getDebts = async (params) => {
  const response = await api.get("/debts", { params });
  return response.data;
};

// Create debt
const createDebt = async (debtData) => {
  const response = await api.post("/debts", debtData);
  return response.data;
};

// Update debt
const updateDebt = async (id, debtData) => {
  const response = await api.put(`/debts/${id}`, debtData);
  return response.data;
};

// Delete debt
const deleteDebt = async (id) => {
  const response = await api.delete(`/debts/${id}`);
  return response.data;
};

// Add settlement
const addSettlement = async (id, settlementData) => {
  const response = await api.post(`/debts/${id}/settle`, settlementData);
  return response.data;
};

// Get stats
const getStats = async () => {
  const response = await api.get("/debts/stats");
  return response.data;
};

const debtService = {
  getDebts,
  createDebt,
  updateDebt,
  deleteDebt,
  addSettlement,
  getStats,
};

export default debtService;
