import { useState, useMemo } from "react";
import { Schedule } from "@/types/assessment";
import { candidates } from "@/data/mockData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, User, CheckCircle2, XCircle, Clock, UserPlus, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface MarkerAssignmentsSliderProps {
  open: boolean;
  onClose: () => void;
  schedule: Schedule;
}

type AssignmentFilter = "all" | "assigned" | "unassigned";
type StatusFilter = "all" | "not_started" | "in_progress" | "completed";

export const MarkerAssignmentsSlider = ({
  open,
  onClose,
  schedule,
}: MarkerAssignmentsSliderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [targetMarker, setTargetMarker] = useState<string>("");
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { toast } = useToast();

  // Get all candidates for this schedule
  const allScheduleCandidates = candidates.filter((c) => c.scheduleId === schedule.id);
  
  // Separate assigned and unassigned
  const assignedCandidates = allScheduleCandidates.filter((c) => c.markerId);
  const unassignedCandidates = allScheduleCandidates.filter((c) => !c.markerId);

  // Apply filters
  const filteredCandidates = useMemo(() => {
    let filtered = allScheduleCandidates;

    // Assignment filter
    if (assignmentFilter === "assigned") {
      filtered = filtered.filter((c) => c.markerId);
    } else if (assignmentFilter === "unassigned") {
      filtered = filtered.filter((c) => !c.markerId);
    }

    // Status filter (only for assigned candidates)
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.evaluationStatus === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allScheduleCandidates, assignmentFilter, statusFilter, searchQuery]);

  // Get marker progress stats
  const markerStats = useMemo(() => {
    return schedule.assignedMarkers?.map((marker) => {
      const markerCandidates = assignedCandidates.filter((c) => c.markerId === marker.markerId);
      const completed = markerCandidates.filter((c) => c.evaluationStatus === "completed").length;
      const inProgress = markerCandidates.filter((c) => c.evaluationStatus === "in_progress").length;
      const notStarted = markerCandidates.filter((c) => c.evaluationStatus === "not_started").length;
      return {
        ...marker,
        total: markerCandidates.length,
        completed,
        inProgress,
        notStarted,
        progress: markerCandidates.length > 0 ? (completed / markerCandidates.length) * 100 : 0,
      };
    }) || [];
  }, [schedule.assignedMarkers, assignedCandidates]);

  const handleToggleCandidate = (candidateId: string) => {
    const candidate = allScheduleCandidates.find((c) => c.id === candidateId);
    
    // Prevent selecting completed candidates for reassignment
    if (candidate?.evaluationStatus === "completed") {
      toast({
        title: "Cannot reassign",
        description: "Completed evaluations cannot be reassigned.",
        variant: "destructive",
      });
      return;
    }

    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const handleAssignOrReassign = () => {
    if (selectedCandidates.size === 0) {
      toast({
        title: "No candidates selected",
        description: "Please select at least one candidate.",
        variant: "destructive",
      });
      return;
    }

    if (!targetMarker) {
      toast({
        title: "No marker selected",
        description: "Please select a marker to assign candidates to.",
        variant: "destructive",
      });
      return;
    }

    const markerName = schedule.assignedMarkers?.find(
      (m) => m.markerId === targetMarker
    )?.markerName;

    const hasUnassigned = Array.from(selectedCandidates).some(
      (id) => !allScheduleCandidates.find((c) => c.id === id)?.markerId
    );

    toast({
      title: hasUnassigned ? "Candidates assigned" : "Candidates reassigned",
      description: `Successfully ${hasUnassigned ? "assigned" : "reassigned"} ${selectedCandidates.size} candidate(s) to ${markerName}`,
    });

    setSelectedCandidates(new Set());
    setTargetMarker("");
  };

  const handleSelectAll = () => {
    const selectableCandidates = filteredCandidates.filter(
      (c) => c.evaluationStatus !== "completed"
    );
    
    if (selectedCandidates.size === selectableCandidates.length && selectableCandidates.length > 0) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(selectableCandidates.map((c) => c.id)));
    }
  };

  const getStatusBadge = (candidate: typeof allScheduleCandidates[0]) => {
    if (!candidate.markerId) {
      return (
        <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
          Unassigned
        </Badge>
      );
    }
    
    switch (candidate.evaluationStatus) {
      case "completed":
        return (
          <Badge variant="default" className="text-xs gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Evaluated
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary" className="text-xs gap-1">
            <Clock className="w-3 h-3" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs gap-1">
            <XCircle className="w-3 h-3" />
            Pending
          </Badge>
        );
    }
  };

  const selectableCandidatesCount = filteredCandidates.filter(
    (c) => c.evaluationStatus !== "completed"
  ).length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-xl">Candidate Assignment Manager</SheetTitle>
          <div className="text-sm text-muted-foreground">{schedule.scheduleName}</div>
        </SheetHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-3 p-4 bg-muted/30 border-b">
            <div className="text-center">
              <div className="text-2xl font-bold">{allScheduleCandidates.length}</div>
              <div className="text-xs text-muted-foreground">Total Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{assignedCandidates.length}</div>
              <div className="text-xs text-muted-foreground">Assigned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{unassignedCandidates.length}</div>
              <div className="text-xs text-muted-foreground">Unassigned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{schedule.assignedMarkers?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Markers</div>
            </div>
          </div>

          {/* Marker Progress Cards */}
          {markerStats.length > 0 && (
            <div className="p-4 border-b space-y-3">
              <div className="text-sm font-medium">Marker Progress</div>
              <div className="grid grid-cols-2 gap-3">
                {markerStats.map((marker) => (
                  <div key={marker.markerId} className="p-3 bg-muted/30 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">{marker.markerName}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {marker.total} assigned
                      </Badge>
                    </div>
                    <Progress value={marker.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{marker.completed} completed</span>
                      <span>{marker.inProgress} in progress</span>
                      <span>{marker.notStarted} pending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={assignmentFilter} onValueChange={(v) => setAssignmentFilter(v as AssignmentFilter)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Candidates</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_started">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Selection Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedCandidates.size === selectableCandidatesCount && selectableCandidatesCount > 0
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {filteredCandidates.length} candidates shown
                </span>
              </div>

              {selectedCandidates.size > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedCandidates.size} selected</Badge>
                  <Select value={targetMarker} onValueChange={setTargetMarker}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Assign to marker..." />
                    </SelectTrigger>
                    <SelectContent>
                      {schedule.assignedMarkers?.map((marker) => (
                        <SelectItem key={marker.markerId} value={marker.markerId}>
                          {marker.markerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAssignOrReassign} size="sm" className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Assign
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Candidates List */}
          <ScrollArea className="flex-1">
            <div className="p-4 grid grid-cols-2 gap-3">
              {filteredCandidates.map((candidate) => {
                const isCompleted = candidate.evaluationStatus === "completed";
                const isSelected = selectedCandidates.has(candidate.id);
                
                return (
                  <div
                    key={candidate.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-primary/5 border-primary/30"
                        : "bg-card hover:bg-muted/50 border-border"
                    } ${isCompleted ? "opacity-60" : ""}`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleCandidate(candidate.id)}
                      disabled={isCompleted}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={candidate.profileImageUrl} />
                      <AvatarFallback>
                        {candidate.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{candidate.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{candidate.email}</div>
                      {candidate.markerId && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3" />
                          {candidate.markerName}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(candidate)}
                    </div>
                  </div>
                );
              })}

              {filteredCandidates.length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  No candidates found matching your filters
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
