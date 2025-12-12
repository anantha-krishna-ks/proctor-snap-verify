import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  ClipboardList, 
  Search, 
  MoreHorizontal, 
  FileText, 
  Settings,
  ChevronDown,
  Layers,
  CheckCircle2,
  Clock,
  Archive,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { mockSurveys } from "@/data/surveyMockData";
import { mockForms, mockConfigurations } from "@/data/formsMockData";
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

  const stats = {
    totalForms: mockForms.length,
    configurations: mockConfigurations.length,
    totalSurveys: mockSurveys.length,
    published: mockSurveys.filter((s) => s.status === "published").length,
    draft: mockSurveys.filter((s) => s.status === "draft").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              {/* Module Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-xl font-semibold hover:bg-transparent px-0">
                    <Layers className="h-5 w-5 text-warning" />
                    <span>Surveys</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-popover">
                  <DropdownMenuItem 
                    onClick={() => navigate("/forms")}
                    className="gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Forms</p>
                      <p className="text-xs text-muted-foreground">{stats.totalForms} forms</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/forms/configurations")}
                    className="gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      <Settings className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Configurations</p>
                      <p className="text-xs text-muted-foreground">{stats.configurations} configs</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => navigate("/surveys")}
                    className="gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                      <ClipboardList className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">Surveys</p>
                      <p className="text-xs text-muted-foreground">{stats.totalSurveys} surveys</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button onClick={() => navigate("/surveys/create")} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Survey
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border/50 hover:border-border transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Surveys</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalSurveys}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-border transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-3xl font-bold text-success">{stats.published}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-border transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Draft</p>
                  <p className="text-3xl font-bold text-foreground">{stats.draft}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search surveys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
        </div>

        {/* Surveys Table */}
        <Card className="border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
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
        </Card>
      </main>
    </div>
  );
};

export default SurveyList;
