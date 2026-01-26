"use client";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DeviceLimitExceeded from "./deviceLimitExceeded/page";
import Login from "./login/page";
import Signup from "./signup/page";
import Calculator from "./calculator/page";
import Pricing from "./pricing/page";
import DeviceManagement from "./deviceManagement/page";
import AddDevices from "./addDevice/page";
import Landing from "./landing/page";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("landing");
  const { user, loading, deviceLimitReached } = useAuth();

  useEffect(() => {
    if (!loading && user && currentPage === "landing") {
      setCurrentPage("calculator");
    }
  }, [user, loading, currentPage]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (deviceLimitReached && currentPage === "calculator") {
    return <DeviceLimitExceeded onNavigate={handleNavigate} />;
  }

  if (currentPage === "login") {
    return <Login onNavigate={handleNavigate} />;
  }

  if (currentPage === "signup") {
    return <Signup onNavigate={handleNavigate} />;
  }

  if (currentPage === "calculator") {
    if (!user) {
      return <Login onNavigate={handleNavigate} />;
    }
    return <Calculator onNavigate={handleNavigate} />;
  }

  if (currentPage === "pricing") {
    return <Pricing onNavigate={handleNavigate} />;
  }

  if (currentPage === "device-management") {
    if (!user) {
      return <Login onNavigate={handleNavigate} />;
    }
    return <DeviceManagement onNavigate={handleNavigate} />;
  }

  if (currentPage === "add-devices") {
    if (!user) {
      return <Login onNavigate={handleNavigate} />;
    }
    return <AddDevices onNavigate={handleNavigate} />;
  }

  return <Landing onNavigate={handleNavigate} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
