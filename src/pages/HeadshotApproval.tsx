import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { candidates, schedules } from "@/data/mockData";
import { Candidate } from "@/types/assessment";
import { ImageComparisonModal } from "@/components/ImageComparisonModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, UserCheck, Clock, CheckCircle2, XCircle } from "lucide-react";

const HeadshotApproval = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidateList, setCandidateList] = useState(candidates);
  const [activeTab, setActiveTab] = useState<string>("all");

  const schedule = schedules.find((s) => s.id === scheduleId);
  
  const scheduleCandidates = candidateList.filter((c) => c.scheduleId === scheduleId);
  const pendingCandidates = scheduleCandidates.filter((c) => c.status === "pending");
  const approvedCandidates = scheduleCandidates.filter((c) => c.status === "approved");
  const rejectedCandidates = scheduleCandidates.filter((c) => c.status === "rejected");

  const getFilteredCandidates = () => {
    switch (activeTab) {
      case "pending":
        return pendingCandidates;
      case "approved":
        return approvedCandidates;
      case "rejected":
        return rejectedCandidates;
      default:
        return scheduleCandidates;
    }
  };

  const filteredCandidates = getFilteredCandidates();

  const handleApprove = (candidateId: string) => {
    setCandidateList((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: "approved" as const } : c))
    );
  };

  const handleReject = (candidateId: string) => {
    setCandidateList((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: "rejected" as const } : c))
    );
  };

  if (!schedule) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Schedule not found</h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: Candidate["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Headshot Approval</h1>
                <p className="text-sm text-muted-foreground">{schedule.scheduleName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <UserCheck className="w-4 h-4 mr-1.5" />
                {pendingCandidates.length} Pending
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 bg-success/10 border-success/20">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {approvedCandidates.length} Approved
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 bg-destructive/10 border-destructive/20">
                <XCircle className="w-4 h-4 mr-1.5" />
                {rejectedCandidates.length} Rejected
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All ({scheduleCandidates.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Yet to Approve ({pendingCandidates.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedCandidates.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedCandidates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="bg-card rounded-lg border">
              {filteredCandidates.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Submitted At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidates.map((candidate) => (
                        <TableRow key={candidate.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {candidate.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{candidate.email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(candidate.submittedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(candidate.submittedAt).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => setSelectedCandidate(candidate)}
                            >
                              {candidate.status === "pending" ? "Review" : "View"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              ) : (
                <div className="text-center py-12">
                  <UserCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No candidates found</h3>
                  <p className="text-muted-foreground">
                    There are no candidates in this category
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <ImageComparisonModal
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default HeadshotApproval;
