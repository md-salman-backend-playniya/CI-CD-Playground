import { Link } from "react-router-dom";
import moment from "moment";

const DebtSummary = ({ debts }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "settled":
        return "text-success-600 bg-success-50";
      case "partially_settled":
        return "text-warning-600 bg-warning-50";
      default:
        return "text-danger-600 bg-danger-50";
    }
  };

  const getTypeColor = (type) => {
    return type === "lent" ? "text-warning-600" : "text-primary-600";
  };

  const getTypeIcon = (type) => {
    return type === "lent" ? "👤→💰" : "💰→👤";
  };

  const recentDebts = debts?.slice(0, 5) || [];

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Debt Overview</h2>
        <Link
          to="/debts"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Manage All
        </Link>
      </div>

      {recentDebts.length > 0 ? (
        <div className="space-y-4">
          {recentDebts.map((debt) => (
            <div
              key={debt._id}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <div className="flex items-center space-x-3">
                <div className="text-lg">{getTypeIcon(debt.type)}</div>
                <div>
                  <p className="font-medium text-gray-900">{debt.title}</p>
                  <p className="text-sm text-gray-600">{debt.personName}</p>
                  <p className="text-xs text-gray-400">
                    {moment(debt.createdAt).format("MMM DD, YYYY")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getTypeColor(debt.type)}`}>
                  {formatCurrency(debt.amount - debt.amountPaid)}
                </p>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${getStatusColor(debt.status)}`}
                >
                  {debt.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">No debts to track</p>
          <Link to="/debts" className="btn-primary mt-4 inline-block">
            Add Debt Record
          </Link>
        </div>
      )}
    </div>
  );
};

export default DebtSummary;
