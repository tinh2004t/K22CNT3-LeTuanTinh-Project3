import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Residents from "./pages/Residents";
import Apartments from "./pages/Apartments";
import Services from "./pages/Services";
import NotificationPage from "./pages/NotificationPage";
import InvoicePaymentManagement from "./pages/InvoicePayment";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [notifications, setNotifications] = useState([]); // ✅ Quản lý thông báo

  return (
    <AuthProvider>
      <div className="pt-16">
        {/* ✅ Truyền setNotifications vào Navbar */}
        <Navbar setNotifications={setNotifications} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/apartments" element={<Apartments />} />
          <Route path="/services" element={<Services />} />
          <Route path="/invoices" element={<InvoicePaymentManagement />} />

          {/* ✅ Truyền notifications & setNotifications vào NotificationPage */}
          <Route path="/notifications" element={<NotificationPage notifications={notifications} setNotifications={setNotifications} />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
