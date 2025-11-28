import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCheck, X } from "lucide-react";
import { toast } from "sonner";

interface Candidate {
  id: string;
  name: string;
  email: string;
  testCompleted: boolean;
}

interface Marker {
  id: string;
  name: string;
  email: string;
  assignedCount: number;
}

const mockMarkers: Marker[] = [
  { id: "m1", name: "Dr. Sarah Wilson", email: "sarah.w@example.com", assignedCount: 12 },
  { id: "m2", name: "Prof. Michael Brown", email: "m.brown@example.com", assignedCount: 8 },
  { id: "m3", name: "Dr. Emily Chen", email: "emily.c@example.com", assignedCount: 15 },
  { id: "m4", name: "Prof. David Kumar", email: "d.kumar@example.com", assignedCount: 10 },
];

const mockCandidates: Candidate[] = [
  { id: "c1", name: "John Smith", email: "john.s@example.com", testCompleted: true },
  { id: "c2", name: "Sarah Johnson", email: "sarah.j@example.com", testCompleted: true },
  { id: "c3", name: "Mike Chen", email: "mike.c@example.com", testCompleted: true },
  { id: "c4", name: "Emma Wilson", email: "emma.w@example.com", testCompleted: false },
  { id: "c5", name: "Alex Rodriguez", email: "alex.r@example.com", testCompleted: true },
];

interface MarkerAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  scheduleId: string;
  scheduleName: string;
}

export const MarkerAssignmentDialog = ({
  open,
  onClose,
  scheduleId,
  scheduleName,
}: MarkerAssignmentDialogProps) => {
  const [selectedMarker, setSelectedMarker] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const handleToggleCandidate = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleToggleAll = () => {
    const completedCandidates = mockCandidates
      .filter((c) => c.testCompleted)
      .map((c) => c.id);
    
    if (selectedCandidates.length === completedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(completedCandidates);
    }
  };

  const handleAssign = () => {
    if (!selectedMarker || selectedCandidates.length === 0) {
      toast.error("Please select a marker and at least one candidate");
      return;
    }

    const marker = mockMarkers.find((m) => m.id === selectedMarker);
    toast.success(
      `Assigned ${selectedCandidates.length} candidate(s) to ${marker?.name}`
    );
    onClose();
  };

  const completedCandidates = mockCandidates.filter((c) => c.testCompleted);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Marker to Candidates</DialogTitle>
          <DialogDescription>
            Schedule: {scheduleName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="marker-select">Select Marker</Label>
            <Select value={selectedMarker} onValueChange={setSelectedMarker}>
              <SelectTrigger id="marker-select">
                <SelectValue placeholder="Choose a marker" />
              </SelectTrigger>
              <SelectContent>
                {mockMarkers.map((marker) => (
                  <SelectItem key={marker.id} value={marker.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{marker.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {marker.email}
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        {marker.assignedCount} assigned
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Candidates (Test Completed Only)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleAll}
              >
                {selectedCandidates.length === completedCandidates.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <ScrollArea className="h-64 border rounded-md p-4">
              <div className="space-y-3">
                {mockCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-start space-x-3 p-3 rounded-md hover:bg-accent"
                  >
                    <Checkbox
                      id={`candidate-${candidate.id}`}
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={() => handleToggleCandidate(candidate.id)}
                      disabled={!candidate.testCompleted}
                    />
                    <div className="flex-1 space-y-1">
                      <label
                        htmlFor={`candidate-${candidate.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {candidate.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {candidate.email}
                      </p>
                    </div>
                    <Badge
                      variant={candidate.testCompleted ? "default" : "secondary"}
                    >
                      {candidate.testCompleted ? "Completed" : "Not Completed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground">
              {selectedCandidates.length} candidate(s) selected
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>
              <UserCheck className="mr-2 h-4 w-4" />
              Assign Marker
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
