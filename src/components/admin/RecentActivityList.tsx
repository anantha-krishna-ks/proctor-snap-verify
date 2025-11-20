import { Card } from "@/components/ui/card";
import { RecentActivity } from "@/types/admin";
import { 
  FileText, 
  UserPlus, 
  CheckCircle2, 
  FolderPlus, 
  Clock 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityListProps {
  activities: RecentActivity[];
}

const getActivityIcon = (type: RecentActivity["type"]) => {
  switch (type) {
    case "test_created":
      return FileText;
    case "user_created":
      return UserPlus;
    case "assessment_completed":
      return CheckCircle2;
    case "item_created":
      return FolderPlus;
    case "approval_pending":
      return Clock;
    default:
      return FileText;
  }
};

const getActivityColor = (type: RecentActivity["type"]) => {
  switch (type) {
    case "test_created":
      return "text-primary";
    case "user_created":
      return "text-success";
    case "assessment_completed":
      return "text-accent";
    case "item_created":
      return "text-warning";
    case "approval_pending":
      return "text-muted-foreground";
    default:
      return "text-foreground";
  }
};

export const RecentActivityList = ({ activities }: RecentActivityListProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-muted ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
