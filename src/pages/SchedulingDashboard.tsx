import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, Calendar, FileText, ListOrdered, 
  Users, Clock, MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for schedules
const mockSchedules = {
  assessments: [
    { id: "a1", name: "Mid-Term Assessment 2025", type: "Assessment", status: "Active", candidates: 250, startDate: "2025-01-15", endDate: "2025-01-20" },
    { id: "a2", name: "Final Examination", type: "Assessment", status: "Scheduled", candidates: 180, startDate: "2025-02-01", endDate: "2025-02-05" },
    { id: "a3", name: "Practice Test", type: "Assessment", status: "Completed", candidates: 320, startDate: "2024-12-10", endDate: "2024-12-12" },
  ],
  forms: [
    { id: "f1", name: "Mathematics Form A", type: "Form", status: "Active", candidates: 150, startDate: "2025-01-10", endDate: "2025-01-15" },
    { id: "f2", name: "Science Form B", type: "Form", status: "Scheduled", candidates: 200, startDate: "2025-01-20", endDate: "2025-01-25" },
  ],
  sequences: [
    { id: "s1", name: "Complete Test Sequence 1", type: "Sequence", status: "Active", candidates: 100, startDate: "2025-01-12", endDate: "2025-01-18" },
    { id: "s2", name: "Advanced Test Series", type: "Sequence", status: "Draft", candidates: 0, startDate: "-", endDate: "-" },
  ],
};

const SchedulingDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assessments");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Scheduled": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Completed": return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      case "Draft": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const renderScheduleTable = (schedules: typeof mockSchedules.assessments) => {
    const filtered = schedules.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Candidates</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((schedule) => (
            <TableRow key={schedule.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{schedule.name}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {schedule.candidates}
                </div>
              </TableCell>
              <TableCell>{schedule.startDate}</TableCell>
              <TableCell>{schedule.endDate}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/scheduling/${schedule.id}/candidates`)}>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Candidates
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="h-4 w-4 mr-2" />
                      Edit Schedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No schedules found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scheduling</h1>
            <p className="text-muted-foreground">Manage assessments, forms, and test sequences</p>
          </div>
          <Button onClick={() => navigate("/scheduling/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assessments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSchedules.assessments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Forms</CardTitle>
              <ListOrdered className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSchedules.forms.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Test Sequences</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSchedules.sequences.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 max-w-sm"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="assessments" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Assessments
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <ListOrdered className="h-4 w-4" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="sequences" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Test Sequence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assessments" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {renderScheduleTable(mockSchedules.assessments)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {renderScheduleTable(mockSchedules.forms)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sequences" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {renderScheduleTable(mockSchedules.sequences)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd
        </div>
      </main>
    </div>
  );
};

export default SchedulingDashboard;
