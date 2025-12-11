import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  LogOut,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { mockMarkerProjects, mockMarkerSchedules } from "@/data/markerMockData";

const MarkerSchedulesDashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const project = mockMarkerProjects.find((p) => p.id === projectId);
  const schedules = mockMarkerSchedules.filter((s) => s.projectId === projectId);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.scheduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.assessmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalSchedules: schedules.length,
    totalCandidates: schedules.reduce((sum, s) => sum + s.candidateCount, 0),
    completedCount: schedules.reduce((sum, s) => sum + s.completedCount, 0),
    pendingCount: schedules.reduce((sum, s) => sum + s.notStartedCount + s.inProgressCount, 0),
  };

  const calculateDaysLeft = (deadline: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const getDaysLeftBadge = (daysLeft: number) => {
    if (daysLeft < 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Overdue by {Math.abs(daysLeft)}d
        </Badge>
      );
    } else if (daysLeft === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Due Today
        </Badge>
      );
    } else if (daysLeft <= 3) {
      return (
        <Badge className="bg-amber-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {daysLeft}d left
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {daysLeft}d left
        </Badge>
      );
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <Button onClick={() => navigate("/marker")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/marker")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Select a schedule to view candidates
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Schedules</p>
                  <p className="text-2xl font-bold">{stats.totalSchedules}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                  <p className="text-2xl font-bold">{stats.totalCandidates}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedCount}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-amber-500">{stats.pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedules Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assigned Schedules</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schedules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schedule Name</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => {
                  const progressPercent = schedule.candidateCount > 0
                    ? Math.round((schedule.completedCount / schedule.candidateCount) * 100)
                    : 0;
                  const daysLeft = calculateDaysLeft(schedule.deadline);

                  return (
                    <TableRow key={schedule.scheduleId}>
                      <TableCell className="font-medium">
                        {schedule.scheduleName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {schedule.assessmentName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{schedule.candidateCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 w-32">
                          <div className="flex items-center justify-between text-xs">
                            <span>{schedule.completedCount}/{schedule.candidateCount}</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {new Date(schedule.deadline).toLocaleDateString()}
                          </div>
                          {getDaysLeftBadge(daysLeft)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`/marker/projects/${projectId}/schedules/${schedule.scheduleId}/candidates`)
                          }
                        >
                          View Candidates
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredSchedules.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No schedules found matching your search.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd{" "}
          <a
            href="https://www.excelsoftcorp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            https://www.excelsoftcorp.com
          </a>
        </div>
      </main>
    </div>
  );
};

export default MarkerSchedulesDashboard;
