import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivilegeProvider } from "@/hooks/usePrivileges";
import AdminDashboard from "./pages/AdminDashboard";
import ScheduleDashboard from "./pages/ScheduleDashboard";
import HeadshotApproval from "./pages/HeadshotApproval";
import MarkerDashboard from "./pages/MarkerDashboard";
import MarkerEvaluation from "./pages/MarkerEvaluation";
import RoleManagement from "./pages/RoleManagement";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PrivilegeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <RoleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scheduling"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ScheduleDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals/:scheduleId"
            element={
              <ProtectedRoute allowedRoles={["admin", "proctor"]}>
                <HeadshotApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marker"
            element={
              <ProtectedRoute allowedRoles={["marker"]}>
                <MarkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marker/evaluate/:candidateId"
            element={
              <ProtectedRoute allowedRoles={["marker"]}>
                <MarkerEvaluation />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </PrivilegeProvider>
  </QueryClientProvider>
);

export default App;
