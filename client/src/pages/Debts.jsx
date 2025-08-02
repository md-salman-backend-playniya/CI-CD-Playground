import { useEffect, useState } from "react";
import { useDebts } from "../context/DebtContext";
import DebtForm from "../components/debts/DebtForm";
import DebtList from "../components/debts/DebtList";

const Debts = () => {
  const { getDebts, debts, isLoading } = useDebts();
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
  });

  useEffect(() => {
    getDebts(filters);
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
      status: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debt Management</h1>
          <p className="text-gray-600">Track money you've lent and borrowed</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add Debt Record
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card bg-warning-50">
          <h3 className="text-warning-800 mb-2 text-lg font-semibold">
            💰 Money Lent
          </h3>
          <p className="text-warning-700">
            Track money you've given to others and mark as settled when repaid.
          </p>
        </div>
        <div className="card bg-primary-50">
          <h3 className="text-primary-800 mb-2 text-lg font-semibold">
            📋 Money Borrowed
          </h3>
          <p className="text-primary-700">
            Track money you owe others and mark as settled when you've paid
            back.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <option value="lent">Money Lent</option>
              <option value="borrowed">Money Borrowed</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="partially_settled">Partially Settled</option>
              <option value="settled">Settled</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={clearFilters} className="btn-secondary text-sm">
            Clear Filters
          </button>
        </div>
      </div>

      <DebtList
        debts={debts}
        isLoading={isLoading}
        onUpdate={() => getDebts(filters)}
      />

      {showForm && (
        <DebtForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            getDebts(filters);
          }}
        />
      )}
    </div>
  );
};

export default Debts;
