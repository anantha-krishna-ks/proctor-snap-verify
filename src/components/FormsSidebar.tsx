import { NavLink, useLocation } from "react-router-dom";
import {
  PlayCircle,
  ListOrdered,
  FileStack,
  GraduationCap,
  Building2,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  description: string;
}

interface FormsSidebarProps {
  projects: Project[];
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const menuItems = [
  { id: "forms", title: "Forms", icon: PlayCircle },
  { id: "test-sequence", title: "Test Sequence", icon: ListOrdered },
  { id: "blueprint", title: "Blueprint", icon: FileStack },
  { id: "assessment", title: "Assessment", icon: GraduationCap },
];

export const FormsSidebar = ({
  projects,
  selectedProjectId,
  onProjectChange,
  activeMenu,
  onMenuChange,
}: FormsSidebarProps) => {
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0">
      {/* Project Switcher */}
      <div className="p-4 border-b border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-auto py-3 px-3 justify-between gap-2"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-foreground text-sm truncate">
                    {selectedProject?.name || "Select Project"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {selectedProject?.description || "Choose a project"}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px] bg-popover">
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => onProjectChange(project.id)}
                className="flex items-start gap-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium block truncate">{project.name}</span>
                  <span className="text-xs text-muted-foreground block truncate">
                    {project.description}
                  </span>
                </div>
                {selectedProjectId === project.id && (
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onMenuChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Project-specific content
        </p>
      </div>
    </aside>
  );
};
