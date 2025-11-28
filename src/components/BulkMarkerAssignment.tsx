import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserCheck, Users, Zap, Search, CheckCircle2, UserPlus } from "lucide-react";
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
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [markerSearch, setMarkerSearch] = useState("");
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [manualAssignToMarker, setManualAssignToMarker] = useState<string>("");

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Marker Assignment</DialogTitle>
          <DialogDescription>
            Schedule: {scheduleName} • {completedCandidates.length} completed candidates ready
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs defaultValue="markers" className="w-full flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="markers">
                <UserCheck className="mr-2 h-4 w-4" />
                Select Markers
              </TabsTrigger>
              <TabsTrigger value="manual">
                <UserPlus className="mr-2 h-4 w-4" />
                Manual
              </TabsTrigger>
              <TabsTrigger value="auto">
                <Zap className="mr-2 h-4 w-4" />
                Auto
              </TabsTrigger>
              <TabsTrigger value="summary">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="markers" className="space-y-4 flex-1 flex flex-col overflow-hidden">
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

              <ScrollArea className="flex-1 border rounded-md p-4">
                <div className="space-y-3">
                  {filteredMarkers.map((marker) => (
                    <Card
                      key={marker.id}
                      className={selectedMarkers.includes(marker.id) ? "border-primary" : ""}
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
                              <div className="text-right">
                                <Badge variant="secondary">
                                  {marker.assignedCount} current
                                </Badge>
                                {selectedMarkers.includes(marker.id) && (
                                  <Badge className="ml-2">
                                    +{getMarkerAssignmentCount(marker.id)} new
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground">
                  {selectedMarkers.length} marker(s) selected
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4 flex-1 flex flex-col overflow-hidden">
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

              <ScrollArea className="flex-1 border rounded-md p-4">
                <div className="space-y-2">
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
                        className={selectedCandidates.includes(candidate.id) ? "border-primary" : ""}
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
              </ScrollArea>

              <div className="text-sm text-muted-foreground">
                {selectedCandidates.length} candidate(s) selected •{" "}
                {Object.values(assignments).reduce((sum, arr) => sum + arr.length, 0)}/
                {completedCandidates.length} assigned
              </div>
            </TabsContent>

            <TabsContent value="auto" className="space-y-4 flex-1 flex flex-col overflow-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Auto-Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        Distribution complete! Check Summary tab to review.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1">
                {Object.keys(assignments).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No assignments yet</p>
                    <p className="text-sm">Use auto-distribute to assign candidates</p>
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
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={Object.keys(assignments).length === 0}>
            <UserCheck className="mr-2 h-4 w-4" />
            Confirm Assignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
