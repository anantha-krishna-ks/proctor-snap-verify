import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock, Save, Users, UserPlus, Search, X, ChevronRight, ChevronLeft, Check } from "lucide-react";
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

// Mock data for users and groups
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  userCount: number;
}

const mockUsers: User[] = [
  { id: "u1", name: "John Smith", email: "john.smith@example.com" },
  { id: "u2", name: "Sarah Johnson", email: "sarah.j@example.com" },
  { id: "u3", name: "Michael Brown", email: "m.brown@example.com" },
  { id: "u4", name: "Emily Davis", email: "emily.d@example.com" },
  { id: "u5", name: "James Wilson", email: "j.wilson@example.com" },
  { id: "u6", name: "Lisa Anderson", email: "l.anderson@example.com" },
  { id: "u7", name: "Robert Taylor", email: "r.taylor@example.com" },
  { id: "u8", name: "Jennifer Martinez", email: "j.martinez@example.com" },
];

const mockGroups: UserGroup[] = [
  { id: "g1", name: "Batch 2024 - Section A", description: "First year students from Section A", userCount: 25 },
  { id: "g2", name: "Batch 2024 - Section B", description: "First year students from Section B", userCount: 30 },
  { id: "g3", name: "Advanced Learners", description: "Students in advanced learning program", userCount: 15 },
  { id: "g4", name: "Remedial Group", description: "Students requiring additional support", userCount: 10 },
];

const CreateSchedule = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1 state
  const [scheduleName, setScheduleName] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleType, setScheduleType] = useState<"form" | "sequence">("form");
  const [selectedItem, setSelectedItem] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [testDate, setTestDate] = useState<Date>();
  const [testTime, setTestTime] = useState("10:00");
  const [duration, setDuration] = useState("60");
  
  // Step 2 state
  const [activeTab, setActiveTab] = useState<"users" | "groups">("users");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const availableItems = scheduleType === "form" ? mockForms : mockSequences;

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const filteredGroups = mockGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const getTotalSelectedCount = () => {
    const directUsers = selectedUsers.length;
    const groupUsers = selectedGroups.reduce((acc, groupId) => {
      const group = mockGroups.find((g) => g.id === groupId);
      return acc + (group?.userCount || 0);
    }, 0);
    return directUsers + groupUsers;
  };

  const handleNextStep = () => {
    if (!scheduleName || !selectedItem || !scheduleDate || !testDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    const totalMapped = getTotalSelectedCount();
    
    if (totalMapped === 0) {
      toast.info("Schedule created without any mapped users. You can add users later.");
    } else {
      toast.success(`Schedule created and ${totalMapped} users mapped successfully!`);
    }
    
    navigate("/scheduling");
  };

  const handleSkipMapping = () => {
    toast.info("Schedule created. You can map users later from the schedule details.");
    navigate("/scheduling");
  };

  const steps = [
    { number: 1, title: "Schedule Details", description: "Basic info & timing" },
    { number: 2, title: "Candidate Mapping", description: "Add users & groups" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 p-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/scheduling">Scheduling</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Schedule</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Create Schedule</h1>
          <p className="text-muted-foreground">Schedule a form or test sequence for candidates</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      currentStep === step.number
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep > step.number
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      "text-sm font-medium",
                      currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-24 h-0.5 mx-4 mt-[-24px]",
                      currentStep > step.number ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Schedule Details */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              <div className="flex flex-col gap-2">
                <Button onClick={handleNextStep} className="w-full">
                  Next: Map Candidates
                  <ChevronRight className="h-4 w-4 ml-2" />
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
        )}

        {/* Step 2: Candidate Mapping */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Map Candidates
                  </CardTitle>
                  <CardDescription>
                    Add individual users or groups to "{scheduleName}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "users" | "groups")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="users" className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Individual Users
                        {selectedUsers.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {selectedUsers.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="groups" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Groups
                        {selectedGroups.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {selectedGroups.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={`Search ${activeTab === "users" ? "users" : "groups"}...`}
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <TabsContent value="users" className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm text-muted-foreground">
                          {filteredUsers.length} users available
                        </Label>
                        <Button variant="ghost" size="sm" onClick={handleSelectAllUsers}>
                          {selectedUsers.length === filteredUsers.length ? "Deselect All" : "Select All"}
                        </Button>
                      </div>
                      <ScrollArea className="h-[350px] border rounded-md">
                        <div className="p-2 space-y-1">
                          {filteredUsers.map((user) => (
                            <div
                              key={user.id}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors",
                                selectedUsers.includes(user.id)
                                  ? "bg-primary/10 border border-primary/20"
                                  : "hover:bg-muted"
                              )}
                              onClick={() => handleToggleUser(user.id)}
                            >
                              <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() => handleToggleUser(user.id)}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                              </div>
                            </div>
                          ))}
                          {filteredUsers.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              No users found
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="groups" className="mt-4">
                      <div className="mb-3">
                        <Label className="text-sm text-muted-foreground">
                          {filteredGroups.length} groups available
                        </Label>
                      </div>
                      <ScrollArea className="h-[350px] border rounded-md">
                        <div className="p-2 space-y-2">
                          {filteredGroups.map((group) => (
                            <div
                              key={group.id}
                              className={cn(
                                "flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors",
                                selectedGroups.includes(group.id)
                                  ? "bg-primary/10 border border-primary/20"
                                  : "hover:bg-muted border border-transparent"
                              )}
                              onClick={() => handleToggleGroup(group.id)}
                            >
                              <Checkbox
                                checked={selectedGroups.includes(group.id)}
                                onCheckedChange={() => handleToggleGroup(group.id)}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">{group.name}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {group.userCount} users
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
                              </div>
                            </div>
                          ))}
                          {filteredGroups.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              No groups found
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>

                  {/* Selection Summary */}
                  {(selectedUsers.length > 0 || selectedGroups.length > 0) && (
                    <div className="bg-muted/50 rounded-md p-3 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">{getTotalSelectedCount()}</span>
                          <span className="text-muted-foreground"> users will be mapped</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUsers([]);
                            setSelectedGroups([]);
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Clear All
                        </Button>
                      </div>
                      {selectedGroups.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedGroups.map((groupId) => {
                            const group = mockGroups.find((g) => g.id === groupId);
                            return (
                              <Badge key={groupId} variant="secondary" className="text-xs">
                                {group?.name}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Schedule Name</p>
                    <p className="font-medium">{scheduleName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{scheduleType}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Selected {scheduleType === "form" ? "Form" : "Sequence"}</p>
                    <p className="font-medium">
                      {availableItems.find(i => i.id === selectedItem)?.name}
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

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Candidates Selected</p>
                      <p className="text-2xl font-bold text-primary mt-1">{getTotalSelectedCount()}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedUsers.length} individual users, {selectedGroups.length} groups
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Button onClick={handleSubmit} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
                <Button variant="outline" onClick={handleSkipMapping} className="w-full">
                  Skip Mapping & Create
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={handlePreviousStep}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Details
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd{" "}
          <a
            href="https://www.excelsoftcorp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            https://www.excelsoftcorp.com
          </a>
        </div>
      </main>
    </div>
  );
};

export default CreateSchedule;
