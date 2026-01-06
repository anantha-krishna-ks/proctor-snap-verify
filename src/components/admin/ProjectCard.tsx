import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, FileText, Calendar, MoreHorizontal, Image, 
  Shield, UserCheck, Eye, Edit, Users, Pencil, Trash2, UserPlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/data/projectMockData";

interface ProjectCardProps {
  project: Project;
  userRoles?: string[];
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onAssignUsers?: (project: Project) => void;
}

const ROLE_CONFIG: Record<string, { 
  label: string; 
  color: string; 
  icon: React.ElementType;
  stats: { key: string; label: string }[];
  actions: { label: string; path: string; icon: React.ElementType }[];
}> = {
  admin: {
    label: "Admin",
    color: "bg-primary/10 text-primary border-primary/20",
    icon: Shield,
    stats: [
      { key: "totalUsers", label: "Users" },
      { key: "activeSchedules", label: "Schedules" },
      { key: "pendingApprovals", label: "Pending" },
    ],
    actions: [
      { label: "Manage Users", path: "/admin/roles", icon: Users },
      { label: "View Schedules", path: "/scheduling", icon: Calendar },
    ],
  },
  marker: {
    label: "Marker",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200",
    icon: UserCheck,
    stats: [
      { key: "assignedItems", label: "Assigned" },
      { key: "pendingEvaluations", label: "Pending" },
      { key: "completedToday", label: "Done Today" },
    ],
    actions: [
      { label: "Start Evaluation", path: "/marker/projects/{id}/schedules", icon: UserCheck },
    ],
  },
  author: {
    label: "Author",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200",
    icon: Edit,
    stats: [
      { key: "draftItems", label: "Drafts" },
      { key: "publishedItems", label: "Published" },
      { key: "reviewPending", label: "In Review" },
    ],
    actions: [
      { label: "View Forms", path: "/forms", icon: FolderOpen },
      { label: "Manage Items", path: "/author/projects/{id}/items", icon: FileText },
    ],
  },
  test_author: {
    label: "Test Author",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200",
    icon: Edit,
    stats: [
      { key: "draftItems", label: "Drafts" },
      { key: "publishedItems", label: "Published" },
      { key: "reviewPending", label: "In Review" },
    ],
    actions: [
      { label: "View Forms", path: "/forms", icon: FolderOpen },
      { label: "Manage Items", path: "/author/projects/{id}/items", icon: FileText },
    ],
  },
  proctor: {
    label: "Proctor",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200",
    icon: Eye,
    stats: [
      { key: "activeSessions", label: "Active" },
      { key: "upcomingSessions", label: "Upcoming" },
      { key: "flaggedCandidates", label: "Flagged" },
    ],
    actions: [
      { label: "View Sessions", path: "/scheduling", icon: Calendar },
      { label: "Headshot Approval", path: "/headshot-approval", icon: Users },
    ],
  },
};

export const ProjectCard = ({ 
  project, 
  userRoles = ["admin"],
  onEdit,
  onDelete,
  onAssignUsers,
}: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleAction = (path: string) => {
    const resolvedPath = path.replace("{id}", project.id);
    navigate(resolvedPath);
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image Section */}
      <div 
        className="h-32 bg-muted flex items-center justify-center relative overflow-hidden"
      >
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
        
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Image className="h-10 w-10 mb-1" />
            <span className="text-xs">No Image</span>
          </div>
        )}
        
        {/* Role Badges - Bottom Left */}
        <div className="absolute bottom-2 left-2 z-20 flex flex-wrap gap-1">
          {userRoles.slice(0, 2).map((role) => {
            const config = ROLE_CONFIG[role];
            if (!config) return null;
            const IconComponent = config.icon;
            return (
              <Badge 
                key={role} 
                variant="secondary" 
                className={`text-xs ${config.color} border backdrop-blur-sm`}
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            );
          })}
          {userRoles.length > 2 && (
            <Badge variant="secondary" className="text-xs bg-background/80">
              +{userRoles.length - 2}
            </Badge>
          )}
        </div>

        {/* Actions Menu - Top Right */}
        <div className="absolute top-2 right-2 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg z-50 w-48">
              {/* Product Actions */}
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Product Actions
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAssignUsers?.(project)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Users
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(project)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
              </DropdownMenuItem>
              
              {/* Role-specific Actions */}
              {userRoles.map((role, idx) => {
                const config = ROLE_CONFIG[role];
                if (!config) return null;
                return (
                  <div key={role}>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {config.label} Actions
                    </DropdownMenuLabel>
                    {config.actions.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <DropdownMenuItem 
                          key={action.label} 
                          onClick={() => handleAction(action.path)}
                        >
                          <ActionIcon className="h-4 w-4 mr-2" />
                          {action.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-3">
        <div className="mb-2">
          <p className="text-xs text-muted-foreground truncate">Code: {project.code}</p>
          <h3 className="font-semibold text-foreground truncate text-sm" title={project.name}>
            {project.name}
          </h3>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <FolderOpen className="h-3 w-3" />
            <span>{project.itemCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{project.testCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{project.scheduleCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};