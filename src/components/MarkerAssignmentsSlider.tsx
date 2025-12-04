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
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, User, CheckCircle2, XCircle, Clock, UserPlus, Users, 
  Zap, ChevronRight, ChevronLeft, UserCheck, Settings 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
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

type AssignmentFilter = "all" | "assigned" | "unassigned";
type StatusFilter = "all" | "not_started" | "in_progress" | "completed";
type ViewMode = "initial-assignment" | "management";

export const MarkerAssignmentsSlider = ({
  open,
  onClose,
  schedule,
}: MarkerAssignmentsSliderProps) => {
  const { toast: shadcnToast } = useToast();
  
  // Get all candidates for this schedule
  const allScheduleCandidates = candidates.filter((c) => c.scheduleId === schedule.id);
  const completedTestCandidates = allScheduleCandidates.filter((c) => c.testCompleted);
  
  // Determine initial view mode based on whether markers are already assigned
  const hasExistingAssignments = (schedule.assignedMarkers?.length || 0) > 0;
  
  // Common state
  const [viewMode, setViewMode] = useState<ViewMode>(hasExistingAssignments ? "management" : "initial-assignment");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Initial assignment flow state
  const [currentStep, setCurrentStep] = useState(1);
  const [assignmentMethod, setAssignmentMethod] = useState<"manual" | "auto" | null>(null);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [markerSearch, setMarkerSearch] = useState("");
  const [initialAssignments, setInitialAssignments] = useState<Record<string, string[]>>({});
  const [selectedForAssignment, setSelectedForAssignment] = useState<string[]>([]);
  const [manualAssignToMarker, setManualAssignToMarker] = useState<string>("");
  
  // Management mode state
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [targetMarker, setTargetMarker] = useState<string>("");
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const steps = [
    { number: 1, title: "Select Markers", icon: UserCheck },
    { number: 2, title: "Assignment Method", icon: Zap },
    { number: 3, title: "Assign Candidates", icon: UserPlus },
    { number: 4, title: "Review & Confirm", icon: CheckCircle2 },
  ];

  // Filter markers for selection
  const filteredMarkers = mockMarkers.filter(
    (m) =>
      m.name.toLowerCase().includes(markerSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(markerSearch.toLowerCase())
  );

  // Filter candidates for initial assignment
  const filteredInitialCandidates = completedTestCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate assigned and unassigned for management mode
  const assignedCandidates = allScheduleCandidates.filter((c) => c.markerId);
  const unassignedCandidates = allScheduleCandidates.filter((c) => !c.markerId);

  // Apply filters for management mode
  const filteredManagementCandidates = useMemo(() => {
    let filtered = allScheduleCandidates;

    if (assignmentFilter === "assigned") {
      filtered = filtered.filter((c) => c.markerId);
    } else if (assignmentFilter === "unassigned") {
      filtered = filtered.filter((c) => !c.markerId);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.evaluationStatus === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allScheduleCandidates, assignmentFilter, statusFilter, searchQuery]);

  // Marker progress stats for management mode
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

  // Initial assignment handlers
  const handleToggleMarker = (markerId: string) => {
    setSelectedMarkers((prev) =>
      prev.includes(markerId)
        ? prev.filter((id) => id !== markerId)
        : [...prev, markerId]
    );
  };

  const handleToggleCandidateForAssignment = (candidateId: string) => {
    setSelectedForAssignment((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleAutoDistribute = () => {
    if (selectedMarkers.length === 0) {
      toast.error("Please select at least one marker");
      return;
    }

    const newAssignments: Record<string, string[]> = {};
    selectedMarkers.forEach((markerId) => {
      newAssignments[markerId] = [];
    });

    completedTestCandidates.forEach((candidate, index) => {
      const markerIndex = index % selectedMarkers.length;
      const markerId = selectedMarkers[markerIndex];
      newAssignments[markerId].push(candidate.id);
    });

    setInitialAssignments(newAssignments);
    toast.success(
      `Auto-distributed ${completedTestCandidates.length} candidates among ${selectedMarkers.length} markers`
    );
  };

  const handleManualAssign = () => {
    if (selectedForAssignment.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }
    if (!manualAssignToMarker) {
      toast.error("Please select a marker to assign to");
      return;
    }

    setInitialAssignments((prev) => {
      const updated = { ...prev };
      if (!updated[manualAssignToMarker]) {
        updated[manualAssignToMarker] = [];
      }
      
      Object.keys(updated).forEach((markerId) => {
        updated[markerId] = updated[markerId].filter(
          (cId) => !selectedForAssignment.includes(cId)
        );
      });
      
      updated[manualAssignToMarker] = [
        ...updated[manualAssignToMarker],
        ...selectedForAssignment,
      ];
      
      return updated;
    });

    toast.success(
      `Assigned ${selectedForAssignment.length} candidate(s) to ${mockMarkers.find((m) => m.id === manualAssignToMarker)?.name}`
    );
    setSelectedForAssignment([]);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedMarkers.length === 0) {
      toast.error("Please select at least one marker");
      return;
    }
    if (currentStep === 2 && !assignmentMethod) {
      toast.error("Please select an assignment method");
      return;
    }
    if (currentStep === 3 && assignmentMethod === "manual") {
      const totalAssigned = Object.values(initialAssignments).reduce((sum, arr) => sum + arr.length, 0);
      if (totalAssigned === 0) {
        toast.error("Please assign at least one candidate");
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitInitialAssignment = () => {
    const totalAssigned = Object.values(initialAssignments).reduce(
      (sum, arr) => sum + arr.length,
      0
    );

    if (totalAssigned === 0) {
      toast.error("No candidates assigned. Use auto-distribute or manual assignment.");
      return;
    }

    toast.success(`Successfully assigned ${totalAssigned} candidates to ${selectedMarkers.length} markers`);
    onClose();
  };

  const getMarkerAssignmentCount = (markerId: string) => {
    return initialAssignments[markerId]?.length || 0;
  };

  // Management mode handlers
  const handleToggleCandidateManagement = (candidateId: string) => {
    const candidate = allScheduleCandidates.find((c) => c.id === candidateId);
    
    if (candidate?.evaluationStatus === "completed") {
      shadcnToast({
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
      shadcnToast({
        title: "No candidates selected",
        description: "Please select at least one candidate.",
        variant: "destructive",
      });
      return;
    }

    if (!targetMarker) {
      shadcnToast({
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

    shadcnToast({
      title: hasUnassigned ? "Candidates assigned" : "Candidates reassigned",
      description: `Successfully ${hasUnassigned ? "assigned" : "reassigned"} ${selectedCandidates.size} candidate(s) to ${markerName}`,
    });

    setSelectedCandidates(new Set());
    setTargetMarker("");
  };

  const handleSelectAll = () => {
    const selectableCandidates = filteredManagementCandidates.filter(
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

  const selectableCandidatesCount = filteredManagementCandidates.filter(
    (c) => c.evaluationStatus !== "completed"
  ).length;

  const switchToInitialAssignment = () => {
    setViewMode("initial-assignment");
    setCurrentStep(1);
    setSelectedMarkers([]);
    setAssignmentMethod(null);
    setInitialAssignments({});
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>
                {viewMode === "initial-assignment" ? "Marker Assignment" : "Candidate Assignment Manager"}
              </SheetTitle>
              <SheetDescription>
                {schedule.scheduleName} • {completedTestCandidates.length} candidates ready
              </SheetDescription>
            </div>
            {hasExistingAssignments && viewMode === "management" && (
              <Button variant="outline" size="sm" onClick={switchToInitialAssignment} className="gap-2">
                <UserPlus className="w-4 h-4" />
                New Assignment
              </Button>
            )}
            {viewMode === "initial-assignment" && hasExistingAssignments && (
              <Button variant="outline" size="sm" onClick={() => setViewMode("management")} className="gap-2">
                <Settings className="w-4 h-4" />
                Manage Existing
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Initial Assignment Flow */}
        {viewMode === "initial-assignment" && (
          <>
            {/* Stepper */}
            <div className="px-6 py-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                          currentStep > step.number
                            ? "bg-primary border-primary text-primary-foreground"
                            : currentStep === step.number
                            ? "border-primary text-primary"
                            : "border-muted-foreground/30 text-muted-foreground"
                        )}
                      >
                        {currentStep > step.number ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="text-center">
                        <div
                          className={cn(
                            "text-xs font-medium",
                            currentStep >= step.number
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.title}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <Separator
                        className={cn(
                          "flex-1 mx-2",
                          currentStep > step.number ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <ScrollArea className="flex-1 px-6 py-4">
              {/* Step 1: Select Markers */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Select Markers</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose the markers who will evaluate the candidates
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Search Markers</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or email..."
                        value={markerSearch}
                        onChange={(e) => setMarkerSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredMarkers.map((marker) => (
                      <Card
                        key={marker.id}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedMarkers.includes(marker.id) ? "border-primary bg-primary/5" : ""
                        )}
                        onClick={() => handleToggleMarker(marker.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={selectedMarkers.includes(marker.id)}
                              onCheckedChange={() => handleToggleMarker(marker.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{marker.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {marker.email}
                                  </div>
                                </div>
                                <Badge variant="secondary">
                                  {marker.assignedCount} current
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {selectedMarkers.length} marker(s) selected
                  </div>
                </div>
              )}

              {/* Step 2: Choose Method */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Choose Assignment Method</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select how you want to assign candidates to markers
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <Card
                      className={cn(
                        "cursor-pointer transition-colors hover:border-primary",
                        assignmentMethod === "auto" ? "border-primary bg-primary/5" : ""
                      )}
                      onClick={() => setAssignmentMethod("auto")}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Zap className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">Auto Distribution</h4>
                            <p className="text-sm text-muted-foreground">
                              Automatically distribute candidates evenly among selected markers using
                              round-robin allocation
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "cursor-pointer transition-colors hover:border-primary",
                        assignmentMethod === "manual" ? "border-primary bg-primary/5" : ""
                      )}
                      onClick={() => setAssignmentMethod("manual")}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <UserPlus className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">Manual Assignment</h4>
                            <p className="text-sm text-muted-foreground">
                              Manually select and assign specific candidates to individual markers for
                              more control
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 3: Auto Distribution */}
              {currentStep === 3 && assignmentMethod === "auto" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Auto Distribution</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review the distribution and click to assign
                    </p>
                  </div>

                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {completedTestCandidates.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Candidates</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {selectedMarkers.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Markers</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {selectedMarkers.length > 0
                              ? Math.ceil(completedTestCandidates.length / selectedMarkers.length)
                              : 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Per Marker</div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Distribution Strategy</div>
                        <div className="text-sm text-muted-foreground">
                          Candidates will be evenly distributed among selected markers using round-robin
                          allocation.
                        </div>
                      </div>

                      <Button
                        onClick={handleAutoDistribute}
                        disabled={selectedMarkers.length === 0}
                        className="w-full"
                        size="lg"
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Auto-Distribute Now
                      </Button>

                      {Object.keys(initialAssignments).length > 0 && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Distribution complete!
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: Manual Assignment */}
              {currentStep === 3 && assignmentMethod === "manual" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Manual Assignment</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select candidates and assign them to markers
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Search Candidates</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label>Assign to:</Label>
                    <Select value={manualAssignToMarker} onValueChange={setManualAssignToMarker}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a marker..." />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedMarkers.map((markerId) => {
                          const marker = mockMarkers.find((m) => m.id === markerId);
                          return (
                            <SelectItem key={markerId} value={markerId}>
                              {marker?.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleManualAssign}
                      disabled={selectedForAssignment.length === 0 || !manualAssignToMarker}
                    >
                      Assign ({selectedForAssignment.length})
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredInitialCandidates.map((candidate) => {
                      const assignedMarker = Object.keys(initialAssignments).find((markerId) =>
                        initialAssignments[markerId]?.includes(candidate.id)
                      );
                      const marker = assignedMarker
                        ? mockMarkers.find((m) => m.id === assignedMarker)
                        : null;

                      return (
                        <Card
                          key={candidate.id}
                          className={cn(
                            "cursor-pointer transition-colors",
                            selectedForAssignment.includes(candidate.id) ? "border-primary bg-primary/5" : ""
                          )}
                          onClick={() => handleToggleCandidateForAssignment(candidate.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={selectedForAssignment.includes(candidate.id)}
                                onCheckedChange={() => handleToggleCandidateForAssignment(candidate.id)}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-sm">{candidate.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {candidate.email}
                                    </div>
                                  </div>
                                  {marker && (
                                    <Badge variant="secondary" className="text-xs">
                                      {marker.name}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {selectedForAssignment.length} candidate(s) selected •{" "}
                    {Object.values(initialAssignments).reduce((sum, arr) => sum + arr.length, 0)}/
                    {completedTestCandidates.length} assigned
                  </div>
                </div>
              )}

              {/* Step 4: Review Summary */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review the assignments before confirming
                    </p>
                  </div>

                  {Object.keys(initialAssignments).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No assignments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedMarkers.map((markerId) => {
                        const marker = mockMarkers.find((m) => m.id === markerId);
                        const assignedCount = getMarkerAssignmentCount(markerId);

                        if (!marker || assignedCount === 0) return null;

                        return (
                          <Card key={markerId}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-base">{marker.name}</CardTitle>
                                  <div className="text-sm text-muted-foreground">
                                    {marker.email}
                                  </div>
                                </div>
                                <Badge variant="default" className="text-base">
                                  {assignedCount} candidates
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Current Load:</span>{" "}
                                  <span className="font-medium">{marker.assignedCount}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">New Total:</span>{" "}
                                  <span className="font-medium">
                                    {marker.assignedCount + assignedCount}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? onClose : handleBack}
              >
                {currentStep === 1 ? (
                  "Cancel"
                ) : (
                  <>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </>
                )}
              </Button>

              {currentStep < 4 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmitInitialAssignment} disabled={Object.keys(initialAssignments).length === 0}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Confirm Assignment
                </Button>
              )}
            </div>
          </>
        )}

        {/* Management Mode */}
        {viewMode === "management" && (
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
                    {filteredManagementCandidates.length} candidates shown
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
                {filteredManagementCandidates.map((candidate) => {
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
                        onCheckedChange={() => handleToggleCandidateManagement(candidate.id)}
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

                {filteredManagementCandidates.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    No candidates found matching your filters
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
