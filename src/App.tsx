import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivilegeProvider } from "@/hooks/usePrivileges";
import AdminDashboard from "./pages/AdminDashboard";
import ScheduleDashboard from "./pages/ScheduleDashboard";
import HeadshotApproval from "./pages/HeadshotApproval";
import MarkerProjectsDashboard from "./pages/MarkerProjectsDashboard";
import MarkerSchedulesDashboard from "./pages/MarkerSchedulesDashboard";
import MarkerDashboard from "./pages/MarkerDashboard";
import MarkerEvaluation from "./pages/MarkerEvaluation";
import RoleManagement from "./pages/RoleManagement";
import FormsDashboard from "./pages/FormsDashboard";
import CreateForm from "./pages/CreateForm";
import ConfigurationsList from "./pages/ConfigurationsList";
import CreateConfiguration from "./pages/CreateConfiguration";
import ReportsDashboard from "./pages/ReportsDashboard";
import SurveyList from "./pages/SurveyList";
import CreateSurvey from "./pages/CreateSurvey";
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
                <MarkerProjectsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marker/projects/:projectId/schedules"
            element={
              <ProtectedRoute allowedRoles={["marker"]}>
                <MarkerSchedulesDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marker/projects/:projectId/schedules/:scheduleId/candidates"
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
          <Route
            path="/forms"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FormsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms/configurations"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ConfigurationsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms/configurations/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateConfiguration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:productId/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ReportsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveys"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <SurveyList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveys/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateSurvey />
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
