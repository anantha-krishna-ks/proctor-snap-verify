import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { ProjectCard } from "@/components/admin/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Grid3X3, List } from "lucide-react";
import { mockProjects } from "@/data/projectMockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddProductSheet from "@/components/AddProductSheet";

const ProductsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6">
          {/* Title and Actions */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Products</h1>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button className="gap-2" onClick={() => setIsAddProductOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product code, name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <AddProductSheet
            open={isAddProductOpen}
            onOpenChange={setIsAddProductOpen}
          />

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">CODE</TableHead>
                    <TableHead className="font-semibold">NAME</TableHead>
                    <TableHead className="font-semibold text-center">ITEMS</TableHead>
                    <TableHead className="font-semibold text-center">TESTS</TableHead>
                    <TableHead className="font-semibold text-center">SCHEDULES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/30 cursor-pointer">
                      <TableCell className="font-medium text-primary">{project.code}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell className="text-center">{project.itemCount}</TableCell>
                      <TableCell className="text-center">{project.testCount}</TableCell>
                      <TableCell className="text-center">{project.scheduleCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No products found matching your search.
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
    </div>
  );
};

export default ProductsDashboard;
