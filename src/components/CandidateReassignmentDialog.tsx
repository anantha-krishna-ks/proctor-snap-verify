import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, UserCheck, AlertTriangle } from "lucide-react";
import { Candidate, Schedule } from "@/types/assessment";
import { toast } from "sonner";

interface CandidateReassignmentDialogProps {
  open: boolean;
  onClose: () => void;
  schedule: Schedule;
  assignedCandidates: Candidate[];
}

export const CandidateReassignmentDialog = ({
  open,
  onClose,
  schedule,
  assignedCandidates,
}: CandidateReassignmentDialogProps) => {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [targetMarkerId, setTargetMarkerId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = assignedCandidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.markerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCandidateSelection = (candidateId: string) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.size === filteredCandidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(filteredCandidates.map((c) => c.id)));
    }
  };

  const handleReassign = () => {
    if (selectedCandidates.size === 0) {
      toast.error("Please select at least one candidate to reassign");
      return;
    }

    if (!targetMarkerId) {
      toast.error("Please select a marker to reassign candidates to");
      return;
    }

    const targetMarker = schedule.assignedMarkers?.find(
      (m) => m.markerId === targetMarkerId
    );

    // Check if any selected candidate is already assigned to the target marker
    const alreadyAssigned = assignedCandidates
      .filter((c) => selectedCandidates.has(c.id) && c.markerId === targetMarkerId)
      .map((c) => c.name);

    if (alreadyAssigned.length > 0) {
      toast.error(
        `The following candidates are already assigned to ${targetMarker?.markerName}: ${alreadyAssigned.join(", ")}`
      );
      return;
    }

    toast.success(
      `Successfully reassigned ${selectedCandidates.size} candidate(s) to ${targetMarker?.markerName}`
    );

    // Reset state
    setSelectedCandidates(new Set());
    setTargetMarkerId("");
    onClose();
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

  // Group candidates by current marker
  const candidatesByMarker = filteredCandidates.reduce((acc, candidate) => {
    const markerId = candidate.markerId || "unassigned";
    const markerName = candidate.markerName || "Unassigned";
    if (!acc[markerId]) {
      acc[markerId] = { markerName, candidates: [] };
    }
    acc[markerId].candidates.push(candidate);
    return acc;
  }, {} as Record<string, { markerName: string; candidates: Candidate[] }>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Reassign Candidates</DialogTitle>
          <DialogDescription>
            Schedule: {schedule.scheduleName} - Select candidates to reassign to a
            different marker
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Selection Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectAll}
            >
              {selectedCandidates.size === filteredCandidates.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>

          {/* Selected Count and Target Marker */}
          {selectedCandidates.size > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {selectedCandidates.size} candidate(s) selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Reassign to:
                  </span>
                  <Select value={targetMarkerId} onValueChange={setTargetMarkerId}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select marker" />
                    </SelectTrigger>
                    <SelectContent>
                      {schedule.assignedMarkers?.map((marker) => (
                        <SelectItem key={marker.markerId} value={marker.markerId}>
                          {marker.markerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Candidates List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {Object.entries(candidatesByMarker).map(([markerId, { markerName, candidates }]) => (
                <div key={markerId} className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {markerName}
                    </span>
                    <Badge variant="outline">{candidates.length} candidates</Badge>
                  </div>

                  <div className="space-y-2">
                    {candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedCandidates.has(candidate.id)}
                          onCheckedChange={() => toggleCandidateSelection(candidate.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">
                              {candidate.name}
                            </span>
                            {getStatusBadge(candidate.evaluationStatus || "not_started")}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {candidate.email}
                          </div>
                        </div>
                        {candidate.evaluationStatus === "in_progress" && (
                          <div className="flex items-center gap-1 text-amber-600 text-xs">
                            <AlertTriangle className="h-3 w-3" />
                            In Progress
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredCandidates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery
                    ? "No candidates found matching your search"
                    : "No assigned candidates found"}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleReassign}
            disabled={selectedCandidates.size === 0 || !targetMarkerId}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Reassign {selectedCandidates.size > 0 && `(${selectedCandidates.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
