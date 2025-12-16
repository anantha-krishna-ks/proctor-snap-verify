import { useState, useMemo } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { ProjectCard } from "@/components/admin/ProjectCard";
import { RoleStatsSummary } from "@/components/admin/RoleStatsSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserCog, Trash2, CheckSquare } from "lucide-react";
import { mockProjects, Project } from "@/data/projectMockData";
import { 
  mockUsers, 
  getCurrentUserId, 
  setCurrentUserId, 
  getUserRolesForProject 
} from "@/data/userRolesMockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserIdState] = useState(() => getCurrentUserId());
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const handleUserChange = (userId: string) => {
    setCurrentUserId(userId);
    setCurrentUserIdState(userId);
    setSelectedProjects(new Set());
  };

  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0];

  // Filter projects where user has at least one role
  const userProjects = projects.filter((project) => {
    const roles = getUserRolesForProject(currentUserId, project.id);
    return roles.length > 0;
  });

  // Get all unique roles the user has across all projects
  const allUserRoles = useMemo(() => {
    const roles = new Set<string>();
    userProjects.forEach((project) => {
      getUserRolesForProject(currentUserId, project.id).forEach((role) => roles.add(role));
    });
    return Array.from(roles);
  }, [currentUserId, userProjects]);

  const filteredProjects = userProjects
    .filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // Sort pinned projects to top
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const handleSelectProject = (id: string, selected: boolean) => {
    setSelectedProjects(prev => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleTogglePin = (id: string) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, isPinned: !p.isPinned } : p
    ));
    const project = projects.find(p => p.id === id);
    toast.success(project?.isPinned ? "Project unpinned" : "Project pinned to top");
  };

  const handleSelectAll = () => {
    if (selectedProjects.size === filteredProjects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(filteredProjects.map(p => p.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedProjects(new Set());
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6">
          {/* Title and Actions */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-foreground">My Projects</h1>
            <div className="flex items-center gap-3">
              {/* User Switcher (for demo) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <UserCog className="h-4 w-4" />
                    <span className="text-sm font-medium">{currentUser.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-lg z-50">
                  <DropdownMenuLabel>Switch User (Demo)</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {mockUsers.map((user) => (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => handleUserChange(user.id)}
                      className={currentUserId === user.id ? "bg-muted" : ""}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
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

          {/* Selection Actions Bar */}
          {selectedProjects.size > 0 && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {selectedProjects.size} selected
              </Badge>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                <CheckSquare className="h-4 w-4 mr-1" />
                {selectedProjects.size === filteredProjects.length ? "Deselect All" : "Select All"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearSelection}>
                Clear Selection
              </Button>
              <div className="flex-1" />
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Role Stats Summary */}
          <RoleStatsSummary projects={userProjects} userRoles={allUserRoles} />

          {/* Project Grid - passing user's roles per project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                userRoles={getUserRolesForProject(currentUserId, project.id)}
                isSelected={selectedProjects.has(project.id)}
                onSelect={handleSelectProject}
                onTogglePin={handleTogglePin}
              />
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
