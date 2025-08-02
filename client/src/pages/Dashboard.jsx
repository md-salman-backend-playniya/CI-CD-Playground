import { useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";
import { useDebts } from "../context/DebtContext";
import { useAuth } from "../context/AuthContext";
import FinancialSummary from "../components/dashboard/FinancialSummary";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import DebtSummary from "../components/dashboard/DebtSummary";

const Dashboard = () => {
  const { user } = useAuth();
  const { getTransactions, getStats, transactions, stats } = useTransactions();
  const {
    getDebts,
    getStats: getDebtStats,
    debts,
    stats: debtStats,
  } = useDebts();

  useEffect(() => {
    getTransactions({ limit: 5 });
    getStats();
    getDebts();
    getDebtStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Here's your financial overview</p>
      </div>

      <FinancialSummary stats={stats} debtStats={debtStats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentTransactions transactions={transactions} />
        <DebtSummary debts={debts} />
      </div>
    </div>
  );
};

export default Dashboard;
