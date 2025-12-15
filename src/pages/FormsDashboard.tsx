import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { Repository } from "@/types/forms";
import { toast } from "sonner";

interface Agreement {
  id: string;
  name: string;
  content: string;
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

const FormsDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "forms";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Repository state
  const [repositories, setRepositories] = useState<Repository[]>(initialMockRepositories);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState(initialMockRepositories[0]?.id || "");
  const [expandedRepos, setExpandedRepos] = useState<string[]>([initialMockRepositories[0]?.id || ""]);
  const [rowsPerPage, setRowsPerPage] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Repository dialog state
  const [createRepoDialogOpen, setCreateRepoDialogOpen] = useState(false);
  const [renameRepoDialogOpen, setRenameRepoDialogOpen] = useState(false);
  const [deleteRepoDialogOpen, setDeleteRepoDialogOpen] = useState(false);
  const [selectedRepoForAction, setSelectedRepoForAction] = useState<Repository | null>(null);
  // Test Sequence State
  const [testSequenceSteps, setTestSequenceSteps] = useState<TestSequenceStep[]>([
    {
      id: "1",
      type: "system-check",
      name: "System Check",
      order: 1,
      config: {
        popBlocker: true,
        camera: true,
        browser: true,
        microphone: false,
        screenShare: false,
      },
    },
    {
      id: "2",
      type: "form",
      name: "Forms",
      order: 2,
      formIds: [],
      formSelectionMode: "in-order",
    },
  ]);
  const [expandedSteps, setExpandedSteps] = useState<string[]>(["1", "2"]);

// Agreement State
const [agreements, setAgreements] = useState<Agreement[]>([
  {
    id: "1",
    name: "Terms and Conditions",
    content: "By proceeding with this assessment, you agree to the following terms and conditions...",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-20",
  },
  {
    id: "2",
    name: "Privacy Policy",
    content: "Your privacy is important to us. This policy outlines how we collect and use your data...",
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
        return <span className="text-foreground">Completed</span>;
      case "published":
        return <span className="text-foreground">Published</span>;
      case "active":
        return <span className="text-foreground">Active</span>;
      case "draft":
        return <span className="text-muted-foreground">Draft</span>;
      case "archived":
        return <span className="text-muted-foreground">Archived</span>;
      default:
        return <span>{status}</span>;
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
    agreement.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "forms":
        return (
          <>
            {/* Toolbar */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-primary text-primary-foreground px-4 py-1.5">
                  Repository
                </Badge>
                <Select value={selectedRepositoryId} onValueChange={setSelectedRepositoryId}>
                  <SelectTrigger className="w-64 bg-background">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {repositories.map((repo) => (
                      <SelectItem key={repo.id} value={repo.id}>
                        {repo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by assessment name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-1" />
                      Create New
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem onClick={() => navigate("/forms/create")}>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Form
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/forms/configurations")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configuration
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/surveys/create")}>
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Survey
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

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
                        ASSESSMENT NAME
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
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center gap-1">
                        SCHEDULED
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
                  {filteredForms.map((form) => (
                    <TableRow
                      key={form.id}
                      className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border"
                    >
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{form.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{form.model}</TableCell>
                      <TableCell>{getStatusBadge(form.status)}</TableCell>
                      <TableCell className="text-center text-foreground">{form.scheduled}</TableCell>
                      <TableCell className="text-foreground">
                        {format(new Date(form.updatedAt), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell className="text-center text-foreground">{form.version}</TableCell>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredForms.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Folder className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No assessments found in this repository</p>
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

      case "configuration":
        return (
          <>
            <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-primary text-primary-foreground px-4 py-1.5">
                  Repository
                </Badge>
                <Select value={selectedRepositoryId} onValueChange={setSelectedRepositoryId}>
                  <SelectTrigger className="w-64 bg-background">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {repositories.map((repo) => (
                      <SelectItem key={repo.id} value={repo.id}>
                        {repo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      case "survey":
        return (
          <>
            <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-primary text-primary-foreground px-4 py-1.5">
                  Repository
                </Badge>
                <Select value={selectedRepositoryId} onValueChange={setSelectedRepositoryId}>
                  <SelectTrigger className="w-64 bg-background">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {repositories.map((repo) => (
                      <SelectItem key={repo.id} value={repo.id}>
                        {repo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      case "test-sequence":
        return (
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Test Sequence Builder</h2>
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
                <Button variant="outline">Save Sequence</Button>
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

      case "agreement":
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">Saras</span>
              <span className="text-[10px] text-muted-foreground block -mt-1">TEST & ASSESSMENT</span>
            </div>
          </div>
          <div className="ml-6">
            <span className="text-xs text-muted-foreground">Manage Assessments</span>
            <h1 className="text-lg font-semibold text-foreground -mt-0.5">Manage Assessments</h1>
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
        {/* Repository Sidebar */}
        <aside className="w-80 border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Repositories</span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => setCreateRepoDialogOpen(true)}
                  title="Create repository"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => {
                    const repo = repositories.find(r => r.id === selectedRepositoryId);
                    if (repo) openRenameDialog(repo);
                  }}
                  disabled={!selectedRepositoryId}
                  title="Rename selected repository"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => {
                    const repo = repositories.find(r => r.id === selectedRepositoryId);
                    if (repo) openDeleteDialog(repo);
                  }}
                  disabled={!selectedRepositoryId || repositories.length <= 1}
                  title="Delete selected repository"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-2">
            {repositories.map((repo) => (
              <div key={repo.id} className="group">
                <button
                  onClick={() => {
                    setSelectedRepositoryId(repo.id);
                    toggleRepoExpand(repo.id);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors ${
                    selectedRepositoryId === repo.id ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                  }`}
                >
                  {expandedRepos.includes(repo.id) ? (
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                  {expandedRepos.includes(repo.id) ? (
                    <FolderOpen className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  ) : (
                    <Folder className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  )}
                  <span className="flex-1 truncate">{repo.name}</span>
                  <span className="text-xs text-muted-foreground">({repo.formCount})</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        openRenameDialog(repo);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(repo);
                        }}
                        disabled={repositories.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-muted/50 px-2 pt-2">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("forms")}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === "forms"
                    ? "bg-card text-foreground shadow-sm border border-border border-b-0"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Forms
              </button>
              <button
                onClick={() => setActiveTab("configuration")}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === "configuration"
                    ? "bg-card text-foreground shadow-sm border border-border border-b-0"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Configuration
              </button>
              <button
                onClick={() => setActiveTab("survey")}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === "survey"
                    ? "bg-card text-foreground shadow-sm border border-border border-b-0"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Survey
              </button>
              <button
                onClick={() => setActiveTab("test-sequence")}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === "test-sequence"
                    ? "bg-card text-foreground shadow-sm border border-border border-b-0"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Test Sequence
              </button>
              <button
                onClick={() => setActiveTab("agreement")}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === "agreement"
                    ? "bg-card text-foreground shadow-sm border border-border border-b-0"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Agreement
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex flex-col">{renderTabContent()}</div>

          {/* Pagination - Only for list views */}
          {activeTab !== "test-sequence" && (
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
