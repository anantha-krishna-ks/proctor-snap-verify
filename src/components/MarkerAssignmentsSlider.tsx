import { useState, useMemo } from "react";
import { Schedule } from "@/types/assessment";
import { candidates } from "@/data/mockData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, User, CheckCircle2, XCircle, Clock, UserPlus, Users, 
  Zap, Eye, ChevronDown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  { id: "m5", name: "Dr. Lisa Anderson", email: "l.anderson@example.com", assignedCount: 5 },
];

interface MarkerAssignmentsSliderProps {
  open: boolean;
  onClose: () => void;
  schedule: Schedule;
}

type StatusFilter = "all" | "not_started" | "in_progress" | "completed";

export const MarkerAssignmentsSlider = ({
  open,
  onClose,
  schedule,
}: MarkerAssignmentsSliderProps) => {
  // Get all candidates for this schedule
  const allScheduleCandidates = candidates.filter((c) => c.scheduleId === schedule.id);
  const completedTestCandidates = allScheduleCandidates.filter((c) => c.testCompleted);
  
  // State
  const [markerSearch, setMarkerSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [assigningToMarker, setAssigningToMarker] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [candidateSearch, setCandidateSearch] = useState("");
  const [selectedMarkers, setSelectedMarkers] = useState<Set<string>>(new Set());
  const [assignments, setAssignments] = useState<Record<string, string[]>>(() => {
    // Initialize from existing assignments or empty
    const initial: Record<string, string[]> = {};
    mockMarkers.forEach(m => {
      initial[m.id] = [];
    });
    // Simulate some existing assignments based on candidate data
    completedTestCandidates.forEach(c => {
      if (c.markerId && initial[c.markerId]) {
        initial[c.markerId].push(c.id);
      }
    });
    return initial;
  });

  // Toggle marker selection
  const handleToggleMarker = (markerId: string) => {
    setSelectedMarkers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(markerId)) {
        newSet.delete(markerId);
      } else {
        newSet.add(markerId);
      }
      return newSet;
    });
  };

  const handleSelectAllMarkers = () => {
    if (selectedMarkers.size === filteredMarkers.length) {
      setSelectedMarkers(new Set());
    } else {
      setSelectedMarkers(new Set(filteredMarkers.map(m => m.id)));
    }
  };

  // Filter markers
  const filteredMarkers = mockMarkers.filter(
    (m) =>
      m.name.toLowerCase().includes(markerSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(markerSearch.toLowerCase())
  );

  // Get assigned candidates for a marker with status filter
  const getMarkerCandidates = (markerId: string) => {
    const assignedIds = assignments[markerId] || [];
    let markerCandidates = completedTestCandidates.filter(c => assignedIds.includes(c.id));
    
    if (statusFilter !== "all") {
      markerCandidates = markerCandidates.filter(c => c.evaluationStatus === statusFilter);
    }
    
    return markerCandidates;
  };

  // Get unassigned candidates
  const unassignedCandidates = useMemo(() => {
    const allAssigned = Object.values(assignments).flat();
    return completedTestCandidates.filter(c => !allAssigned.includes(c.id));
  }, [assignments, completedTestCandidates]);

  // Filter unassigned candidates for assignment modal
  const filteredUnassignedCandidates = unassignedCandidates.filter(
    c =>
      c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  // Handlers
  const handleAutoDistribute = () => {
    const selectedMarkersList = mockMarkers.filter(m => selectedMarkers.has(m.id));
    if (selectedMarkersList.length < 2) {
      toast.error("Select at least 2 markers to auto-distribute");
      return;
    }

    const newAssignments: Record<string, string[]> = { ...assignments };
    // Reset only selected markers
    selectedMarkersList.forEach((m) => {
      newAssignments[m.id] = [];
    });

    // Get unassigned + assigned to selected markers
    const candidatesToDistribute = completedTestCandidates.filter(c => {
      const currentAssignedTo = Object.entries(assignments).find(([, ids]) => ids.includes(c.id))?.[0];
      return !currentAssignedTo || selectedMarkers.has(currentAssignedTo);
    });

    candidatesToDistribute.forEach((candidate, index) => {
      const markerIndex = index % selectedMarkersList.length;
      const markerId = selectedMarkersList[markerIndex].id;
      newAssignments[markerId].push(candidate.id);
    });

    setAssignments(newAssignments);
    toast.success(
      `Auto-distributed ${candidatesToDistribute.length} candidates among ${selectedMarkersList.length} markers`
    );
    setSelectedMarkers(new Set());
  };

  const handleAssignCandidates = () => {
    if (!assigningToMarker || selectedCandidates.size === 0) return;

    setAssignments(prev => ({
      ...prev,
      [assigningToMarker]: [...(prev[assigningToMarker] || []), ...Array.from(selectedCandidates)]
    }));

    const markerName = mockMarkers.find(m => m.id === assigningToMarker)?.name;
    toast.success(`Assigned ${selectedCandidates.size} candidate(s) to ${markerName}`);
    
    setSelectedCandidates(new Set());
    setAssigningToMarker(null);
    setCandidateSearch("");
  };

  const handleToggleCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  };

  const handleSelectAllUnassigned = () => {
    if (selectedCandidates.size === filteredUnassignedCandidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(filteredUnassignedCandidates.map(c => c.id)));
    }
  };

  const handleUnassignCandidate = (markerId: string, candidateId: string) => {
    setAssignments(prev => ({
      ...prev,
      [markerId]: prev[markerId].filter(id => id !== candidateId)
    }));
    toast.success("Candidate unassigned");
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="text-xs gap-1 bg-green-600">
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

  const getTotalAssigned = () => Object.values(assignments).flat().length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Assign Markers</SheetTitle>
              <SheetDescription>
                {schedule.scheduleName} • {completedTestCandidates.length} candidates ready
              </SheetDescription>
            </div>
            <Button 
              onClick={handleAutoDistribute} 
              className="gap-2"
              disabled={selectedMarkers.size < 2}
            >
              <Zap className="w-4 h-4" />
              Auto Distribute {selectedMarkers.size > 0 && `(${selectedMarkers.size})`}
            </Button>
          </div>
        </SheetHeader>

        {/* Stats Summary */}
        <div className="flex items-center gap-4 px-6 py-2 bg-muted/30 border-b text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{completedTestCandidates.length}</span>
            <span className="text-muted-foreground">total</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-600">{getTotalAssigned()}</span>
            <span className="text-muted-foreground">assigned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="font-medium text-orange-600">{unassignedCandidates.length}</span>
            <span className="text-muted-foreground">unassigned</span>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-2 border-b flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search markers..."
              value={markerSearch}
              onChange={(e) => setMarkerSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSelectAllMarkers}
            className="shrink-0"
          >
            {selectedMarkers.size === filteredMarkers.length && filteredMarkers.length > 0
              ? "Deselect All"
              : "Select All"}
          </Button>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-[140px] h-9">
              <Eye className="w-4 h-4 mr-2" />
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not_started">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Markers List with Accordions */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <Accordion type="multiple" className="space-y-3">
              {filteredMarkers.map((marker) => {
                const markerCandidates = getMarkerCandidates(marker.id);
                const totalAssignedToMarker = (assignments[marker.id] || []).length;
                
                return (
                  <AccordionItem
                    key={marker.id}
                    value={marker.id}
                    className="border rounded-lg bg-card overflow-hidden"
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Checkbox
                        checked={selectedMarkers.has(marker.id)}
                        onCheckedChange={() => handleToggleMarker(marker.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0"
                      />
                      <AccordionTrigger className="flex-1 hover:no-underline p-0 [&>svg]:hidden">
                        <div className="flex items-center gap-3 w-full">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {marker.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{marker.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{marker.email}</div>
                          </div>
                          <Badge variant="secondary" className="text-xs font-semibold shrink-0">
                            {totalAssignedToMarker} assigned
                          </Badge>
                          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200" />
                        </div>
                      </AccordionTrigger>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssigningToMarker(marker.id);
                        }}
                        className="gap-1.5 shrink-0 h-8 text-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Assign
                      </Button>
                    </div>
                    
                    <AccordionContent className="px-4 pb-4 pt-0">
                      <Separator className="mb-3" />
                      {markerCandidates.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                          {totalAssignedToMarker === 0 
                            ? "No candidates assigned yet" 
                            : "No candidates match the current filter"}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {markerCandidates.map((candidate) => (
                            <div
                              key={candidate.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={candidate.profileImageUrl} />
                                <AvatarFallback>
                                  {candidate.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{candidate.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{candidate.email}</div>
                              </div>
                              {getStatusBadge(candidate.evaluationStatus)}
                              {candidate.evaluationStatus !== "completed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-destructive hover:text-destructive"
                                  onClick={() => handleUnassignCandidate(marker.id, candidate.id)}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {filteredMarkers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No markers found</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Assignment Modal/Panel */}
        {assigningToMarker && (
          <div className="absolute inset-0 bg-background flex flex-col z-10">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Assign Candidates</h3>
                <p className="text-sm text-muted-foreground">
                  to {mockMarkers.find(m => m.id === assigningToMarker)?.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAssigningToMarker(null);
                    setSelectedCandidates(new Set());
                    setCandidateSearch("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignCandidates}
                  disabled={selectedCandidates.size === 0}
                  className="gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Assign ({selectedCandidates.size})
                </Button>
              </div>
            </div>

            <div className="px-6 py-3 border-b flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search unassigned candidates..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleSelectAllUnassigned}>
                {selectedCandidates.size === filteredUnassignedCandidates.length && filteredUnassignedCandidates.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {filteredUnassignedCandidates.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>All candidates are assigned</p>
                  </div>
                ) : (
                  filteredUnassignedCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedCandidates.has(candidate.id)
                          ? "bg-primary/5 border-primary"
                          : "bg-card hover:bg-muted/50"
                      )}
                      onClick={() => handleToggleCandidate(candidate.id)}
                    >
                      <Checkbox
                        checked={selectedCandidates.has(candidate.id)}
                        onCheckedChange={() => handleToggleCandidate(candidate.id)}
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
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
