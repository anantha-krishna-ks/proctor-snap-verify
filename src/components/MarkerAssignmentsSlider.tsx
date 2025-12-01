import { useState } from "react";
import { Schedule } from "@/types/assessment";
import { candidates } from "@/data/mockData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, User, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface MarkerAssignmentsSliderProps {
  open: boolean;
  onClose: () => void;
  schedule: Schedule;
}

export const MarkerAssignmentsSlider = ({
  open,
  onClose,
  schedule,
}: MarkerAssignmentsSliderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [reassignToMarker, setReassignToMarker] = useState<string>("");
  const { toast } = useToast();

  // Get candidates for this schedule
  const scheduleCandidates = candidates.filter(
    (c) => c.scheduleId === schedule.id && c.markerId
  );

  // Only pending candidates (not completed) can be reassigned
  const reassignableCandidates = scheduleCandidates.filter(
    (c) => c.evaluationStatus !== "completed"
  );

  // Group candidates by marker
  const markerGroups = schedule.assignedMarkers?.map((marker) => ({
    ...marker,
    candidates: scheduleCandidates.filter((c) => c.markerId === marker.markerId),
  })) || [];

  const filteredMarkerGroups = markerGroups
    .map((group) => ({
      ...group,
      candidates: group.candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.candidates.length > 0 || searchQuery === "");

  const handleToggleCandidate = (candidateId: string, isCompleted: boolean) => {
    // Prevent selecting completed candidates
    if (isCompleted) {
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

  const handleReassign = () => {
    if (selectedCandidates.size === 0) {
      toast({
        title: "No candidates selected",
        description: "Please select at least one candidate to reassign.",
        variant: "destructive",
      });
      return;
    }

    if (!reassignToMarker) {
      toast({
        title: "No marker selected",
        description: "Please select a marker to reassign candidates to.",
        variant: "destructive",
      });
      return;
    }

    const markerName = schedule.assignedMarkers?.find(
      (m) => m.markerId === reassignToMarker
    )?.markerName;

    toast({
      title: "Candidates reassigned",
      description: `Successfully reassigned ${selectedCandidates.size} candidate(s) to ${markerName}`,
    });

    setSelectedCandidates(new Set());
    setReassignToMarker("");
  };

  const handleSelectAll = () => {
    if (selectedCandidates.size === reassignableCandidates.length) {
      setSelectedCandidates(new Set());
    } else {
      // Only select pending candidates (not completed)
      setSelectedCandidates(new Set(reassignableCandidates.map((c) => c.id)));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-xl">Marker Assignments</SheetTitle>
          <div className="text-sm text-muted-foreground">
            {schedule.scheduleName}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Total Markers</div>
              <div className="text-2xl font-bold">
                {schedule.assignedMarkers?.length || 0}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Total Assigned</div>
              <div className="text-2xl font-bold">
                {schedule.assignedMarkers?.reduce(
                  (sum, m) => sum + m.assignedCandidates,
                  0
                ) || 0}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {selectedCandidates.size > 0 && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {selectedCandidates.size} candidate(s) selected
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Choose a marker to reassign them
                  </div>
                </div>
                <Select value={reassignToMarker} onValueChange={setReassignToMarker}>
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
                <Button onClick={handleReassign} size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reassign
                </Button>
              </div>
            )}
          </div>

          <ScrollArea className="h-[calc(100vh-340px)]">
            <div className="space-y-6 pr-4">
              <div className="flex items-center justify-between px-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedCandidates.size === reassignableCandidates.length
                    ? "Deselect All"
                    : "Select All Pending"}
                </Button>
                <div className="text-sm text-muted-foreground">
                  {reassignableCandidates.length} pending / {scheduleCandidates.length} total
                </div>
              </div>
              <Accordion type="multiple" className="space-y-2">
                {filteredMarkerGroups.map((group) => (
                  <AccordionItem
                    key={group.markerId}
                    value={group.markerId}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-primary" />
                          <div className="text-left">
                            <div className="font-semibold">{group.markerName}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {group.markerId}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {group.candidates.length} candidate(s)
                        </Badge>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-3 pb-4">
                      <div className="space-y-2">
                        {group.candidates.map((candidate) => {
                          const isCompleted = candidate.evaluationStatus === "completed";
                          return (
                            <div
                              key={candidate.id}
                              className={`flex items-center gap-3 p-3 bg-muted/30 rounded-md transition-colors ${
                                isCompleted ? "opacity-60" : "hover:bg-muted/50"
                              }`}
                            >
                              <Checkbox
                                checked={selectedCandidates.has(candidate.id)}
                                onCheckedChange={() =>
                                  handleToggleCandidate(candidate.id, isCompleted)
                                }
                                disabled={isCompleted}
                              />
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={candidate.profileImageUrl} />
                                <AvatarFallback>
                                  {candidate.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {candidate.name}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {candidate.email}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {candidate.evaluationStatus === "completed" ? (
                                  <Badge variant="default" className="text-xs gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Evaluated
                                  </Badge>
                                ) : candidate.evaluationStatus === "in_progress" ? (
                                  <Badge variant="secondary" className="text-xs">
                                    In Progress
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs gap-1">
                                    <XCircle className="w-3 h-3" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredMarkerGroups.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No candidates found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
