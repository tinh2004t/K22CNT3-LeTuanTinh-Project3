// src/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Residents from "./pages/Residents";
import Apartments from "./pages/Apartments";
import Services from "./pages/Services";
import AddServiceFeePage from "./pages/AddServiceFeePage.jsx";
import NotificationPage from "./pages/NotificationPage"; // Thêm import

import InvoicePaymentManagement from "./pages/InvoicePayment";
import UserInvoiceChecker from "./pages/UserInvoiceChecker";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute, RedirectIfLoggedIn } from "./routes/ProtectedRoute";

function App() {
  const userRole = localStorage.getItem("role"); // "USER" hoặc "ADMIN"

  return (
    <AuthProvider>
        <div className="pt-16">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            {userRole === "ADMIN" && (
              <Route path="/residents" element={<Residents />} />
            )}
            <Route path="/apartments" element={<Apartments />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/add-service-fees" element={<AddServiceFeePage />} />

            {/* Dynamically show the right invoice component based on user role */}
            <Route path="/invoices" element={
              userRole === "ADMIN"
                ? <InvoicePaymentManagement />
                : <UserInvoiceChecker />
            } />

            {/* Thêm route cho trang thông báo */}
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            } />
            
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/login" element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
    </AuthProvider>
  );
}

export default App;