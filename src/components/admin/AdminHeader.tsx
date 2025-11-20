import { Button } from "@/components/ui/button";
import { AdminNavButton } from "./AdminNavButton";
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Database, 
  FileStack, 
  Calendar 
} from "lucide-react";

export const AdminHeader = () => {
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
            <Button variant="default" size="sm">Create New</Button>
          </div>
        </div>
        
        <nav className="flex gap-1 flex-wrap">
          <AdminNavButton to="/admin" icon={LayoutDashboard}>
            Dashboard
          </AdminNavButton>
          <AdminNavButton to="/admin/users" icon={Users}>
            User Management
          </AdminNavButton>
          <AdminNavButton to="/admin/products" icon={FolderOpen}>
            Products/Courses
          </AdminNavButton>
          <AdminNavButton to="/admin/item-bank" icon={Database}>
            Item Bank
          </AdminNavButton>
          <AdminNavButton to="/admin/test-bank" icon={FileStack}>
            Test Bank
          </AdminNavButton>
          <AdminNavButton to="/scheduling" icon={Calendar}>
            Scheduling
          </AdminNavButton>
        </nav>
      </div>
    </header>
  );
};
