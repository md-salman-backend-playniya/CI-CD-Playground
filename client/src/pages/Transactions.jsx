import { useEffect, useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

const Transactions = () => {
  const { getTransactions, transactions, isLoading, pagination } =
    useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    getTransactions(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      category: "",
      startDate: "",
      endDate: "",
    });
  };

  const handlePageChange = (page) => {
    getTransactions({ ...filters, page });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Track your income and expenses</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              placeholder="Enter category"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={clearFilters} className="btn-secondary text-sm">
            Clear Filters
          </button>
        </div>
      </div>

      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            getTransactions(filters);
          }}
        />
      )}
    </div>
  );
};

export default Transactions;
