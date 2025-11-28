import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ScheduleDashboard from "./pages/ScheduleDashboard";
import HeadshotApproval from "./pages/HeadshotApproval";
import MarkerDashboard from "./pages/MarkerDashboard";
import MarkerEvaluation from "./pages/MarkerEvaluation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/scheduling" element={<ScheduleDashboard />} />
          <Route path="/approvals/:scheduleId" element={<HeadshotApproval />} />
          <Route path="/marker" element={<MarkerDashboard />} />
          <Route path="/marker/evaluate/:candidateId" element={<MarkerEvaluation />} />
          <Route path="/" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
