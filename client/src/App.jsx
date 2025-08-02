import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import { DebtProvider } from "./context/DebtContext";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Debts from "./pages/Debts";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <>
      <AuthProvider>
        <TransactionProvider>
          <DebtProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <div className="flex">
                          <Sidebar />
                          <div className="flex flex-1 flex-col">
                            <Header />
                            <main className="flex-1 p-6">
                              <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route
                                  path="/transactions"
                                  element={<Transactions />}
                                />
                                <Route path="/debts" element={<Debts />} />
                                <Route
                                  path="/analytics"
                                  element={<Analytics />}
                                />
                              </Routes>
                            </main>
                          </div>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </Router>
          </DebtProvider>
        </TransactionProvider>
      </AuthProvider>
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
