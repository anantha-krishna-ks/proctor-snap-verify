import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, FileText, Calendar, MoreHorizontal, Image, BarChart3, 
  Package, ClipboardList, CalendarDays, Layers, Users, CheckCircle, 
  Clock, AlertCircle, Edit, Eye, Play
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/data/projectMockData";

interface ProjectCardProps {
  project: Project;
  userRole?: string;
}

export const ProjectCard = ({ project, userRole = "admin" }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    switch (userRole) {
      case "marker":
        navigate(`/marker/projects/${project.id}/schedules`);
        break;
      case "author":
      case "test_author":
        navigate(`/author/projects/${project.id}/items`);
        break;
      case "proctor":
        navigate(`/scheduling`);
        break;
      case "admin":
      default:
        navigate(`/admin/products/${project.id}/items`);
        break;
    }
  };

  const handleNavigate = (path: string) => {
    navigate(`/admin/products/${project.id}/${path}`);
  };

  const getRoleSpecificStats = () => {
    const stats = project.roleStats;
    if (!stats) return null;

    switch (userRole) {
      case "marker":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5" />
                Assigned Items
              </span>
              <span className="font-medium">{stats.assignedItems || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Pending Evaluations
              </span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {stats.pendingEvaluations || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                Completed Today
              </span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {stats.completedToday || 0}
              </Badge>
            </div>
          </div>
        );

      case "author":
      case "test_author":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Edit className="h-3.5 w-3.5" />
                Draft Items
              </span>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {stats.draftItems || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                Published Items
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">{stats.publishedItems || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Review Pending
              </span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {stats.reviewPending || 0}
              </Badge>
            </div>
          </div>
        );

      case "proctor":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5" />
                Active Sessions
              </span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {stats.activeSessions || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Upcoming Sessions
              </span>
              <span className="font-medium">{stats.upcomingSessions || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Flagged Candidates
              </span>
              <Badge variant="destructive" className="text-xs">
                {stats.flaggedCandidates || 0}
              </Badge>
            </div>
          </div>
        );

      case "admin":
      default:
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Total Users
              </span>
              <span className="font-medium">{stats.totalUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Active Schedules
              </span>
              <span className="font-medium">{stats.activeSchedules || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Pending Approvals
              </span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {stats.pendingApprovals || 0}
              </Badge>
            </div>
          </div>
        );
    }
  };

  const getRoleSpecificActions = () => {
    switch (userRole) {
      case "marker":
        return (
          <>
            <DropdownMenuItem onClick={() => navigate(`/marker/projects/${project.id}`)}>
              <ClipboardList className="h-4 w-4 mr-2" />
              Start Evaluation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/marker/projects/${project.id}/schedules`)}>
              <CalendarDays className="h-4 w-4 mr-2" />
              View Schedules
            </DropdownMenuItem>
          </>
        );

      case "author":
      case "test_author":
        return (
          <>
            <DropdownMenuItem onClick={() => navigate(`/author/projects/${project.id}/items`)}>
              <Package className="h-4 w-4 mr-2" />
              Manage Items
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/forms")}>
              <ClipboardList className="h-4 w-4 mr-2" />
              Forms
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate("blueprints")}>
              <Layers className="h-4 w-4 mr-2" />
              Blueprints
            </DropdownMenuItem>
          </>
        );

      case "proctor":
        return (
          <>
            <DropdownMenuItem onClick={() => navigate(`/scheduling`)}>
              <CalendarDays className="h-4 w-4 mr-2" />
              View Sessions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/headshot-approval`)}>
              <Users className="h-4 w-4 mr-2" />
              Headshot Approval
            </DropdownMenuItem>
          </>
        );

      case "admin":
      default:
        return (
          <>
            <DropdownMenuItem onClick={() => handleNavigate("items")}>
              <Package className="h-4 w-4 mr-2" />
              View Items
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/forms")}>
              <ClipboardList className="h-4 w-4 mr-2" />
              Forms
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/scheduling")}>
              <CalendarDays className="h-4 w-4 mr-2" />
              View Schedules
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate("blueprints")}>
              <Layers className="h-4 w-4 mr-2" />
              View Blueprints
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/products/${project.id}/reports`)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </DropdownMenuItem>
          </>
        );
    }
  };

  const getRoleBadge = () => {
    const badgeStyles: Record<string, string> = {
      admin: "bg-primary/10 text-primary",
      marker: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      author: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      test_author: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      proctor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };

    const roleLabels: Record<string, string> = {
      admin: "Admin",
      marker: "Marker",
      author: "Author",
      test_author: "Test Author",
      proctor: "Proctor",
    };

    return (
      <Badge variant="secondary" className={`text-xs ${badgeStyles[userRole] || badgeStyles.admin}`}>
        {roleLabels[userRole] || "Admin"}
      </Badge>
    );
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="h-32 bg-muted flex items-center justify-center relative">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Image className="h-10 w-10 mb-1" />
            <span className="text-xs">No Image</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          {getRoleBadge()}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">Code: {project.code}</p>
            <h3 className="font-semibold text-foreground truncate" title={project.name}>
              {project.name}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg z-50">
              {getRoleSpecificActions()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Role-specific Stats */}
        <div className="mb-3 pt-3 border-t border-border">
          {getRoleSpecificStats()}
        </div>

        {/* Common Stats Footer */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <FolderOpen className="h-3.5 w-3.5" />
            <span>{project.itemCount} Items</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>{project.testCount} Tests</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{project.scheduleCount} Schedules</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
