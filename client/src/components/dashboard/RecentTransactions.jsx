import { Link } from "react-router-dom";
import moment from "moment";

const RecentTransactions = ({ transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTypeColor = (type) => {
    return type === "income" ? "text-success-600" : "text-danger-600";
  };

  const getTypeIcon = (type) => {
    return type === "income" ? "↗️" : "↘️";
  };

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h2>
        <Link
          to="/transactions"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View All
        </Link>
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <div className="flex items-center space-x-3">
                <div className="text-xl">{getTypeIcon(transaction.type)}</div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.category}
                  </p>
                  <p className="text-xs text-gray-400">
                    {moment(transaction.date).format("MMM DD, YYYY")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${getTypeColor(transaction.type)}`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">No transactions yet</p>
          <Link to="/transactions" className="btn-primary mt-4 inline-block">
            Add Transaction
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
