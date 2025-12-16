import { Card } from "@/components/ui/card";
import { 
  Package, Clock, CheckSquare, BookOpen, CalendarClock,
  Edit, FileText, ClipboardList, Users, Eye, Calendar
} from "lucide-react";
import type { Project } from "@/data/projectMockData";

interface RoleStatsSummaryProps {
  projects: Project[];
  userRoles: string[];
}

interface StatItem {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const ADMIN_STATS: StatItem[] = [
  { key: "totalProducts", label: "Total Products", icon: Package, color: "text-primary" },
  { key: "evaluationPending", label: "Evaluation Pending", icon: Clock, color: "text-primary" },
  { key: "itemApprovalPending", label: "Item Approval Pending", icon: CheckSquare, color: "text-primary" },
  { key: "totalTests", label: "Total Tests", icon: BookOpen, color: "text-primary" },
  { key: "upcomingSchedules", label: "Upcoming Schedules", icon: CalendarClock, color: "text-primary" },
];

const MARKER_STATS: StatItem[] = [
  { key: "assignedItems", label: "Assignments", icon: ClipboardList, color: "text-blue-600 dark:text-blue-400" },
  { key: "pendingEvaluations", label: "Pending Evaluations", icon: Clock, color: "text-blue-600 dark:text-blue-400" },
  { key: "completedToday", label: "Completed Today", icon: CheckSquare, color: "text-blue-600 dark:text-blue-400" },
];

const AUTHOR_STATS: StatItem[] = [
  { key: "publishedItems", label: "Items Created", icon: Edit, color: "text-purple-600 dark:text-purple-400" },
  { key: "draftItems", label: "Tests Created", icon: FileText, color: "text-purple-600 dark:text-purple-400" },
  { key: "reviewPending", label: "In Review", icon: Clock, color: "text-purple-600 dark:text-purple-400" },
];

const PROCTOR_STATS: StatItem[] = [
  { key: "activeSessions", label: "Active Sessions", icon: Eye, color: "text-orange-600 dark:text-orange-400" },
  { key: "upcomingSessions", label: "Upcoming Sessions", icon: Calendar, color: "text-orange-600 dark:text-orange-400" },
  { key: "flaggedCandidates", label: "Flagged", icon: Users, color: "text-orange-600 dark:text-orange-400" },
];

export const RoleStatsSummary = ({ projects, userRoles }: RoleStatsSummaryProps) => {
  const aggregateStats = (key: string) => {
    return projects.reduce((sum, project) => {
      const stats = project.roleStats as Record<string, number | undefined>;
      return sum + (stats?.[key] ?? 0);
    }, 0);
  };

  const getStatsForRoles = (): StatItem[] => {
    const stats: StatItem[] = [];
    
    if (userRoles.includes("admin")) {
      stats.push(...ADMIN_STATS);
    }
    if (userRoles.includes("author") || userRoles.includes("test_author")) {
      stats.push(...AUTHOR_STATS);
    }
    if (userRoles.includes("marker")) {
      stats.push(...MARKER_STATS);
    }
    if (userRoles.includes("proctor")) {
      stats.push(...PROCTOR_STATS);
    }
    
    return stats;
  };

  const statsToShow = getStatsForRoles();

  if (statsToShow.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-6">
      {statsToShow.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.key} className="p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-foreground">
                  {aggregateStats(stat.key)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {stat.label}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};