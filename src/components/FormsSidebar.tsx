import { useState } from "react";
import { motion } from "framer-motion";
import {
  PlayCircle,
  ListOrdered,
  FileStack,
  GraduationCap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const contentMenuItems = [
  { id: "blueprint", title: "Blueprint", icon: FileStack },
  { id: "forms", title: "Form", icon: PlayCircle },
  { id: "assessment", title: "Assessment", icon: GraduationCap },
  { id: "test-sequence", title: "Test Sequence", icon: ListOrdered },
];

const settingsMenuItems = [
  { id: "configuration", title: "Configuration", icon: Settings },
  { id: "survey", title: "Survey", icon: ClipboardList },
  { id: "agreement", title: "Agreement", icon: FileSignature },
];

export const FormsSidebar = ({
  projects,
  selectedProjectId,
  onProjectChange,
  activeMenu,
  onMenuChange,
}: FormsSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const renderMenuItem = (item: typeof contentMenuItems[0], index: number, offset: number = 0) => {
    const Icon = item.icon;
    const isActive = activeMenu === item.id;

    const button = (
      <motion.button
        key={item.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: (index + offset) * 0.05 }}
        whileHover={{ x: isCollapsed ? 0 : 2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onMenuChange(item.id)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isCollapsed && "justify-center px-2",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!isCollapsed && <span>{item.title}</span>}
      </motion.button>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside 
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: isCollapsed ? 56 : 224 }}
        transition={{ duration: 0.2 }}
        className="bg-card border-r border-border flex flex-col shrink-0 relative"
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-muted-foreground" />
          )}
        </button>

        {/* Project Switcher */}
        <div className="p-3 border-b border-border">
          {!isCollapsed && (
            <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">Product</p>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button 
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors",
                  isCollapsed && "px-2 justify-center"
                )}
              >
                {isCollapsed ? (
                  <FileStack className="h-4 w-4 text-foreground" />
                ) : (
                  <>
                    <span className="text-sm font-medium text-foreground truncate">
                      {selectedProject?.name || "Select Project"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  </>
                )}
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
          {/* Content Group */}
          {!isCollapsed && (
            <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content</p>
          )}
          <div className="space-y-0.5">
            {contentMenuItems.map((item, index) => renderMenuItem(item, index))}
          </div>

          {/* Separator */}
          <div className="my-3 mx-2 border-t border-border" />

          {/* Settings Group */}
          {!isCollapsed && (
            <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settings</p>
          )}
          <div className="space-y-0.5">
            {settingsMenuItems.map((item, index) => renderMenuItem(item, index, contentMenuItems.length))}
          </div>
        </nav>
      </motion.aside>
    </TooltipProvider>
  );
};
