import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { schedules } from "@/data/mockData";
import { ScheduleTable } from "@/components/ScheduleTable";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, ArrowLeft, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormsSidebar } from "@/components/FormsSidebar";

// Mock projects data
const mockProjects = [
  { id: "proj-1", name: "NSE Certification 2025", description: "National certification exams" },
  { id: "proj-2", name: "Corporate Training Q1", description: "Employee skill assessments" },
  { id: "proj-3", name: "University Entrance Exams", description: "Undergraduate admissions" },
  { id: "proj-4", name: "Professional License Tests", description: "Industry certifications" },
];

const ScheduleDashboard = () => {
  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [rowsPerPage, setRowsPerPage] = useState("25");

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

  const handleMenuChange = (menu: string) => {
    // Navigate to forms dashboard for other menu items
    if (menu !== "schedule") {
      navigate(`/forms`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
            className="h-8 w-8"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">Saras</span>
              <span className="text-[10px] text-muted-foreground block -mt-1">TEST & ASSESSMENT</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground">NSE Admin</span>
          <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
            <span className="text-primary text-sm font-medium">NA</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main Sidebar with Project Switcher and Menu */}
        <FormsSidebar
          projects={mockProjects}
          selectedProjectId={selectedProjectId}
          onProjectChange={setSelectedProjectId}
          activeMenu="schedule"
          onMenuChange={handleMenuChange}
          hideSettings
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Schedules</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schedules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <Button onClick={() => navigate("/scheduling/create")} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-1" />
                Create Schedule
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <ScheduleTable schedules={paginatedSchedules} />
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredSchedules.length)} of {filteredSchedules.length}
              </span>
              <span className="ml-4">Rows per page:</span>
              <Select 
                value={rowsPerPage} 
                onValueChange={(value) => {
                  setRowsPerPage(value);
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-16 h-8 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm text-foreground">{currentPage}/{totalPages || 1}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="py-3 text-center text-xs text-muted-foreground border-t border-border">
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
    </div>
  );
};

export default ScheduleDashboard;
