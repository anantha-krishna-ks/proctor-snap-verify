import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserCheck, Users, Zap, Search, CheckCircle2, UserPlus, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  { id: "m5", name: "Dr. Lisa Anderson", email: "l.anderson@example.com", assignedCount: 5 },
];

const mockCandidates: Candidate[] = Array.from({ length: 120 }, (_, i) => ({
  id: `c${i + 1}`,
  name: `Candidate ${i + 1}`,
  email: `candidate${i + 1}@example.com`,
  testCompleted: i < 100, // 100 completed, 20 not completed
}));

interface BulkMarkerAssignmentProps {
  open: boolean;
  onClose: () => void;
  scheduleId: string;
  scheduleName: string;
}

export const BulkMarkerAssignment = ({
  open,
  onClose,
  scheduleId,
  scheduleName,
}: BulkMarkerAssignmentProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assignmentMethod, setAssignmentMethod] = useState<"manual" | "auto" | null>(null);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [markerSearch, setMarkerSearch] = useState("");
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [manualAssignToMarker, setManualAssignToMarker] = useState<string>("");

  const steps = [
    { number: 1, title: "Select Markers", icon: UserCheck },
    { number: 2, title: "Assignment Method", icon: Zap },
    { number: 3, title: "Assign Candidates", icon: UserPlus },
    { number: 4, title: "Review & Confirm", icon: CheckCircle2 },
  ];

  const completedCandidates = mockCandidates.filter((c) => c.testCompleted);
  const filteredCandidates = completedCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const filteredMarkers = mockMarkers.filter(
    (m) =>
      m.name.toLowerCase().includes(markerSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(markerSearch.toLowerCase())
  );

  const handleToggleMarker = (markerId: string) => {
    setSelectedMarkers((prev) =>
      prev.includes(markerId)
        ? prev.filter((id) => id !== markerId)
        : [...prev, markerId]
    );
  };

  const handleToggleCandidate = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleManualAssign = () => {
    if (selectedCandidates.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }
    if (!manualAssignToMarker) {
      toast.error("Please select a marker to assign to");
      return;
    }

    setAssignments((prev) => {
      const updated = { ...prev };
      if (!updated[manualAssignToMarker]) {
        updated[manualAssignToMarker] = [];
      }
      
      // Remove selected candidates from other markers
      Object.keys(updated).forEach((markerId) => {
        updated[markerId] = updated[markerId].filter(
          (cId) => !selectedCandidates.includes(cId)
        );
      });
      
      // Add to selected marker
      updated[manualAssignToMarker] = [
        ...updated[manualAssignToMarker],
        ...selectedCandidates,
      ];
      
      return updated;
    });

    toast.success(
      `Assigned ${selectedCandidates.length} candidate(s) to ${mockMarkers.find((m) => m.id === manualAssignToMarker)?.name}`
    );
    setSelectedCandidates([]);
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

    // Distribute candidates evenly
    completedCandidates.forEach((candidate, index) => {
      const markerIndex = index % selectedMarkers.length;
      const markerId = selectedMarkers[markerIndex];
      newAssignments[markerId].push(candidate.id);
    });

    setAssignments(newAssignments);
    toast.success(
      `Auto-distributed ${completedCandidates.length} candidates among ${selectedMarkers.length} markers`
    );
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
    if (currentStep === 3) {
      if (assignmentMethod === "manual") {
        const totalAssigned = Object.values(assignments).reduce((sum, arr) => sum + arr.length, 0);
        if (totalAssigned === 0) {
          toast.error("Please assign at least one candidate");
          return;
        }
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    const totalAssigned = Object.values(assignments).reduce(
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
    return assignments[markerId]?.length || 0;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Bulk Marker Assignment</SheetTitle>
          <SheetDescription>
            {scheduleName} • {completedCandidates.length} candidates ready
          </SheetDescription>
        </SheetHeader>

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
                <h3 className="text-lg font-semibold mb-4">Select Markers</h3>
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
                <h3 className="text-lg font-semibold mb-4">Choose Assignment Method</h3>
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

          {/* Step 3: Assign Candidates - Auto */}
          {currentStep === 3 && assignmentMethod === "auto" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Auto Distribution</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Review the distribution and click to assign
                </p>
              </div>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {completedCandidates.length}
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
                          ? Math.ceil(completedCandidates.length / selectedMarkers.length)
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

                  {Object.keys(assignments).length > 0 && (
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

          {/* Step 3: Assign Candidates - Manual */}
          {currentStep === 3 && assignmentMethod === "manual" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Manual Assignment</h3>
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
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label>Assign to:</Label>
                <select
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={manualAssignToMarker}
                  onChange={(e) => setManualAssignToMarker(e.target.value)}
                  disabled={selectedMarkers.length === 0}
                >
                  <option value="">Select a marker...</option>
                  {selectedMarkers.map((markerId) => {
                    const marker = mockMarkers.find((m) => m.id === markerId);
                    return (
                      <option key={markerId} value={markerId}>
                        {marker?.name}
                      </option>
                    );
                  })}
                </select>
                <Button
                  onClick={handleManualAssign}
                  disabled={selectedCandidates.length === 0 || !manualAssignToMarker}
                >
                  Assign ({selectedCandidates.length})
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredCandidates.map((candidate) => {
                  const assignedMarker = Object.keys(assignments).find((markerId) =>
                    assignments[markerId]?.includes(candidate.id)
                  );
                  const marker = assignedMarker
                    ? mockMarkers.find((m) => m.id === assignedMarker)
                    : null;

                  return (
                    <Card
                      key={candidate.id}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedCandidates.includes(candidate.id) ? "border-primary bg-primary/5" : ""
                      )}
                      onClick={() => handleToggleCandidate(candidate.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedCandidates.includes(candidate.id)}
                            onCheckedChange={() => handleToggleCandidate(candidate.id)}
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
                {selectedCandidates.length} candidate(s) selected •{" "}
                {Object.values(assignments).reduce((sum, arr) => sum + arr.length, 0)}/
                {completedCandidates.length} assigned
              </div>
            </div>
          )}

          {/* Step 4: Review Summary */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Review the assignments before confirming
                </p>
              </div>

              {Object.keys(assignments).length === 0 ? (
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
            <Button onClick={handleSubmit} disabled={Object.keys(assignments).length === 0}>
              <UserCheck className="mr-2 h-4 w-4" />
              Confirm Assignment
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
