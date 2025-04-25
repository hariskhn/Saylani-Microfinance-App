import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { useUserStore } from "./stores/useUserStore";
import DashboardPage from "./pages/DashboardPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { useEffect } from "react";
import AdminDashboard from "./pages/AdminDashboardPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast"

const App = () => {
  const { user } = useUserStore();

  useEffect(()=>{},[user]);

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={ <HomePage /> } />
        <Route path="/login" element={ <LoginPage /> } />
        <Route path="/change-password" element={ <ChangePasswordPage /> } />
        <Route path="/dashboard" element={ !user ? <Navigate to="/login" /> : user?.isPasswordChanged ? <DashboardPage />  : <Navigate to="/change-password" /> } />
        <Route path="/admin-dashboard" element={ user?.role === "admin" ? <AdminDashboard /> : <Navigate to={"/login"} /> } />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App