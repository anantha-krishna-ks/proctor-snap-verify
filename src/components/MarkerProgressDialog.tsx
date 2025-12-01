import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";

interface MarkerProgress {
  markerId: string;
  markerName: string;
  notStarted: number;
  inProgress: number;
  completed: number;
  total: number;
}

interface MarkerProgressSliderProps {
  open: boolean;
  onClose: () => void;
  scheduleName: string;
  markerProgress: MarkerProgress[];
}

export const MarkerProgressSlider = ({
  open,
  onClose,
  scheduleName,
  markerProgress,
}: MarkerProgressSliderProps) => {
  const calculateProgress = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-xl">Marker Progress Report</SheetTitle>
          <div className="text-sm text-muted-foreground">
            Schedule: {scheduleName}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-4">
            {markerProgress.map((marker) => (
              <Card key={marker.markerId} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {marker.markerName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        ID: {marker.markerId}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {marker.total} Total
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {marker.completed}/{marker.total} completed
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(marker.completed, marker.total)}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Not Started
                        </div>
                        <div className="text-lg font-bold">
                          {marker.notStarted}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10">
                      <PlayCircle className="h-4 w-4 text-amber-600" />
                      <div>
                        <div className="text-xs text-muted-foreground">
                          In Progress
                        </div>
                        <div className="text-lg font-bold">
                          {marker.inProgress}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Completed
                        </div>
                        <div className="text-lg font-bold">
                          {marker.completed}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {markerProgress.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No markers assigned to this schedule yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
