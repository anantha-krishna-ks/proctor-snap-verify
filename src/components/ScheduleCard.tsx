import { Schedule } from "@/types/assessment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ScheduleCardProps {
  schedule: Schedule;
}

export const ScheduleCard = ({ schedule }: ScheduleCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{schedule.scheduleName}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={schedule.status === "published" ? "default" : "secondary"}>
                {schedule.status === "published" ? "Published" : "Unpublished"}
              </Badge>
              {schedule.pendingApprovals > 0 && (
                <Badge 
                  variant="outline" 
                  className="bg-warning/10 text-warning border-warning/20 cursor-pointer hover:bg-warning/20"
                  onClick={() => navigate(`/approvals/${schedule.id}`)}
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {schedule.pendingApprovals} Pending Approval{schedule.pendingApprovals > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
          {schedule.status === "unpublished" && (
            <Button size="sm">Publish</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <div className="font-medium text-muted-foreground mb-1">Assessment</div>
          <div className="font-medium">{schedule.assessmentName}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Batches:</span>
            <span className="font-medium">{schedule.numberOfBatches}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Test Takers:</span>
            <span className="font-medium">{schedule.numberOfTestTakers}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium">
            {new Date(schedule.testStartDate).toLocaleDateString()} - {new Date(schedule.testEndDate).toLocaleDateString()}
          </span>
        </div>

        <div className="pt-2 border-t">
          <div className="text-sm font-medium text-muted-foreground mb-2">Attendance</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm">
                <span className="font-semibold">{schedule.attempted}</span>
                <span className="text-muted-foreground"> Attempted</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-semibold">{schedule.notAttempted}</span>
                <span className="text-muted-foreground"> Not Attempted</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
