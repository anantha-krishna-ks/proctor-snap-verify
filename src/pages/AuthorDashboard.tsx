import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { ProjectCard } from "@/components/admin/ProjectCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { mockProjects } from "@/data/projectMockData";

const AuthorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const userRole = localStorage.getItem("userRole") || "author";

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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">My Projects</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage items and content for your assigned projects
              </p>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} userRole={userRole} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No projects found matching your search.
            </div>
          )}

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthorDashboard;
