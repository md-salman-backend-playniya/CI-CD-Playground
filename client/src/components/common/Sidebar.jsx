import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    {
      path: "/",
      name: "Dashboard",
      icon: "📊",
    },
    {
      path: "/transactions",
      name: "Transactions",
      icon: "💰",
    },
    {
      path: "/debts",
      name: "Debts & Lending",
      icon: "🤝",
    },
    {
      path: "/analytics",
      name: "Analytics",
      icon: "📈",
    },
  ];

  return (
    <aside className="min-h-screen w-64 border-r border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        <div className="mb-8 flex items-center space-x-2">
          <div className="bg-primary-500 flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white">
            ET
          </div>
          <span className="text-xl font-bold text-gray-900">
            ExpenseTracker
          </span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors duration-200 ${
                  isActive
                    ? "bg-primary-50 text-primary-700 border-primary-500 border-r-2"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
