import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormCard } from "./FormCard";
import { mockFormTemplates, subjects, grades, type FormTemplate, type FormType, type ExposureStatus, type DifficultyLevel } from "@/types/formTemplates";
import { toast } from "sonner";

interface FormsDashboardContentProps {
  onCreateForm: () => void;
  onViewForm: (id: string) => void;
  onEditForm: (id: string) => void;
}

export const FormsDashboardContent = ({
  onCreateForm,
  onViewForm,
  onEditForm,
}: FormsDashboardContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    type: "all" as FormType | "all",
    subject: "all",
    grade: "all",
    status: "all" as ExposureStatus | "all",
    difficulty: "all" as DifficultyLevel | "all",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredForms = mockFormTemplates.filter((form) => {
    const matchesSearch =
      form.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.metadata.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      form.metadata.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filters.type === "all" || form.metadata.type === filters.type;
    const matchesSubject = filters.subject === "all" || form.metadata.subject === filters.subject;
    const matchesGrade = filters.grade === "all" || form.metadata.grade === filters.grade;
    const matchesStatus = filters.status === "all" || form.status === filters.status;
    const matchesDifficulty =
      filters.difficulty === "all" ||
      form.blueprint.some((rule) => rule.difficulty === filters.difficulty);

    return matchesSearch && matchesType && matchesSubject && matchesGrade && matchesStatus && matchesDifficulty;
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (value !== "all" && !activeFilters.includes(key)) {
      setActiveFilters((prev) => [...prev, key]);
    } else if (value === "all") {
      setActiveFilters((prev) => prev.filter((f) => f !== key));
    }
  };

  const clearFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "all" }));
    setActiveFilters((prev) => prev.filter((f) => f !== key));
  };

  const clearAllFilters = () => {
    setFilters({
      type: "all",
      subject: "all",
      grade: "all",
      status: "all",
      difficulty: "all",
    });
    setActiveFilters([]);
  };

  const handleDuplicate = (id: string) => {
    toast.success("Form duplicated successfully");
  };

  const handleSchedule = (id: string) => {
    toast.info("Opening scheduler...");
  };

  const handleRetire = (id: string) => {
    toast.success("Form retired");
  };

  const stats = {
    total: mockFormTemplates.length,
    tests: mockFormTemplates.filter((f) => f.metadata.type === "test").length,
    surveys: mockFormTemplates.filter((f) => f.metadata.type === "survey").length,
    active: mockFormTemplates.filter((f) => f.status === "active").length,
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Form Templates</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your assessment templates and configurations
            </p>
          </div>
          <Button onClick={onCreateForm} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{stats.total}</span>
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">{stats.tests}</span>
            <span className="text-sm text-muted-foreground">Tests</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-accent">{stats.surveys}</span>
            <span className="text-sm text-muted-foreground">Surveys</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-lg font-semibold text-foreground">{stats.active}</span>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          {/* Filter Dropdowns */}
          <Select value={filters.type} onValueChange={(v) => handleFilterChange("type", v)}>
            <SelectTrigger className="w-32 bg-background">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="test">Test</SelectItem>
              <SelectItem value="survey">Survey</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="practice">Practice</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.subject} onValueChange={(v) => handleFilterChange("subject", v)}>
            <SelectTrigger className="w-36 bg-background">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(v) => handleFilterChange("status", v)}>
            <SelectTrigger className="w-32 bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                More Filters
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <div className="px-2 py-1.5 text-sm font-medium">Difficulty</div>
              <DropdownMenuCheckboxItem
                checked={filters.difficulty === "easy"}
                onCheckedChange={() => handleFilterChange("difficulty", filters.difficulty === "easy" ? "all" : "easy")}
              >
                Easy
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.difficulty === "medium"}
                onCheckedChange={() => handleFilterChange("difficulty", filters.difficulty === "medium" ? "all" : "medium")}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.difficulty === "hard"}
                onCheckedChange={() => handleFilterChange("difficulty", filters.difficulty === "hard" ? "all" : "hard")}
              >
                Hard
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-sm font-medium">Grade</div>
              {grades.slice(0, 4).map((grade) => (
                <DropdownMenuCheckboxItem
                  key={grade}
                  checked={filters.grade === grade}
                  onCheckedChange={() => handleFilterChange("grade", filters.grade === grade ? "all" : grade)}
                >
                  {grade}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1" />

          {/* View Mode Toggle */}
          <div className="flex items-center bg-background border border-border rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mt-3 pt-3 border-t border-border"
            >
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="gap-1 capitalize cursor-pointer hover:bg-secondary/80"
                  onClick={() => clearFilter(filter)}
                >
                  {filter}: {filters[filter as keyof typeof filters]}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-6">
                Clear all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No templates found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
            {filteredForms.map((form, index) => (
              <FormCard
                key={form.id}
                form={form}
                index={index}
                onView={onViewForm}
                onEdit={onEditForm}
                onDuplicate={handleDuplicate}
                onSchedule={handleSchedule}
                onRetire={handleRetire}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
