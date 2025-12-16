import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Clock, Save, Users } from "lucide-react";
import { toast } from "sonner";

// Mock data for forms and sequences
const mockForms = [
  { id: "form1", name: "Mathematics Form A", type: "form" },
  { id: "form2", name: "Science Form B", type: "form" },
  { id: "form3", name: "English Form C", type: "form" },
];

const mockSequences = [
  { id: "seq1", name: "Complete Test Sequence 1", type: "sequence" },
  { id: "seq2", name: "Advanced Test Series", type: "sequence" },
  { id: "seq3", name: "Basic Assessment Pack", type: "sequence" },
];

const CreateSchedule = () => {
  const navigate = useNavigate();
  const [scheduleName, setScheduleName] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleType, setScheduleType] = useState<"form" | "sequence">("form");
  const [selectedItem, setSelectedItem] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [testDate, setTestDate] = useState<Date>();
  const [testTime, setTestTime] = useState("10:00");
  const [duration, setDuration] = useState("60");

  const availableItems = scheduleType === "form" ? mockForms : mockSequences;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduleName || !selectedItem || !scheduleDate || !testDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would typically save to backend
    toast.success("Schedule created successfully! You can now map candidates.");
    navigate("/scheduling");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/scheduling")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Schedule</h1>
            <p className="text-muted-foreground">Schedule a form or test sequence for candidates</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the schedule name and select what to schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduleName">Schedule Name *</Label>
                    <Input
                      id="scheduleName"
                      placeholder="Enter schedule name"
                      value={scheduleName}
                      onChange={(e) => setScheduleName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter schedule description (optional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Schedule Type *</Label>
                      <Select value={scheduleType} onValueChange={(v: "form" | "sequence") => {
                        setScheduleType(v);
                        setSelectedItem("");
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="form">Form</SelectItem>
                          <SelectItem value="sequence">Test Sequence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Select {scheduleType === "form" ? "Form" : "Sequence"} *</Label>
                      <Select value={selectedItem} onValueChange={setSelectedItem}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${scheduleType}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Schedule Date & Time
                  </CardTitle>
                  <CardDescription>Set when the schedule becomes active</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Schedule Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduleDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduleDate}
                            onSelect={setScheduleDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Schedule Time *</Label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Test Date & Time
                  </CardTitle>
                  <CardDescription>Set when candidates can take the test</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Test Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !testDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {testDate ? format(testDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={testDate}
                            onSelect={setTestDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Test Time *</Label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={testTime}
                          onChange={(e) => setTestTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min="1"
                        placeholder="60"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Schedule Name</p>
                    <p className="font-medium">{scheduleName || "-"}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{scheduleType}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Selected {scheduleType === "form" ? "Form" : "Sequence"}</p>
                    <p className="font-medium">
                      {selectedItem ? availableItems.find(i => i.id === selectedItem)?.name : "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Schedule Date & Time</p>
                    <p className="font-medium">
                      {scheduleDate ? `${format(scheduleDate, "PPP")} at ${scheduleTime}` : "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Test Date & Time</p>
                    <p className="font-medium">
                      {testDate ? `${format(testDate, "PPP")} at ${testTime}` : "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{duration} minutes</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Candidate Mapping</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        After creating the schedule, you'll be able to map candidates to this schedule.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/scheduling")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd
        </div>
      </main>
    </div>
  );
};

export default CreateSchedule;
