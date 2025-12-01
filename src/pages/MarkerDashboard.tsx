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
import { Search, ClipboardList, CheckCircle2, Clock, ArrowLeft, LogOut } from "lucide-react";
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
  },
];

const MarkerDashboard = () => {
  const navigate = useNavigate();
  const { hasPrivilege } = usePrivileges();
  const [searchQuery, setSearchQuery] = useState("");

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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MarkerDashboard;
