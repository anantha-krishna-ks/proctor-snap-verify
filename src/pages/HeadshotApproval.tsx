import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { candidates, schedules } from "@/data/mockData";
import { Candidate } from "@/types/assessment";
import { ImageComparisonModal } from "@/components/ImageComparisonModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, UserCheck, Clock } from "lucide-react";

const HeadshotApproval = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidateList, setCandidateList] = useState(candidates);

  const schedule = schedules.find((s) => s.id === scheduleId);
  const pendingCandidates = candidateList.filter(
    (c) => c.scheduleId === scheduleId && c.status === "pending"
  );

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
            <Badge variant="outline" className="text-base px-4 py-2">
              <UserCheck className="w-4 h-4 mr-2" />
              {pendingCandidates.length} Pending
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-card rounded-lg border">
          {pendingCandidates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell className="text-muted-foreground">{candidate.email}</TableCell>
                    <TableCell>
                      {new Date(candidate.submittedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">All approvals complete</h3>
              <p className="text-muted-foreground">
                There are no pending headshot approvals for this schedule
              </p>
            </div>
          )}
        </div>
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
