import { useState } from "react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { UserCheck, CalendarIcon, AlertTriangle, Bell, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Candidate {
  id: string;
  name: string;
  email: string;
  testCompleted: boolean;
  currentMarkerId?: string;
  currentMarkerName?: string;
}

interface Marker {
  id: string;
  name: string;
  email: string;
  assignedCount: number;
  maxCapacity: number;
  currentWorkload: number; // percentage
}

const mockMarkers: Marker[] = [
  { id: "m1", name: "Dr. Sarah Wilson", email: "sarah.w@example.com", assignedCount: 12, maxCapacity: 20, currentWorkload: 60 },
  { id: "m2", name: "Prof. Michael Brown", email: "m.brown@example.com", assignedCount: 8, maxCapacity: 15, currentWorkload: 53 },
  { id: "m3", name: "Dr. Emily Chen", email: "emily.c@example.com", assignedCount: 15, maxCapacity: 20, currentWorkload: 75 },
  { id: "m4", name: "Prof. David Kumar", email: "d.kumar@example.com", assignedCount: 10, maxCapacity: 25, currentWorkload: 40 },
];

const mockCandidates: Candidate[] = [
  { id: "c1", name: "John Smith", email: "john.s@example.com", testCompleted: true },
  { id: "c2", name: "Sarah Johnson", email: "sarah.j@example.com", testCompleted: true, currentMarkerId: "m1", currentMarkerName: "Dr. Sarah Wilson" },
  { id: "c3", name: "Mike Chen", email: "mike.c@example.com", testCompleted: true },
  { id: "c4", name: "Emma Wilson", email: "emma.w@example.com", testCompleted: false },
  { id: "c5", name: "Alex Rodriguez", email: "alex.r@example.com", testCompleted: true, currentMarkerId: "m2", currentMarkerName: "Prof. Michael Brown" },
  { id: "c6", name: "Lisa Park", email: "lisa.p@example.com", testCompleted: true },
  { id: "c7", name: "James Taylor", email: "james.t@example.com", testCompleted: true },
];

type AssignmentMode = "new" | "reassign" | "all";
type Priority = "normal" | "high" | "urgent";

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
  const [deadline, setDeadline] = useState<Date>();
  const [assignmentMode, setAssignmentMode] = useState<AssignmentMode>("new");
  const [priority, setPriority] = useState<Priority>("normal");
  const [sendReminder, setSendReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState("2");

  const handleToggleCandidate = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const getFilteredCandidates = () => {
    return mockCandidates.filter((c) => {
      if (!c.testCompleted) return false;
      if (assignmentMode === "new") return !c.currentMarkerId;
      if (assignmentMode === "reassign") return !!c.currentMarkerId;
      return true; // "all" mode
    });
  };

  const handleToggleAll = () => {
    const filteredCandidates = getFilteredCandidates().map((c) => c.id);
    
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates);
    }
  };

  const handleAssign = () => {
    if (!selectedMarker || selectedCandidates.length === 0) {
      toast.error("Please select a marker and at least one candidate");
      return;
    }

    if (!deadline) {
      toast.error("Please select a deadline for completion");
      return;
    }

    const marker = mockMarkers.find((m) => m.id === selectedMarker);
    const reassignedCount = selectedCandidates.filter(
      (cId) => mockCandidates.find((c) => c.id === cId)?.currentMarkerId
    ).length;

    const message = reassignedCount > 0
      ? `Assigned ${selectedCandidates.length} candidate(s) to ${marker?.name} (${reassignedCount} reassigned). Deadline: ${format(deadline, "PPP")}`
      : `Assigned ${selectedCandidates.length} candidate(s) to ${marker?.name}. Deadline: ${format(deadline, "PPP")}`;

    toast.success(message);
    
    // Reset form
    setSelectedMarker("");
    setSelectedCandidates([]);
    setDeadline(undefined);
    setPriority("normal");
    onClose();
  };

  const filteredCandidates = getFilteredCandidates();
  const selectedMarkerData = mockMarkers.find((m) => m.id === selectedMarker);
  const wouldExceedCapacity = selectedMarkerData && 
    (selectedMarkerData.assignedCount + selectedCandidates.length) > selectedMarkerData.maxCapacity;

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case "urgent": return "text-red-600 bg-red-100 border-red-200";
      case "high": return "text-orange-600 bg-orange-100 border-orange-200";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return "bg-red-500";
    if (workload >= 60) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Marker to Candidates</DialogTitle>
          <DialogDescription>
            Schedule: {scheduleName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignment Mode */}
          <div className="space-y-2">
            <Label>Assignment Mode</Label>
            <div className="flex gap-2">
              <Button
                variant={assignmentMode === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setAssignmentMode("new");
                  setSelectedCandidates([]);
                }}
              >
                New Assignments
              </Button>
              <Button
                variant={assignmentMode === "reassign" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setAssignmentMode("reassign");
                  setSelectedCandidates([]);
                }}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reassign
              </Button>
              <Button
                variant={assignmentMode === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setAssignmentMode("all");
                  setSelectedCandidates([]);
                }}
              >
                All Candidates
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {assignmentMode === "new" && "Show only candidates without an assigned marker"}
              {assignmentMode === "reassign" && "Show only candidates already assigned to a marker (for reassignment)"}
              {assignmentMode === "all" && "Show all candidates who completed the test"}
            </p>
          </div>

          {/* Marker Selection with Workload */}
          <div className="space-y-2">
            <Label htmlFor="marker-select">Select Marker</Label>
            <Select value={selectedMarker} onValueChange={setSelectedMarker}>
              <SelectTrigger id="marker-select">
                <SelectValue placeholder="Choose a marker" />
              </SelectTrigger>
              <SelectContent>
                {mockMarkers.map((marker) => (
                  <SelectItem key={marker.id} value={marker.id}>
                    <div className="flex flex-col w-full py-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{marker.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {marker.assignedCount}/{marker.maxCapacity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress 
                          value={marker.currentWorkload} 
                          className="h-1.5 flex-1"
                        />
                        <span className={cn(
                          "text-xs",
                          marker.currentWorkload >= 80 ? "text-red-600" : 
                          marker.currentWorkload >= 60 ? "text-orange-600" : "text-green-600"
                        )}>
                          {marker.currentWorkload}%
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {wouldExceedCapacity && (
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                This assignment would exceed the marker's capacity
              </div>
            )}
          </div>

          {/* Deadline with Date Picker */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Deadline
                </div>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Select deadline"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Checkbox
                id="send-reminder"
                checked={sendReminder}
                onCheckedChange={(checked) => setSendReminder(checked === true)}
              />
              <div>
                <Label htmlFor="send-reminder" className="cursor-pointer flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Send deadline reminder
                </Label>
                <p className="text-xs text-muted-foreground">
                  Notify marker before deadline
                </p>
              </div>
            </div>
            {sendReminder && (
              <Select value={reminderDays} onValueChange={setReminderDays}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="2">2 days before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="7">1 week before</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Candidate Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                Select Candidates 
                <span className="text-muted-foreground ml-1">
                  ({filteredCandidates.length} available)
                </span>
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleAll}
                disabled={filteredCandidates.length === 0}
              >
                {selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <ScrollArea className="h-56 border rounded-md p-4">
              {filteredCandidates.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No candidates available for this mode
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-md hover:bg-accent transition-colors",
                        selectedCandidates.includes(candidate.id) && "bg-accent"
                      )}
                    >
                      <Checkbox
                        id={`candidate-${candidate.id}`}
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={() => handleToggleCandidate(candidate.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`candidate-${candidate.id}`}
                          className="text-sm font-medium cursor-pointer block truncate"
                        >
                          {candidate.name}
                        </label>
                        <p className="text-xs text-muted-foreground truncate">
                          {candidate.email}
                        </p>
                      </div>
                      {candidate.currentMarkerName && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          {candidate.currentMarkerName.split(" ")[0]}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{selectedCandidates.length} candidate(s) selected</span>
              {priority !== "normal" && (
                <Badge variant="outline" className={getPriorityColor(priority)}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={!selectedMarker || selectedCandidates.length === 0 || !deadline}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              {assignmentMode === "reassign" ? "Reassign Marker" : "Assign Marker"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};