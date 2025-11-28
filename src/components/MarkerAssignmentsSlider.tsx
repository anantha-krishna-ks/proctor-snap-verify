import { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, User, CheckCircle2, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  // Get candidates for this schedule
  const scheduleCandidates = candidates.filter(
    (c) => c.scheduleId === schedule.id && c.markerId
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

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-6 pr-4">
              {filteredMarkerGroups.map((group) => (
                <div
                  key={group.markerId}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      <div>
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

                  <div className="space-y-2">
                    {group.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"
                      >
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
                    ))}
                  </div>
                </div>
              ))}

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
