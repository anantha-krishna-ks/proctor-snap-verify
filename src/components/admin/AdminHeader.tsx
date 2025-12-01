import { Button } from "@/components/ui/button";
import { AdminNavButton } from "./AdminNavButton";
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Database, 
  FileStack, 
  Calendar,
  UserCheck,
  LogOut,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePrivileges } from "@/hooks/usePrivileges";

export const AdminHeader = () => {
  const navigate = useNavigate();
  const { hasPrivilege } = usePrivileges();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage your assessment platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Settings</Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button variant="default" size="sm">Create New</Button>
          </div>
        </div>
        
        <nav className="flex gap-1 flex-wrap">
          {hasPrivilege("dashboard.admin") && (
            <AdminNavButton to="/admin" icon={LayoutDashboard}>
              Dashboard
            </AdminNavButton>
          )}
          {hasPrivilege("role.view") && (
            <AdminNavButton to="/admin/roles" icon={Shield}>
              Roles & Privileges
            </AdminNavButton>
          )}
          {hasPrivilege("user.view") && (
            <AdminNavButton to="/admin/users" icon={Users}>
              User Management
            </AdminNavButton>
          )}
          {hasPrivilege("test.view") && (
            <AdminNavButton to="/admin/products" icon={FolderOpen}>
              Products/Courses
            </AdminNavButton>
          )}
          {hasPrivilege("item.view") && (
            <AdminNavButton to="/admin/item-bank" icon={Database}>
              Item Bank
            </AdminNavButton>
          )}
          {hasPrivilege("test.view") && (
            <AdminNavButton to="/admin/test-bank" icon={FileStack}>
              Test Bank
            </AdminNavButton>
          )}
          {hasPrivilege("schedule.view") && (
            <AdminNavButton to="/scheduling" icon={Calendar}>
              Scheduling
            </AdminNavButton>
          )}
          {hasPrivilege("dashboard.marker") && (
            <AdminNavButton to="/marker" icon={UserCheck}>
              Marker Dashboard
            </AdminNavButton>
          )}
        </nav>
      </div>
    </header>
  );
};
