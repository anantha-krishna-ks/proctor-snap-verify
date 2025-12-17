import { motion } from "framer-motion";
import {
  PlayCircle,
  ListOrdered,
  FileStack,
  GraduationCap,
  ChevronDown,
  Check,
  ClipboardList,
  Settings,
  FileSignature,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  { id: "survey", title: "Survey", icon: ClipboardList },
  { id: "configuration", title: "Configuration", icon: Settings },
  { id: "agreement", title: "Agreement", icon: FileSignature },
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
    <motion.aside 
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-56 bg-card border-r border-border flex flex-col shrink-0"
    >
      {/* Project Switcher */}
      <div className="p-3 border-b border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-sm font-medium text-foreground truncate">
                {selectedProject?.name || "Select Project"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="w-52"
            sideOffset={4}
          >
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => onProjectChange(project.id)}
                className={cn(
                  "flex items-center justify-between cursor-pointer",
                  selectedProjectId === project.id && "bg-accent"
                )}
              >
                <span className="truncate text-sm">{project.name}</span>
                {selectedProjectId === project.id && (
                  <Check className="h-4 w-4 text-primary shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2">
        <div className="space-y-0.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onMenuChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </motion.aside>
  );
};
