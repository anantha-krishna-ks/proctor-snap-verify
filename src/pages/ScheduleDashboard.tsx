import { useState } from "react";
import { schedules } from "@/data/mockData";
import { ScheduleHeader } from "@/components/ScheduleHeader";
import { ScheduleTable } from "@/components/ScheduleTable";
import { Pagination } from "@/components/Pagination";

const ScheduleDashboard = () => {
  const [selectedAssessment, setSelectedAssessment] = useState("easy-proctor");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

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

  return (
    <div className="min-h-screen bg-background">
      <ScheduleHeader
        selectedAssessment={selectedAssessment}
        onAssessmentChange={setSelectedAssessment}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container mx-auto px-6 py-6">
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

        <div className="mt-4 text-center text-xs text-muted-foreground">
          Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd
        </div>
      </main>
    </div>
  );
};

export default ScheduleDashboard;
