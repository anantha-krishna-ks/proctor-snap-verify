import { motion } from "framer-motion";
import {
  PlayCircle,
  ListOrdered,
  FileStack,
  GraduationCap,
  ChevronDown,
  Check,
  Sparkles,
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
  { id: "forms", title: "Forms", icon: PlayCircle, description: "Question banks & forms" },
  { id: "test-sequence", title: "Test Sequence", icon: ListOrdered, description: "Assessment workflows" },
  { id: "blueprint", title: "Blueprint", icon: FileStack, description: "Test structure templates" },
  { id: "assessment", title: "Assessment", icon: GraduationCap, description: "Schedule & manage" },
];

export const FormsSidebar = ({
  projects,
  selectedProjectId,
  onProjectChange,
  activeMenu,
  onMenuChange,
}: FormsSidebarProps) => {
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-72 bg-gradient-to-b from-card to-card/95 border-r border-border flex flex-col shrink-0"
    >
      {/* Project Switcher */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="p-4"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-4 transition-all duration-300 hover:from-primary/10 hover:via-primary/15 hover:to-accent/10 hover:shadow-lg hover:shadow-primary/5 border border-border/50 hover:border-primary/20"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="relative"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/20">
                    <span className="text-primary-foreground font-bold text-sm">
                      {selectedProject ? getInitials(selectedProject.name) : "?"}
                    </span>
                  </div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card" 
                  />
                </motion.div>

                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    Project
                  </p>
                  <p className="font-semibold text-foreground truncate leading-tight">
                    {selectedProject?.name || "Select Project"}
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: 0 }}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </motion.div>
              </div>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="w-[260px] bg-popover border border-border shadow-xl rounded-xl p-2"
            sideOffset={8}
          >
            <div className="px-2 py-1.5 mb-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Switch Project
              </p>
            </div>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DropdownMenuItem
                  onClick={() => onProjectChange(project.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                    selectedProjectId === project.id 
                      ? "bg-primary/10" 
                      : "hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                    selectedProjectId === project.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {getInitials(project.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate text-sm",
                      selectedProjectId === project.id ? "text-primary" : "text-foreground"
                    )}>
                      {project.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {project.description}
                    </p>
                  </div>
                  {selectedProjectId === project.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    </motion.div>
                  )}
                </DropdownMenuItem>
              </motion.div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Divider */}
      <div className="px-4">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="h-px bg-gradient-to-r from-transparent via-border to-transparent" 
        />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.15 + index * 0.08,
                  duration: 0.3,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  x: 4,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onMenuChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <motion.div 
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    isActive
                      ? "bg-primary-foreground/20"
                      : "bg-muted"
                  )}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium block">{item.title}</span>
                  <span className={cn(
                    "text-xs block truncate",
                    isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {item.description}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1.5 h-8 bg-primary-foreground/30 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 border-t border-border/50"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50"
        >
          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
          </motion.div>
          <span className="text-xs text-muted-foreground">
            Project-specific content
          </span>
        </motion.div>
      </motion.div>
    </motion.aside>
  );
};
