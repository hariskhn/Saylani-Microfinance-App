import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/LoginPage";
import { useUserStore } from "./stores/useUserStore";
import DashboardPage from "./pages/DashboardPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { useEffect } from "react";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const { user } = useUserStore();

  useEffect(()=>{},[user]);

  return (
    <div className="min-h-screen overflow-hidden">
      <Routes>
        <Route path="/" element={ <HomePage /> } />
        <Route path="/login" element={ <LoginPage /> } />
        <Route path="/change-password" element={ <ChangePasswordPage /> } />
        <Route path="/dashboard" element={ !user ? <Navigate to="/login" /> : user?.isPasswordChanged ? <DashboardPage />  : <Navigate to="/change-password" /> } />
        <Route path="/admin-dashboard" element={ user?.role === "admin" ? <AdminDashboard /> : <Navigate to={"/login"} /> } />
      </Routes>
    </div>
  )
}

export default App