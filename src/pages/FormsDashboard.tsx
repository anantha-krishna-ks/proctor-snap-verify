import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Plus,
  Search,
  MoreVertical,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  PlayCircle,
  Settings,
  ClipboardList,
  Monitor,
  FileText,
  FileSignature,
  Eye,
  Pencil,
  Clock,
  ArrowLeft,
  ListOrdered,
  FileStack,
  GraduationCap,
  Calendar,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { mockForms, mockRepositories as initialMockRepositories, mockConfigurations } from "@/data/formsMockData";
import { mockSurveys } from "@/data/surveyMockData";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { RepositoryDialogs } from "@/components/RepositoryDialogs";
import { SortableStepCard } from "@/components/SortableStepCard";
import { FormsSidebar } from "@/components/FormsSidebar";
import type { Repository } from "@/types/forms";
import { toast } from "sonner";

interface Agreement {
  id: string;
  name: string;
  content: string;
  repositoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface TestSequenceStep {
  id: string;
  type: "system-check" | "form" | "survey" | "agreement";
  name: string;
  order: number;
  config?: {
    popBlocker?: boolean;
    camera?: boolean;
    browser?: boolean;
    microphone?: boolean;
    screenShare?: boolean;
  };
  formIds?: string[];
  formSelectionMode?: "in-order" | "random";
  surveyId?: string;
  agreementText?: string;
}

// Mock test sequences data with detailed steps
const mockTestSequencesData: Record<string, TestSequenceStep[]> = {
  seq1: [
    { id: "s1-1", type: "system-check", name: "System Check", order: 1, config: { popBlocker: true, camera: true, browser: true, microphone: true, screenShare: false } },
    { id: "s1-2", type: "agreement", name: "Terms Agreement", order: 2, agreementText: "I agree to the exam terms and conditions." },
    { id: "s1-3", type: "form", name: "Math Assessment", order: 3, formIds: ["form-1"], formSelectionMode: "in-order" },
    { id: "s1-4", type: "form", name: "Science Assessment", order: 4, formIds: ["form-2"], formSelectionMode: "in-order" },
    { id: "s1-5", type: "survey", name: "Feedback Survey", order: 5, surveyId: "survey-1" },
  ],
  seq2: [
    { id: "s2-1", type: "system-check", name: "System Check", order: 1, config: { popBlocker: true, camera: true, browser: false, microphone: false, screenShare: false } },
    { id: "s2-2", type: "form", name: "English Test", order: 2, formIds: ["form-1", "form-2"], formSelectionMode: "random" },
    { id: "s2-3", type: "form", name: "Reading Comprehension", order: 3, formIds: ["form-3"], formSelectionMode: "in-order" },
  ],
  seq3: [
    { id: "s3-1", type: "system-check", name: "System Check", order: 1, config: { popBlocker: true, camera: true, browser: true, microphone: true, screenShare: true } },
    { id: "s3-2", type: "agreement", name: "NDA Agreement", order: 2, agreementText: "I agree to keep all test content confidential." },
    { id: "s3-3", type: "form", name: "Advanced Math", order: 3, formIds: ["form-1"], formSelectionMode: "in-order" },
    { id: "s3-4", type: "form", name: "Physics", order: 4, formIds: ["form-2"], formSelectionMode: "in-order" },
    { id: "s3-5", type: "form", name: "Chemistry", order: 5, formIds: ["form-3"], formSelectionMode: "in-order" },
    { id: "s3-6", type: "survey", name: "Mid Survey", order: 6, surveyId: "survey-1" },
    { id: "s3-7", type: "survey", name: "Exit Survey", order: 7, surveyId: "survey-2" },
  ],
  seq4: [
    { id: "s4-1", type: "form", name: "Quick Quiz", order: 1, formIds: ["form-1"], formSelectionMode: "in-order" },
    { id: "s4-2", type: "survey", name: "Satisfaction Survey", order: 2, surveyId: "survey-1" },
  ],
};

const mockTestSequences = [
  { id: "seq1", name: "Complete Assessment Sequence", steps: 5, forms: 3, surveys: 1, createdAt: "2024-01-15", status: "active" },
  { id: "seq2", name: "Basic Proctoring Flow", steps: 3, forms: 2, surveys: 0, createdAt: "2024-02-20", status: "active" },
  { id: "seq3", name: "Advanced Test Series", steps: 7, forms: 5, surveys: 2, createdAt: "2024-03-01", status: "draft" },
  { id: "seq4", name: "Quick Evaluation Pack", steps: 2, forms: 1, surveys: 1, createdAt: "2024-03-10", status: "active" },
];

// Mock projects data
const mockProjects = [
  { id: "proj-1", name: "NSE Certification 2025", description: "National certification exams" },
  { id: "proj-2", name: "Corporate Training Q1", description: "Employee skill assessments" },
  { id: "proj-3", name: "University Entrance Exams", description: "Undergraduate admissions" },
  { id: "proj-4", name: "Professional License Tests", description: "Industry certifications" },
];

type ViewMode = "forms" | "survey" | "configuration" | "agreement" | "test-sequence" | "blueprint" | "assessment" | "branching" | "adaptive-forms";

const FormsDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Project state
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0]?.id || "");
  const [viewMode, setViewMode] = useState<ViewMode>("forms");
  
  // Repository state
  const [repositories, setRepositories] = useState<Repository[]>(initialMockRepositories);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState(initialMockRepositories[0]?.id || "");
  const [expandedRepos, setExpandedRepos] = useState<string[]>([initialMockRepositories[0]?.id || ""]);
  const [rowsPerPage, setRowsPerPage] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatingSequence, setIsCreatingSequence] = useState(false);
  const [editingSequenceId, setEditingSequenceId] = useState<string | null>(null);
  
  const selectedProject = mockProjects.find(p => p.id === selectedProjectId);
  
  // Repository dialog state
  const [createRepoDialogOpen, setCreateRepoDialogOpen] = useState(false);
  const [renameRepoDialogOpen, setRenameRepoDialogOpen] = useState(false);
  const [deleteRepoDialogOpen, setDeleteRepoDialogOpen] = useState(false);
  const [selectedRepoForAction, setSelectedRepoForAction] = useState<Repository | null>(null);
  
  // Test Sequence State - default steps for new sequences
  const defaultSteps: TestSequenceStep[] = [
    { id: "1", type: "system-check", name: "System Check", order: 1, config: { popBlocker: true, camera: true, browser: true, microphone: false, screenShare: false } },
    { id: "2", type: "form", name: "Forms", order: 2, formIds: [], formSelectionMode: "in-order" },
  ];
  const [testSequenceSteps, setTestSequenceSteps] = useState<TestSequenceStep[]>(defaultSteps);
  const [expandedSteps, setExpandedSteps] = useState<string[]>(["1", "2"]);
  const [sequenceName, setSequenceName] = useState("");

  // Function to handle editing a sequence
  const handleEditSequence = (sequenceId: string) => {
    const sequenceSteps = mockTestSequencesData[sequenceId];
    const sequence = mockTestSequences.find(s => s.id === sequenceId);
    if (sequenceSteps && sequence) {
      setTestSequenceSteps(sequenceSteps);
      setExpandedSteps(sequenceSteps.map(s => s.id));
      setEditingSequenceId(sequenceId);
      setSequenceName(sequence.name);
      setIsCreatingSequence(true);
    }
  };

  // Function to handle creating a new sequence
  const handleCreateNewSequence = () => {
    setTestSequenceSteps(defaultSteps);
    setExpandedSteps(["1", "2"]);
    setEditingSequenceId(null);
    setSequenceName("");
    setIsCreatingSequence(true);
  };

  // Function to go back to list
  const handleBackToList = () => {
    setIsCreatingSequence(false);
    setEditingSequenceId(null);
    setTestSequenceSteps(defaultSteps);
    setExpandedSteps(["1", "2"]);
    setSequenceName("");
  };

// Agreement State
const [agreements, setAgreements] = useState<Agreement[]>([
  {
    id: "1",
    name: "Terms and Conditions",
    content: "By proceeding with this assessment, you agree to the following terms and conditions...",
    repositoryId: "repo-1",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-20",
  },
  {
    id: "2",
    name: "Privacy Policy",
    content: "Your privacy is important to us. This policy outlines how we collect and use your data...",
    repositoryId: "repo-1",
    createdAt: "2024-01-10",
    updatedAt: "2024-03-01",
  },
]);
const [agreementDialogOpen, setAgreementDialogOpen] = useState(false);
const [editingAgreement, setEditingAgreement] = useState<Agreement | null>(null);
const [agreementForm, setAgreementForm] = useState({ name: "", content: "" });
const [agreementPreviewMode, setAgreementPreviewMode] = useState(false);

// Drag and drop sensors
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    setTestSequenceSteps((prev) => {
      const oldIndex = prev.findIndex((step) => step.id === active.id);
      const newIndex = prev.findIndex((step) => step.id === over.id);
      const newSteps = arrayMove(prev, oldIndex, newIndex);
      // Update order numbers
      return newSteps.map((step, index) => ({ ...step, order: index + 1 }));
    });
  }
};

  const toggleRepoExpand = (repoId: string) => {
    setExpandedRepos((prev) => (prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId]));
  };

  const toggleStepExpand = (stepId: string) => {
    setExpandedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]));
  };

  // Repository CRUD handlers
  const handleCreateRepository = (name: string) => {
    const newRepo: Repository = {
      id: `repo-${Date.now()}`,
      name,
      formCount: 0,
      createdAt: new Date().toISOString(),
    };
    setRepositories((prev) => [...prev, newRepo]);
    setSelectedRepositoryId(newRepo.id);
    setExpandedRepos((prev) => [...prev, newRepo.id]);
    toast.success(`Repository "${name}" created successfully`);
  };

  const handleRenameRepository = (id: string, name: string) => {
    setRepositories((prev) =>
      prev.map((repo) => (repo.id === id ? { ...repo, name } : repo))
    );
    toast.success(`Repository renamed to "${name}"`);
  };

  const handleDeleteRepository = (id: string) => {
    const repo = repositories.find((r) => r.id === id);
    setRepositories((prev) => prev.filter((r) => r.id !== id));
    if (selectedRepositoryId === id) {
      const remaining = repositories.filter((r) => r.id !== id);
      setSelectedRepositoryId(remaining[0]?.id || "");
    }
    toast.success(`Repository "${repo?.name}" deleted`);
  };

  const openRenameDialog = (repo: Repository) => {
    setSelectedRepoForAction(repo);
    setRenameRepoDialogOpen(true);
  };

  const openDeleteDialog = (repo: Repository) => {
    setSelectedRepoForAction(repo);
    setDeleteRepoDialogOpen(true);
  };

  const filteredForms = mockForms.filter(
    (form) =>
      form.repositoryId === selectedRepositoryId &&
      (form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.code.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const filteredConfigurations = mockConfigurations.filter(
    (config) =>
      config.repositoryId === selectedRepositoryId && config.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredSurveys = mockSurveys.filter(
    (survey) =>
      survey.repositoryId === selectedRepositoryId && survey.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedRepoData = repositories.find((r) => r.id === selectedRepositoryId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-cyan-500 hover:bg-cyan-500 text-white border-0 font-medium">Completed</Badge>;
      case "published":
        return <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-0 font-medium">Published</Badge>;
      case "in-progress":
        return <Badge className="bg-amber-400 hover:bg-amber-400 text-white border-0 font-medium">In Progress</Badge>;
      case "active":
        return <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-0 font-medium">Active</Badge>;
      case "draft":
        return <Badge variant="secondary" className="font-medium">Draft</Badge>;
      case "archived":
        return <Badge variant="secondary" className="text-muted-foreground font-medium">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPages = Math.ceil(filteredForms.length / parseInt(rowsPerPage));
  
  const updateSystemCheckConfig = (stepId: string, key: string, value: boolean) => {
    setTestSequenceSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId && step.type === "system-check") {
          return {
            ...step,
            config: {
              ...step.config,
              [key]: value,
            },
          };
        }
        return step;
      }),
    );
  };

  const updateFormIds = (stepId: string, formId: string, checked: boolean) => {
    setTestSequenceSteps((prev) =>
      prev.map((s) => {
        if (s.id === stepId) {
          const currentIds = s.formIds || [];
          const newIds = checked
            ? [...currentIds, formId]
            : currentIds.filter((id) => id !== formId);
          return { ...s, formIds: newIds };
        }
        return s;
      })
    );
  };

  const updateFormSelectionMode = (stepId: string, mode: "in-order" | "random") => {
    setTestSequenceSteps((prev) =>
      prev.map((s) =>
        s.id === stepId ? { ...s, formSelectionMode: mode } : s
      )
    );
  };

  const addStep = (type: "form" | "survey" | "agreement") => {
    const newStep: TestSequenceStep = {
      id: Date.now().toString(),
      type,
      name: type === "form" ? "Forms" : type === "survey" ? "Survey" : "Agreement",
      order: testSequenceSteps.length + 1,
      formIds: type === "form" ? [] : undefined,
      formSelectionMode: type === "form" ? "in-order" : undefined,
      surveyId: type === "survey" ? "" : undefined,
      agreementText: type === "agreement" ? "" : undefined,
    };
    setTestSequenceSteps((prev) => [...prev, newStep]);
    setExpandedSteps((prev) => [...prev, newStep.id]);
  };

  const removeStep = (stepId: string) => {
    setTestSequenceSteps((prev) => prev.filter((step) => step.id !== stepId));
  };

  const moveStep = (stepId: string, direction: "up" | "down") => {
    const index = testSequenceSteps.findIndex((s) => s.id === stepId);
    if ((direction === "up" && index === 0) || (direction === "down" && index === testSequenceSteps.length - 1)) {
      return;
    }
    const newSteps = [...testSequenceSteps];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    newSteps.forEach((step, i) => (step.order = i + 1));
    setTestSequenceSteps(newSteps);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "system-check":
        return <Monitor className="h-5 w-5 text-primary" />;
      case "form":
        return <PlayCircle className="h-5 w-5 text-primary" />;
      case "survey":
        return <ClipboardList className="h-5 w-5 text-primary" />;
      case "agreement":
        return <FileText className="h-5 w-5 text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  // Agreement handlers
  const openAddAgreement = () => {
    setEditingAgreement(null);
    setAgreementForm({ name: "", content: "" });
    setAgreementPreviewMode(false);
    setAgreementDialogOpen(true);
  };

  const openEditAgreement = (agreement: Agreement) => {
    setEditingAgreement(agreement);
    setAgreementForm({ name: agreement.name, content: agreement.content });
    setAgreementPreviewMode(false);
    setAgreementDialogOpen(true);
  };

  const handleSaveAgreement = () => {
    if (!agreementForm.name.trim()) return;
    
    if (editingAgreement) {
      setAgreements((prev) =>
        prev.map((a) =>
          a.id === editingAgreement.id
            ? { ...a, name: agreementForm.name, content: agreementForm.content, updatedAt: new Date().toISOString().split("T")[0] }
            : a
        )
      );
    } else {
      const newAgreement: Agreement = {
        id: Date.now().toString(),
        name: agreementForm.name,
        content: agreementForm.content,
        repositoryId: selectedRepositoryId,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setAgreements((prev) => [...prev, newAgreement]);
    }
    setAgreementDialogOpen(false);
  };

  const handleDeleteAgreement = (id: string) => {
    setAgreements((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAgreements = agreements.filter((agreement) =>
    agreement.repositoryId === selectedRepositoryId &&
    agreement.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render test sequence content
  const renderTestSequenceContent = () => {
    const filteredSequences = mockTestSequences.filter((seq) =>
      seq.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isCreatingSequence) {
      return (
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToList}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h2 className="text-lg font-semibold text-foreground">
                {editingSequenceId ? "Edit Sequence" : "Create New Sequence"}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {testSequenceSteps.length} steps
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Step
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem onClick={() => addStep("form")}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Form
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addStep("survey")}>
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Survey
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addStep("agreement")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Agreement
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (!sequenceName.trim()) {
                    toast.error("Please enter a sequence name");
                    return;
                  }
                  toast.success(editingSequenceId ? "Sequence updated successfully" : "Sequence saved successfully");
                  handleBackToList();
                }}
              >
                Save Sequence
              </Button>
            </div>
          </div>

          {/* Sequence Name Input */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <Label htmlFor="sequence-name" className="text-sm font-medium mb-2 block">
                Sequence Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sequence-name"
                placeholder="Enter sequence name..."
                value={sequenceName}
                onChange={(e) => setSequenceName(e.target.value)}
                className="max-w-md bg-background"
                maxLength={100}
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="flex-1 overflow-auto p-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={testSequenceSteps.map((step) => step.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 max-w-4xl mx-auto">
                  {testSequenceSteps.map((step) => (
                    <SortableStepCard
                      key={step.id}
                      step={step}
                      isExpanded={expandedSteps.includes(step.id)}
                      onToggleExpand={toggleStepExpand}
                      onRemoveStep={removeStep}
                      onUpdateSystemCheckConfig={updateSystemCheckConfig}
                      onUpdateFormIds={updateFormIds}
                      onUpdateFormSelectionMode={updateFormSelectionMode}
                      forms={mockForms}
                      surveys={mockSurveys}
                    />
                  ))}

                  {testSequenceSteps.length === 0 && (
                    <div className="text-center py-12">
                      <Monitor className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No steps configured</h3>
                      <p className="text-muted-foreground mb-4">Add steps to build your test sequence</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      );
    }

    // List view (default)
    return (
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ListOrdered className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Test Sequences</h2>
            <Badge variant="secondary" className="text-xs">
              {mockTestSequences.length} total
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sequences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={handleCreateNewSequence}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Sequence
            </Button>
          </div>
        </div>

        {/* Sequences Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead className="font-semibold text-foreground">SEQUENCE NAME</TableHead>
                <TableHead className="text-center font-semibold text-foreground">STEPS</TableHead>
                <TableHead className="text-center font-semibold text-foreground">FORMS</TableHead>
                <TableHead className="text-center font-semibold text-foreground">SURVEYS</TableHead>
                <TableHead className="font-semibold text-foreground">CREATED</TableHead>
                <TableHead className="font-semibold text-foreground">STATUS</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSequences.map((sequence) => (
                <TableRow
                  key={sequence.id}
                  className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border"
                >
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ListOrdered className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">{sequence.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-foreground">{sequence.steps}</TableCell>
                  <TableCell className="text-center text-foreground">{sequence.forms}</TableCell>
                  <TableCell className="text-center text-foreground">{sequence.surveys}</TableCell>
                  <TableCell className="text-foreground">{sequence.createdAt}</TableCell>
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
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => handleEditSequence(sequence.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditSequence(sequence.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <ListOrdered className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No test sequences found</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCreateNewSequence} 
                        className="mt-2"
                      >
                        Create your first sequence
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    // Handle different view modes
    if (viewMode === "test-sequence") {
      return renderTestSequenceContent();
    }

    if (viewMode === "blueprint") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <FileStack className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Blueprint</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Create and manage test blueprints to define the structure and composition of your assessments.
          </p>
          <Button className="mt-6">
            <Plus className="h-4 w-4 mr-2" />
            Create Blueprint
          </Button>
        </div>
      );
    }

    if (viewMode === "assessment") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <GraduationCap className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Assessment</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Schedule and manage assessments for candidates with comprehensive proctoring options.
          </p>
          <Button className="mt-6">
            <Plus className="h-4 w-4 mr-2" />
            Create Assessment
          </Button>
        </div>
      );
    }

    if (viewMode === "branching") {
      return (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GitBranch className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Branching Assessments</h2>
              <Badge variant="secondary" className="text-xs">
                Adaptive Testing
              </Badge>
            </div>

            <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate("/forms/branching")}>
              <Plus className="h-4 w-4 mr-1" />
              Create Branching Assessment
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Existing branching assessment cards */}
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/forms/branching/branch-assess-1")}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="text-xs">Published</Badge>
                    <span className="text-xs text-muted-foreground">v3</span>
                  </div>
                  <CardTitle className="text-base mt-2">Adaptive Math Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    An adaptive assessment that adjusts difficulty based on learner performance
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>9 nodes</span>
                    <span>•</span>
                    <span>10 connections</span>
                    <span>•</span>
                    <span>3 learner paths</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/forms/branching/branch-assess-2")}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">Draft</Badge>
                    <span className="text-xs text-muted-foreground">v1</span>
                  </div>
                  <CardTitle className="text-base mt-2">Language Proficiency Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Adaptive language assessment for placement
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>0 nodes</span>
                    <span>•</span>
                    <span>0 connections</span>
                    <span>•</span>
                    <span>0 learner paths</span>
                  </div>
                </CardContent>
              </Card>

              {/* Create new card */}
              <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center min-h-[180px]" onClick={() => navigate("/forms/branching")}>
                <div className="text-center p-6">
                  <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Create New</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    // Adaptive Forms view
    if (viewMode === "adaptive-forms") {
      const adaptiveForms = [
        { id: "af-1", name: "Math Adaptive Test", type: "CAT", status: "published", items: 120, createdBy: "Manjunath T", createdAt: "2026-02-18T14:40:00Z", updatedAt: "2026-03-04T04:36:00Z" },
        { id: "af-2", name: "English Proficiency CAT", type: "CAT", status: "in-progress", items: 85, createdBy: "Vasu R", createdAt: "2026-02-20T10:35:00Z", updatedAt: "2026-02-20T10:35:00Z" },
        { id: "af-3", name: "Science MST Level 1", type: "MST", status: "draft", items: 60, createdBy: "Harshitha C H", createdAt: "2026-02-17T15:28:00Z", updatedAt: "2026-02-17T15:29:00Z" },
        { id: "af-4", name: "Aptitude CAT", type: "CAT", status: "completed", items: 200, createdBy: "Harshitha C H", createdAt: "2026-02-17T15:06:00Z", updatedAt: "2026-02-17T15:07:00Z" },
      ];

      const filteredAdaptive = adaptiveForms.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return (
        <>
          <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground">Adaptive Forms</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search adaptive forms"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Form
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem onClick={() => navigate("/admin/products/prod-1/adaptive-test")}>
                    <Brain className="h-4 w-4 mr-2" />
                    CAT
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("MST configuration coming soon")}>
                    <GitBranch className="h-4 w-4 mr-2" />
                    MST
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Modified Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdaptive.map((form) => (
                  <TableRow key={form.id} className="cursor-pointer hover:bg-muted/30">
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{form.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">{form.type}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(form.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{form.items}</TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(form.createdAt), "dd MMM yyyy, hh:mm a")}</TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(form.updatedAt), "dd MMM yyyy, hh:mm a")}</TableCell>
                    <TableCell className="text-muted-foreground">{form.createdBy}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => navigate("/admin/products/prod-1/adaptive-test")}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      );
    }

    if (viewMode === "forms") {
      return (
        <>
          <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground">Form</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by form name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>

              <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate("/forms/create")}>
                <Plus className="h-4 w-4 mr-1" />
                Create Form
              </Button>

              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      NAME
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">MODEL</TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      STATUS
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">SCHEDULED</TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      CREATED DATE
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      MODIFIED DATE
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">SECTIONS</TableHead>
                  <TableHead className="font-semibold text-foreground">CREATED BY</TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      VERSION
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => (
                  <TableRow
                    key={form.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border"
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">{form.name}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{form.model}</TableCell>
                    <TableCell>{getStatusBadge(form.status)}</TableCell>
                    <TableCell className="text-center text-foreground">{form.scheduled}</TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(form.createdAt), "dd-MM-yyyy hh:mm a")}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(form.updatedAt), "dd-MM-yyyy hh:mm a")}
                    </TableCell>
                    <TableCell className="text-center text-foreground">{form.sections}</TableCell>
                    <TableCell className="text-foreground">{form.createdBy}</TableCell>
                    <TableCell className="text-center text-primary font-medium">{form.version}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Preview</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/scheduling")}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredForms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Folder className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No forms found</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/forms/create")}
                          className="mt-2"
                        >
                          Create your first assessment
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      );
    }

    // Configuration view
    if (viewMode === "configuration") {
      return (
        <>
          <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Configuration</h2>
              <Badge variant="secondary" className="text-xs">
                {filteredConfigurations.length} total
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by configuration name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate("/forms/configurations/create")}>
                <Plus className="h-4 w-4 mr-1" />
                Create Configuration
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      CONFIGURATION NAME
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">DURATION</TableHead>
                  <TableHead className="font-semibold text-foreground">LANGUAGE</TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      SECURITY
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      MODIFIED DATE
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      VERSION
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfigurations.map((config) => (
                  <TableRow
                    key={config.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border"
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{config.name}</span>
                        {config.isDefault && (
                          <Badge className="bg-success/10 text-success border-success/20 text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {config.examRules.duration} min
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {config.examRules.language}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {config.security.fullScreenMode && (
                          <Badge variant="outline" className="text-xs">Full Screen</Badge>
                        )}
                        {config.security.shuffleQuestions && (
                          <Badge variant="outline" className="text-xs">Shuffle</Badge>
                        )}
                        {config.security.preventCopyPaste && (
                          <Badge variant="outline" className="text-xs">No Copy</Badge>
                        )}
                        {!config.security.fullScreenMode &&
                          !config.security.shuffleQuestions &&
                          !config.security.preventCopyPaste && (
                            <span className="text-xs text-muted-foreground italic">None</span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(config.updatedAt), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="text-center text-foreground">{config.version}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          {!config.isDefault && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredConfigurations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Settings className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No configurations found in this repository</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/forms/configurations/create")}
                          className="mt-2"
                        >
                          Create your first configuration
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      );
    }

    // Survey view
    if (viewMode === "survey") {
      return (
        <>
          <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Survey</h2>
              <Badge variant="secondary" className="text-xs">
                {filteredSurveys.length} total
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search surveys"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate("/surveys/create")}>
                <Plus className="h-4 w-4 mr-1" />
                Create Survey
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">SURVEY NAME</TableHead>
                  <TableHead className="font-semibold text-foreground">STATUS</TableHead>
                  <TableHead className="font-semibold text-foreground">QUESTIONS</TableHead>
                  <TableHead className="font-semibold text-foreground">MODIFIED DATE</TableHead>
                  <TableHead className="font-semibold text-foreground">VERSION</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSurveys.map((survey) => (
                  <TableRow
                    key={survey.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border"
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{survey.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(survey.status)}</TableCell>
                    <TableCell className="text-center text-foreground">{survey.items.length}</TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(survey.updatedAt), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="text-center text-foreground">{survey.version}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      );
    }

    // Agreement view
    if (viewMode === "agreement") {
      return (
        <>
          {/* Toolbar */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileSignature className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Agreements</h2>
              <Badge variant="secondary" className="text-xs">
                {agreements.length} total
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agreements"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90" onClick={openAddAgreement}>
                <Plus className="h-4 w-4 mr-1" />
                Add Agreement
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">AGREEMENT NAME</TableHead>
                  <TableHead className="font-semibold text-foreground">CREATED DATE</TableHead>
                  <TableHead className="font-semibold text-foreground">MODIFIED DATE</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgreements.map((agreement) => (
                  <TableRow
                    key={agreement.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border"
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileSignature className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{agreement.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(agreement.createdAt), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(agreement.updatedAt), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => openEditAgreement(agreement)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteAgreement(agreement.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAgreements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileSignature className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No agreements found</p>
                        <Button variant="outline" size="sm" onClick={openAddAgreement} className="mt-2">
                          Create your first agreement
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Agreement Sheet */}
          <Sheet open={agreementDialogOpen} onOpenChange={setAgreementDialogOpen}>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{editingAgreement ? "Edit Agreement" : "Add Agreement"}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="agreement-name">Name</Label>
                  <Input
                    id="agreement-name"
                    placeholder="Enter agreement name"
                    value={agreementForm.name}
                    onChange={(e) => setAgreementForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Content</Label>
                    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                      <Button
                        variant={!agreementPreviewMode ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => setAgreementPreviewMode(false)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant={agreementPreviewMode ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => setAgreementPreviewMode(true)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                  {!agreementPreviewMode ? (
                    <RichTextEditor
                      value={agreementForm.content}
                      onChange={(value) => setAgreementForm((prev) => ({ ...prev, content: value }))}
                      placeholder="Enter the agreement content..."
                    />
                  ) : (
                    <div 
                      className="min-h-[200px] p-4 border border-input rounded-md bg-muted/30 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: agreementForm.content || '<p class="text-muted-foreground">No content to preview</p>' }}
                    />
                  )}
                </div>
              </div>
              <SheetFooter className="gap-2">
                <Button variant="outline" onClick={() => setAgreementDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAgreement} disabled={!agreementForm.name.trim()}>
                  {editingAgreement ? "Save Changes" : "Add Agreement"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </>
      );
    }

    return null;
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
          activeMenu={viewMode}
          onMenuChange={(menu) => {
            if (menu === "schedule") {
              navigate("/scheduling");
              return;
            }
            setViewMode(menu as ViewMode);
          }}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            {renderTabContent()}
          </div>

          {/* Pagination - Only for list views */}
          {(viewMode === "forms" || viewMode === "survey" || viewMode === "configuration" || viewMode === "agreement") && (
            <div className="p-4 border-t border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  1-{Math.min(parseInt(rowsPerPage), filteredForms.length)} of {filteredForms.length}
                </span>
                <span className="ml-4">Rows per page:</span>
                <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
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
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm text-foreground">1/1</span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

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

      {/* Repository CRUD Dialogs */}
      <RepositoryDialogs
        repositories={repositories}
        createDialogOpen={createRepoDialogOpen}
        setCreateDialogOpen={setCreateRepoDialogOpen}
        renameDialogOpen={renameRepoDialogOpen}
        setRenameDialogOpen={setRenameRepoDialogOpen}
        deleteDialogOpen={deleteRepoDialogOpen}
        setDeleteDialogOpen={setDeleteRepoDialogOpen}
        selectedRepository={selectedRepoForAction}
        onCreateRepository={handleCreateRepository}
        onRenameRepository={handleRenameRepository}
        onDeleteRepository={handleDeleteRepository}
      />
    </div>
  );
};

export default FormsDashboard;
