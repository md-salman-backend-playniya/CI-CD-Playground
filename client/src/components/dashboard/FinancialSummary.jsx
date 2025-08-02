import { useMemo } from "react";

const FinancialSummary = ({ stats, debtStats }) => {
  const summary = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let moneyLent = 0;
    let moneyBorrowed = 0;
    let lentSettled = 0;
    let borrowedSettled = 0;

    // Process transaction stats
    if (stats?.stats) {
      stats.stats.forEach((stat) => {
        if (stat._id === "income") {
          income = stat.total;
        } else if (stat._id === "expense") {
          expenses = stat.total;
        }
      });
    }

    // Process debt stats
    if (debtStats) {
      debtStats.forEach((stat) => {
        if (stat._id === "lent") {
          moneyLent = stat.totalAmount;
          lentSettled = stat.totalPaid;
        } else if (stat._id === "borrowed") {
          moneyBorrowed = stat.totalAmount;
          borrowedSettled = stat.totalPaid;
        }
      });
    }

    const netWorth = income - expenses + lentSettled - moneyBorrowed;
    const pendingReceivables = moneyLent - lentSettled;
    const pendingPayables = moneyBorrowed - borrowedSettled;

    return {
      income,
      expenses,
      netWorth,
      moneyLent,
      moneyBorrowed,
      pendingReceivables,
      pendingPayables,
      lentSettled,
      borrowedSettled,
    };
  }, [stats, debtStats]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Income",
      value: summary.income,
      color: "text-success-600",
      bgColor: "bg-success-50",
      icon: "💰",
    },
    {
      title: "Total Expenses",
      value: summary.expenses,
      color: "text-danger-600",
      bgColor: "bg-danger-50",
      icon: "💸",
    },
    {
      title: "Net Balance",
      value: summary.income - summary.expenses,
      color:
        summary.income - summary.expenses >= 0
          ? "text-success-600"
          : "text-danger-600",
      bgColor:
        summary.income - summary.expenses >= 0
          ? "bg-success-50"
          : "bg-danger-50",
      icon: "💳",
    },
    {
      title: "Money Lent",
      value: summary.moneyLent,
      color: "text-warning-600",
      bgColor: "bg-warning-50",
      icon: "🤝",
      subtitle: `Received: ${formatCurrency(summary.lentSettled)}`,
    },
    {
      title: "Money Borrowed",
      value: summary.moneyBorrowed,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
      icon: "📋",
      subtitle: `Paid: ${formatCurrency(summary.borrowedSettled)}`,
    },
    {
      title: "Pending Receivables",
      value: summary.pendingReceivables,
      color: "text-warning-600",
      bgColor: "bg-warning-50",
      icon: "⏳",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <div key={index} className={`card ${card.bgColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.color}`}>
                {formatCurrency(card.value)}
              </p>
              {card.subtitle && (
                <p className="mt-1 text-xs text-gray-500">{card.subtitle}</p>
              )}
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialSummary;
