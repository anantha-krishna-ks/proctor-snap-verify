import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { schedules } from "@/data/mockData";
import { ScheduleHeader } from "@/components/ScheduleHeader";
import { ScheduleTable } from "@/components/ScheduleTable";
import { Pagination } from "@/components/Pagination";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { usePrivileges } from "@/hooks/usePrivileges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, FileText, ListOrdered } from "lucide-react";
import { Input } from "@/components/ui/input";

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

  // Mock data for forms and test sequences
  const formsSchedules = schedules.slice(0, 3);
  const testSequenceSchedules = schedules.slice(2, 5);

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                placeholder="Search schedules..."
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
            <ScheduleTable schedules={formsSchedules} />
          </TabsContent>

          <TabsContent value="test-sequence" className="mt-0">
            <ScheduleTable schedules={testSequenceSchedules} />
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
