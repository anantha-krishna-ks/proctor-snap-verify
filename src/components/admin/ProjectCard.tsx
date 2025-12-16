import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, FileText, Calendar, MoreHorizontal, Image, 
  ChevronDown, ChevronUp, Shield, UserCheck, Eye, Edit, Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/data/projectMockData";

interface ProjectCardProps {
  project: Project;
  userRoles?: string[];
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
      { label: "Start Evaluation", path: "/marker/projects/{id}", icon: UserCheck },
      { label: "View Schedules", path: "/marker/projects/{id}/schedules", icon: Calendar },
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
      { label: "Manage Items", path: "/author/projects/{id}/items", icon: FileText },
      { label: "View Forms", path: "/forms", icon: FolderOpen },
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
      { label: "Manage Items", path: "/author/projects/{id}/items", icon: FileText },
      { label: "View Forms", path: "/forms", icon: FolderOpen },
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

export const ProjectCard = ({ project, userRoles = ["admin"] }: ProjectCardProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatValue = (key: string) => {
    const stats = project.roleStats as Record<string, number | undefined>;
    return stats?.[key] ?? 0;
  };

  const handleAction = (path: string) => {
    const resolvedPath = path.replace("{id}", project.id);
    navigate(resolvedPath);
  };

  const handleCardClick = () => {
    // Navigate to primary role's main action
    const primaryRole = userRoles[0];
    const config = ROLE_CONFIG[primaryRole];
    if (config?.actions[0]) {
      handleAction(config.actions[0].path);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      {/* Image Section */}
      <div 
        className="h-28 bg-muted flex items-center justify-center relative cursor-pointer"
        onClick={handleCardClick}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Image className="h-8 w-8 mb-1" />
            <span className="text-xs">No Image</span>
          </div>
        )}
        
        {/* Role Badges - Top */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {userRoles.map((role) => {
            const config = ROLE_CONFIG[role];
            if (!config) return null;
            const IconComponent = config.icon;
            return (
              <Badge 
                key={role} 
                variant="secondary" 
                className={`text-xs ${config.color} border`}
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            );
          })}
        </div>

        {/* Actions Menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg z-50 w-48">
              {userRoles.map((role, idx) => {
                const config = ROLE_CONFIG[role];
                if (!config) return null;
                return (
                  <div key={role}>
                    {idx > 0 && <DropdownMenuSeparator />}
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
        <div className="mb-2 cursor-pointer" onClick={handleCardClick}>
          <p className="text-xs text-muted-foreground truncate">Code: {project.code}</p>
          <h3 className="font-semibold text-foreground truncate text-sm" title={project.name}>
            {project.name}
          </h3>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
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

        {/* Expandable Role Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full h-7 text-xs justify-between px-2 hover:bg-muted/50"
            >
              <span className="text-muted-foreground">
                {isExpanded ? "Hide Details" : "View Role Details"}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-2 space-y-3">
            {userRoles.map((role) => {
              const config = ROLE_CONFIG[role];
              if (!config) return null;
              const IconComponent = config.icon;
              
              return (
                <div 
                  key={role} 
                  className={`p-2 rounded-lg border ${config.color.split(' ').slice(0, 2).join(' ')} border-current/20`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <IconComponent className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{config.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {config.stats.map((stat) => (
                      <div key={stat.key} className="text-center">
                        <div className="text-sm font-bold">
                          {getStatValue(stat.key)}
                        </div>
                        <div className="text-[10px] text-current/70">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
