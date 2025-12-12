import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  ClipboardList, 
  Search, 
  MoreHorizontal, 
  FileText, 
  Settings,
  CheckCircle2,
  Clock,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { mockSurveys } from "@/data/surveyMockData";
import { format } from "date-fns";

const SurveyList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSurveys = mockSurveys.filter((survey) =>
    survey.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="secondary" className="border border-border">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <Archive className="h-3 w-3 mr-1" />
            Archived
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6">
          {/* Title and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-foreground">Surveys</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/forms")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Forms
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/forms/configurations")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configurations
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/surveys")}
                  className="text-primary bg-primary/10"
                >
                  <ClipboardList className="h-4 w-4 mr-1" />
                  Surveys
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate("/surveys/create")}>
                <Plus className="h-4 w-4 mr-1" />
                Create Survey
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search surveys"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Surveys Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Survey Name</TableHead>
                  <TableHead className="font-semibold text-center">Items</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold">Updated</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSurveys.map((survey) => (
                  <TableRow 
                    key={survey.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <TableCell className="font-medium text-foreground">
                      {survey.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-normal">
                        {survey.items.length} items
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(survey.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(survey.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(survey.updatedAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Preview</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSurveys.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No surveys found</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate("/surveys/create")}
                          className="mt-2"
                        >
                          Create your first survey
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

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

export default SurveyList;