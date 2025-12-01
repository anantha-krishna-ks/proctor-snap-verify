import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ClipboardList, CheckCircle2, Clock, ArrowLeft, LogOut, Calendar, AlertTriangle, LayoutList, CalendarDays } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { usePrivileges } from "@/hooks/usePrivileges";

interface AssignedCandidate {
  id: string;
  name: string;
  email: string;
  scheduleName: string;
  assessmentName: string;
  submittedAt: string;
  evaluationStatus: "not_started" | "in_progress" | "completed";
  totalScore?: number;
  maxScore: number;
  completionDate?: string;
}

const mockAssignedCandidates: AssignedCandidate[] = [
  {
    id: "c1",
    name: "John Smith",
    email: "john.smith@example.com",
    scheduleName: "Q1 2024 Assessment - Batch A",
    assessmentName: "Advanced Programming Test",
    submittedAt: "2024-03-15T10:30:00",
    evaluationStatus: "not_started",
    maxScore: 100,
    completionDate: "2024-12-10",
  },
  {
    id: "c2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    scheduleName: "Q1 2024 Assessment - Batch A",
    assessmentName: "Advanced Programming Test",
    submittedAt: "2024-03-15T11:45:00",
    evaluationStatus: "in_progress",
    totalScore: 45,
    maxScore: 100,
    completionDate: "2024-12-05",
  },
  {
    id: "c3",
    name: "Mike Chen",
    email: "mike.chen@example.com",
    scheduleName: "Q1 2024 Assessment - Batch B",
    assessmentName: "Data Structures Exam",
    submittedAt: "2024-03-14T14:20:00",
    evaluationStatus: "completed",
    totalScore: 87,
    maxScore: 100,
    completionDate: "2024-12-01",
  },
];

const MarkerDashboard = () => {
  const navigate = useNavigate();
  const { hasPrivilege } = usePrivileges();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const filteredCandidates = mockAssignedCandidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.scheduleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockAssignedCandidates.length,
    notStarted: mockAssignedCandidates.filter(c => c.evaluationStatus === "not_started").length,
    inProgress: mockAssignedCandidates.filter(c => c.evaluationStatus === "in_progress").length,
    completed: mockAssignedCandidates.filter(c => c.evaluationStatus === "completed").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return <Badge variant="secondary">Not Started</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      default:
        return null;
    }
  };

  const calculateDaysLeft = (completionDate?: string) => {
    if (!completionDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(completionDate);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getDaysLeftBadge = (daysLeft: number | null) => {
    if (daysLeft === null) return null;
    
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

  // Get candidates with deadlines for calendar view
  const candidatesWithDeadlines = mockAssignedCandidates.filter(c => c.completionDate);
  
  // Get dates that have deadlines
  const datesWithDeadlines = candidatesWithDeadlines.map(c => parseISO(c.completionDate!));
  
  // Get candidates for selected date
  const candidatesForSelectedDate = selectedDate 
    ? candidatesWithDeadlines.filter(c => 
        isSameDay(parseISO(c.completionDate!), selectedDate)
      )
    : [];
  
  // Modifier to highlight dates with deadlines
  const modifiers = {
    hasDeadline: datesWithDeadlines,
  };
  
  const modifiersClassNames = {
    hasDeadline: "bg-primary/20 font-bold hover:bg-primary/30",
  };

  return (
    <div className="min-h-screen bg-background">
      {hasPrivilege("dashboard.admin") ? (
        <AdminHeader />
      ) : (
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Admin
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Marker Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Evaluate assigned candidates
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
      )}

      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Not Started</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.notStarted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assigned Candidates</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-r-none"
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "calendar" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                    className="rounded-l-none"
                  >
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => {
                    const daysLeft = calculateDaysLeft(candidate.completionDate);
                    return (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {candidate.scheduleName}
                        </TableCell>
                        <TableCell className="text-sm">
                          {candidate.assessmentName}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(candidate.submittedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(candidate.evaluationStatus)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {candidate.completionDate ? (
                              <>
                                <div className="text-sm">
                                  {new Date(candidate.completionDate).toLocaleDateString()}
                                </div>
                                {candidate.evaluationStatus !== "completed" && getDaysLeftBadge(daysLeft)}
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">Not set</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {candidate.totalScore !== undefined
                            ? `${candidate.totalScore}/${candidate.maxScore}`
                            : `-/${candidate.maxScore}`}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/marker/evaluate/${candidate.id}`)}
                          >
                            {candidate.evaluationStatus === "completed" ? "Review" : "Evaluate"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-4">Evaluation Calendar</h3>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={modifiers}
                    modifiersClassNames={modifiersClassNames}
                    className="rounded-md border"
                  />
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-primary/20 border border-primary/40"></span>
                      Dates with deadlines
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {selectedDate ? `Deadlines for ${format(selectedDate, "MMMM d, yyyy")}` : "Select a date"}
                  </h3>
                  {candidatesForSelectedDate.length > 0 ? (
                    <div className="space-y-3">
                      {candidatesForSelectedDate.map((candidate) => {
                        const daysLeft = calculateDaysLeft(candidate.completionDate);
                        return (
                          <Card key={candidate.id} className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">{candidate.name}</h4>
                                  <p className="text-sm text-muted-foreground">{candidate.email}</p>
                                </div>
                                {getStatusBadge(candidate.evaluationStatus)}
                              </div>
                              
                              <div className="text-sm">
                                <p className="text-muted-foreground">{candidate.scheduleName}</p>
                                <p className="font-medium">{candidate.assessmentName}</p>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {candidate.evaluationStatus !== "completed" && getDaysLeftBadge(daysLeft)}
                                  {candidate.totalScore !== undefined && (
                                    <Badge variant="outline">
                                      {candidate.totalScore}/{candidate.maxScore}
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => navigate(`/marker/evaluate/${candidate.id}`)}
                                >
                                  {candidate.evaluationStatus === "completed" ? "Review" : "Evaluate"}
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No evaluations due on this date</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MarkerDashboard;
