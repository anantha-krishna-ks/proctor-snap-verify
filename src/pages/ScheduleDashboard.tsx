import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { schedules } from "@/data/mockData";
import { ScheduleHeader } from "@/components/ScheduleHeader";
import { ScheduleTable } from "@/components/ScheduleTable";
import { Pagination } from "@/components/Pagination";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { usePrivileges } from "@/hooks/usePrivileges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, FileText, ListOrdered, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock test sequences data
const mockTestSequences = [
  {
    id: "seq1",
    name: "Complete Assessment Sequence",
    steps: 5,
    forms: 3,
    surveys: 1,
    createdAt: "2024-01-15",
    status: "active",
  },
  {
    id: "seq2",
    name: "Basic Proctoring Flow",
    steps: 3,
    forms: 2,
    surveys: 0,
    createdAt: "2024-02-20",
    status: "active",
  },
  {
    id: "seq3",
    name: "Advanced Test Series",
    steps: 7,
    forms: 5,
    surveys: 2,
    createdAt: "2024-03-01",
    status: "draft",
  },
  {
    id: "seq4",
    name: "Quick Evaluation Pack",
    steps: 2,
    forms: 1,
    surveys: 1,
    createdAt: "2024-03-10",
    status: "active",
  },
];

const ScheduleDashboard = () => {
  const navigate = useNavigate();
  const { hasPrivilege } = usePrivileges();
  const [selectedAssessment, setSelectedAssessment] = useState("easy-proctor");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [activeTab, setActiveTab] = useState("assessments");

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch = schedule.scheduleName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter test sequences by search
  const filteredSequences = mockTestSequences.filter((seq) =>
    seq.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle tab change - navigate to /forms for Forms tab
  const handleTabChange = (value: string) => {
    if (value === "forms") {
      navigate("/forms");
      return;
    }
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-background">
      {hasPrivilege("dashboard.admin") ? (
        <AdminHeader />
      ) : (
        <ScheduleHeader
          selectedAssessment={selectedAssessment}
          onAssessmentChange={setSelectedAssessment}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <main className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Schedule Management</h1>
          <Button onClick={() => navigate("/scheduling/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Schedule
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-auto grid-cols-3">
              <TabsTrigger value="assessments" className="gap-2">
                <Calendar className="h-4 w-4" />
                Assessments
              </TabsTrigger>
              <TabsTrigger value="forms" className="gap-2">
                <FileText className="h-4 w-4" />
                Forms
              </TabsTrigger>
              <TabsTrigger value="test-sequence" className="gap-2">
                <ListOrdered className="h-4 w-4" />
                Test Sequence
              </TabsTrigger>
            </TabsList>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="assessments" className="mt-0">
            <ScheduleTable schedules={paginatedSchedules} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredSchedules.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(items) => {
                setItemsPerPage(items);
                setCurrentPage(1);
              }}
            />
          </TabsContent>

          <TabsContent value="forms" className="mt-0">
            {/* This tab navigates to /forms, content won't show */}
          </TabsContent>

          <TabsContent value="test-sequence" className="mt-0">
            <div className="flex justify-end mb-4">
              <Button onClick={() => navigate("/forms?tab=test-sequence")} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Sequence
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sequence Name</TableHead>
                    <TableHead className="text-center">Steps</TableHead>
                    <TableHead className="text-center">Forms</TableHead>
                    <TableHead className="text-center">Surveys</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSequences.map((sequence) => (
                    <TableRow key={sequence.id}>
                      <TableCell className="font-medium">{sequence.name}</TableCell>
                      <TableCell className="text-center">{sequence.steps}</TableCell>
                      <TableCell className="text-center">{sequence.forms}</TableCell>
                      <TableCell className="text-center">{sequence.surveys}</TableCell>
                      <TableCell>{sequence.createdAt}</TableCell>
                      <TableCell>
                        <Badge variant={sequence.status === "active" ? "default" : "secondary"}>
                          {sequence.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate("/forms?tab=test-sequence")}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate("/forms?tab=test-sequence")}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSequences.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No test sequences found. Create your first sequence to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd
        </div>
      </main>
    </div>
  );
};

export default ScheduleDashboard;
