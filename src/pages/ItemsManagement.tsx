import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, Plus, MoreHorizontal, Edit, Eye, Copy, Trash2, 
  Send, ArrowLeft, FileText, Filter
} from "lucide-react";
import { mockProjects } from "@/data/projectMockData";

interface Item {
  id: string;
  code: string;
  name: string;
  type: string;
  status: "draft" | "review" | "published" | "rejected";
  createdAt: string;
  updatedAt: string;
}

const mockItems: Item[] = [
  { id: "1", code: "ITM001", name: "Multiple Choice Question 1", type: "MCQ", status: "published", createdAt: "2025-01-10", updatedAt: "2025-01-12" },
  { id: "2", code: "ITM002", name: "Essay Question - Market Analysis", type: "Essay", status: "draft", createdAt: "2025-01-11", updatedAt: "2025-01-11" },
  { id: "3", code: "ITM003", name: "True/False - Banking Regulations", type: "TrueFalse", status: "review", createdAt: "2025-01-12", updatedAt: "2025-01-13" },
  { id: "4", code: "ITM004", name: "Fill in the Blanks - Insurance Terms", type: "FillBlanks", status: "rejected", createdAt: "2025-01-13", updatedAt: "2025-01-14" },
  { id: "5", code: "ITM005", name: "Case Study - Investment Portfolio", type: "CaseStudy", status: "draft", createdAt: "2025-01-14", updatedAt: "2025-01-14" },
  { id: "6", code: "ITM006", name: "MCQ - Risk Assessment", type: "MCQ", status: "published", createdAt: "2025-01-15", updatedAt: "2025-01-16" },
];

const ItemsManagement = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const userRole = localStorage.getItem("userRole") || "author";

  const project = mockProjects.find(p => p.id === projectId);

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Item["status"]) => {
    const styles = {
      draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      review: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <Badge variant="secondary" className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleBack = () => {
    if (userRole === "author" || userRole === "test_author") {
      navigate("/author");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery="" onSearchChange={() => {}} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground">
                {project?.name || "Project"} - Items
              </h1>
              <p className="text-sm text-muted-foreground">
                Code: {project?.code} | Manage and author items for this project
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Item
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold">{mockItems.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold text-slate-600">{mockItems.filter(i => i.status === "draft").length}</div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold text-amber-600">{mockItems.filter(i => i.status === "review").length}</div>
              <div className="text-sm text-muted-foreground">In Review</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold text-emerald-600">{mockItems.filter(i => i.status === "published").length}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{item.updatedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg z-50">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          {item.status === "draft" && (
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Submit for Review
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No items found matching your criteria.
            </div>
          )}

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd
          </div>
        </main>
      </div>
    </div>
  );
};

export default ItemsManagement;
