import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { ProjectCard } from "@/components/admin/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCog } from "lucide-react";
import { mockProjects } from "@/data/projectMockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const ROLES = [
  { id: "admin", label: "Administrator", color: "bg-primary/10 text-primary" },
  { id: "marker", label: "Marker", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { id: "author", label: "Author", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  { id: "test_author", label: "Test Author", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  { id: "proctor", label: "Proctor", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentRole, setCurrentRole] = useState(() => localStorage.getItem("userRole") || "admin");

  const handleRoleChange = (roleId: string) => {
    // Save original role on first switch
    if (!localStorage.getItem("originalUserRole")) {
      localStorage.setItem("originalUserRole", currentRole);
    }
    setCurrentRole(roleId);
    localStorage.setItem("userRole", roleId);
  };

  const currentRoleData = ROLES.find(r => r.id === currentRole) || ROLES[0];

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6">
          {/* Title and Actions */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Latest Products</h1>
            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <UserCog className="h-4 w-4" />
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${currentRoleData.color}`}>
                      {currentRoleData.label}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-lg z-50">
                  <DropdownMenuLabel>Switch Role View</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {ROLES.map((role) => (
                    <DropdownMenuItem
                      key={role.id}
                      onClick={() => handleRoleChange(role.id)}
                      className={currentRole === role.id ? "bg-muted" : ""}
                    >
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${role.color}`}>
                        {role.label}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                Manage Products
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product code, name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} userRole={currentRole} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No products found matching your search.
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd{" "}
            <a
              href="https://www.excelsoftcorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://www.excelsoftcorp.com
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
