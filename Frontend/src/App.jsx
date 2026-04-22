import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { MasterDataProvider } from "./context/MasterDataContext";
import { ServiceRequestProvider } from "./context/ServiceRequestContext";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import RequestorDashboard from "./pages/dashboards/RequestorDashboard";
import HODDashboard from "./pages/dashboards/HODDashboard";
import TechnicianDashboard from "./pages/dashboards/TechnicianDashboard";
import StatusMaster from "./pages/masters/StatusMaster";
import DepartmentMaster from "./pages/masters/DepartmentMaster";
import PersonMaster from "./pages/masters/PersonMaster";
import ServiceTypeMaster from "./pages/masters/ServiceTypeMaster";
import RequestTypeMaster from "./pages/masters/RequestTypeMaster";
import PersonMapping from "./pages/masters/PersonMapping";
import UsersMaster from "./pages/masters/UsersMaster";

// ─── Protected Route ─────────────────────────────────────────────────────────
function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ─── App Shell (layout with sidebar + navbar) ────────────────────────────────
function AppShell({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAuth = location.pathname.startsWith("/auth/");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  if (isAuth || !isAuthenticated) return children;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── All Routes ───────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/login"    element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      <Route path="/dashboard/requestor"  element={<ProtectedRoute><RequestorDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/hod"        element={<ProtectedRoute roles={["ADMIN","HOD"]}><HODDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/technician" element={<ProtectedRoute roles={["ADMIN","HOD","TECHNICIAN"]}><TechnicianDashboard /></ProtectedRoute>} />

      <Route path="/masters/status"       element={<ProtectedRoute roles={["ADMIN","HOD"]}><StatusMaster /></ProtectedRoute>} />
      <Route path="/masters/department"   element={<ProtectedRoute roles={["ADMIN","HOD"]}><DepartmentMaster /></ProtectedRoute>} />
      <Route path="/masters/person"       element={<ProtectedRoute roles={["ADMIN","HOD"]}><PersonMaster /></ProtectedRoute>} />
      <Route path="/masters/service-type" element={<ProtectedRoute roles={["ADMIN","HOD"]}><ServiceTypeMaster /></ProtectedRoute>} />
      <Route path="/masters/request-type" element={<ProtectedRoute roles={["ADMIN","HOD"]}><RequestTypeMaster /></ProtectedRoute>} />
      <Route path="/masters/mapping"      element={<ProtectedRoute roles={["ADMIN","HOD"]}><PersonMapping /></ProtectedRoute>} />
      <Route path="/masters/users"        element={<ProtectedRoute roles={["ADMIN"]}><UsersMaster /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MasterDataProvider>
          <ServiceRequestProvider>
            <BrowserRouter>
              <AppShell>
                <AppRoutes />
              </AppShell>
            </BrowserRouter>
          </ServiceRequestProvider>
        </MasterDataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
