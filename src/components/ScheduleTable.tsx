import { useState } from "react";
import { Schedule } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, Edit2, Trash2, Users, Clock, Calendar, AlertCircle, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BulkMarkerAssignment } from "@/components/BulkMarkerAssignment";
import { MarkerAssignmentsSlider } from "@/components/MarkerAssignmentsSlider";

interface ScheduleTableProps {
  schedules: Schedule[];
}

export const ScheduleTable = ({ schedules }: ScheduleTableProps) => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [markerAssignmentDialog, setMarkerAssignmentDialog] = useState<{
    open: boolean;
    scheduleId: string;
    scheduleName: string;
  } | null>(null);
  const [assignmentsSlider, setAssignmentsSlider] = useState<{
    open: boolean;
    schedule: Schedule;
  } | null>(null);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === schedules.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(schedules.map(s => s.id)));
    }
  };

  return (
    <div className="border rounded-lg bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.size === schedules.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="font-semibold">SCHEDULE NAME</TableHead>
            <TableHead className="font-semibold">SCHEDULE TYPE</TableHead>
            <TableHead className="font-semibold">NO OF ASSESSMENTS</TableHead>
            <TableHead className="font-semibold">STATUS</TableHead>
            <TableHead className="font-semibold">PENDING APPROVALS</TableHead>
            <TableHead className="text-right font-semibold">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <>
              <TableRow key={schedule.id} className="border-b">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedRows.has(schedule.id)}
                      onCheckedChange={() => toggleSelection(schedule.id)}
                    />
                    <button
                      onClick={() => toggleRow(schedule.id)}
                      className="text-primary hover:text-primary/80"
                    >
                      {expandedRows.has(schedule.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{schedule.scheduleName}</div>
                  <div className="text-sm text-muted-foreground">
                    {schedule.id}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  Standard
                </TableCell>
                <TableCell className="text-center">1</TableCell>
                <TableCell>
                  <Badge variant={schedule.status === "published" ? "default" : "secondary"}>
                    {schedule.status === "published" ? "Published" : "Unpublished"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {schedule.pendingApprovals > 0 ? (
                    <button
                      onClick={() => navigate(`/approvals/${schedule.id}`)}
                      className="flex items-center gap-1.5 text-warning hover:text-warning/80 font-medium"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {schedule.pendingApprovals}
                    </button>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm"
                      disabled={schedule.status === "published"}
                    >
                      Publish
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              
              {expandedRows.has(schedule.id) && (
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableCell colSpan={7} className="p-6">
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Assessment Name:</span>{" "}
                        <span className="text-foreground">{schedule.assessmentName}</span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Users className="w-4 h-4 text-accent" />
                            BATCH / TEST TAKER
                          </div>
                          <div className="pl-6 space-y-1 text-sm">
                            <div className="text-muted-foreground">
                              No of Batch(s)
                            </div>
                            <div className="font-medium">{schedule.numberOfBatches}</div>
                            <div className="text-muted-foreground mt-2">
                              No of Test Taker
                            </div>
                            <div className="font-medium">{schedule.numberOfTestTakers}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Clock className="w-4 h-4 text-accent" />
                            SCHEDULE DATE & TIME
                          </div>
                          <div className="pl-6 space-y-1 text-sm">
                            <div className="text-muted-foreground">
                              Start Date
                            </div>
                            <div className="font-medium">
                              {new Date(schedule.testStartDate).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}{" "}
                              7:40 PM
                            </div>
                            <div className="text-muted-foreground mt-2">
                              End Date
                            </div>
                            <div className="font-medium">
                              {new Date(schedule.testEndDate).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}{" "}
                              8:40 PM
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Calendar className="w-4 h-4 text-accent" />
                            TEST DATE & TIME
                          </div>
                          <div className="pl-6 space-y-1 text-sm">
                            <div className="text-muted-foreground">
                              Start Date
                            </div>
                            <div className="font-medium">-</div>
                            <div className="text-muted-foreground mt-2">
                              End Date
                            </div>
                            <div className="font-medium">-</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Users className="w-4 h-4 text-accent" />
                            ATTENDANCE
                          </div>
                          <div className="pl-6 space-y-1 text-sm">
                            <div className="text-muted-foreground">
                              Attempted
                            </div>
                            <div className="font-medium">{schedule.attempted}</div>
                            <div className="text-muted-foreground mt-2">
                              Not Attempted
                            </div>
                            <div className="font-medium">{schedule.notAttempted}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <UserCheck className="w-4 h-4 text-accent" />
                            MARKER ASSIGNMENTS
                          </div>
                          <div className="pl-6 space-y-1 text-sm">
                            <div className="text-muted-foreground">
                              Assigned Markers
                            </div>
                            <div className="font-medium">
                              {schedule.assignedMarkers && schedule.assignedMarkers.length > 0 ? (
                                <button
                                  onClick={() =>
                                    setAssignmentsSlider({
                                      open: true,
                                      schedule: schedule,
                                    })
                                  }
                                  className="text-primary hover:text-primary/80 underline"
                                >
                                  {schedule.assignedMarkers.length}
                                </button>
                              ) : (
                                "0"
                              )}
                            </div>
                            <div className="text-muted-foreground mt-2">
                              Assigned Candidates
                            </div>
                            <div className="font-medium">
                              {schedule.assignedMarkers && schedule.assignedMarkers.length > 0 ? (
                                <button
                                  onClick={() =>
                                    setAssignmentsSlider({
                                      open: true,
                                      schedule: schedule,
                                    })
                                  }
                                  className="text-primary hover:text-primary/80 underline"
                                >
                                  {schedule.assignedMarkers.reduce(
                                    (sum, m) => sum + m.assignedCandidates,
                                    0
                                  )}
                                </button>
                              ) : (
                                "0"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setMarkerAssignmentDialog({
                              open: true,
                              scheduleId: schedule.id,
                              scheduleName: schedule.scheduleName,
                            })
                          }
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Assign Markers
                        </Button>
                        {schedule.assignedMarkers && schedule.assignedMarkers.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {schedule.assignedMarkers.length} marker(s) •{" "}
                            {schedule.assignedMarkers.reduce((sum, m) => sum + m.assignedCandidates, 0)} candidates
                          </Badge>
                        )}
                      </div>

                      {schedule.assignedMarkers && schedule.assignedMarkers.length > 0 && (
                        <div className="mt-4 p-3 bg-muted/30 rounded-md space-y-2">
                          <div className="text-xs font-semibold text-foreground">Assigned Markers:</div>
                          <div className="grid grid-cols-2 gap-2">
                            {schedule.assignedMarkers.map((marker) => (
                              <div
                                key={marker.markerId}
                                className="flex items-center justify-between text-xs p-2 bg-background rounded border"
                              >
                                <span className="font-medium">{marker.markerName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {marker.assignedCandidates}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>

      {markerAssignmentDialog && (
        <BulkMarkerAssignment
          open={markerAssignmentDialog.open}
          onClose={() => setMarkerAssignmentDialog(null)}
          scheduleId={markerAssignmentDialog.scheduleId}
          scheduleName={markerAssignmentDialog.scheduleName}
        />
      )}

      {assignmentsSlider && (
        <MarkerAssignmentsSlider
          open={assignmentsSlider.open}
          onClose={() => setAssignmentsSlider(null)}
          schedule={assignmentsSlider.schedule}
        />
      )}
    </div>
  );
};
