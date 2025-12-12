import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Camera,
  Globe,
  Shield,
  Mic,
  FileText,
  GripVertical,
  ChevronUp,
  X
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { mockForms, mockRepositories, mockConfigurations } from "@/data/formsMockData";
import { mockSurveys } from "@/data/surveyMockData";
import { format } from "date-fns";

interface TestSequenceStep {
  id: string;
  type: 'system-check' | 'form' | 'survey' | 'agreement';
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
  surveyId?: string;
  agreementText?: string;
}

const FormsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("forms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepository, setSelectedRepository] = useState(mockRepositories[0]?.id || "");
  const [expandedRepos, setExpandedRepos] = useState<string[]>([mockRepositories[0]?.id || ""]);
  const [rowsPerPage, setRowsPerPage] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);

  // Test Sequence State
  const [testSequenceSteps, setTestSequenceSteps] = useState<TestSequenceStep[]>([
    {
      id: '1',
      type: 'system-check',
      name: 'System Check',
      order: 1,
      config: {
        popBlocker: true,
        camera: true,
        browser: true,
        microphone: false,
        screenShare: false,
      }
    }
  ]);
  const [expandedSteps, setExpandedSteps] = useState<string[]>(['1']);

  const toggleRepoExpand = (repoId: string) => {
    setExpandedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    );
  };

  const toggleStepExpand = (stepId: string) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const filteredForms = mockForms.filter(
    (form) =>
      form.repositoryId === selectedRepository &&
      (form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       form.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredConfigurations = mockConfigurations.filter(
    (config) =>
      config.repositoryId === selectedRepository &&
      config.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSurveys = mockSurveys.filter(
    (survey) =>
      survey.repositoryId === selectedRepository &&
      survey.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRepoData = mockRepositories.find(r => r.id === selectedRepository);

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
    setTestSequenceSteps(prev => prev.map(step => {
      if (step.id === stepId && step.type === 'system-check') {
        return {
          ...step,
          config: {
            ...step.config,
            [key]: value
          }
        };
      }
      return step;
    }));
  };

  const addStep = (type: 'form' | 'survey' | 'agreement') => {
    const newStep: TestSequenceStep = {
      id: Date.now().toString(),
      type,
      name: type === 'form' ? 'Form' : type === 'survey' ? 'Survey' : 'Agreement',
      order: testSequenceSteps.length + 1,
      formIds: type === 'form' ? [] : undefined,
      surveyId: type === 'survey' ? '' : undefined,
      agreementText: type === 'agreement' ? '' : undefined,
    };
    setTestSequenceSteps(prev => [...prev, newStep]);
    setExpandedSteps(prev => [...prev, newStep.id]);
  };

  const removeStep = (stepId: string) => {
    setTestSequenceSteps(prev => prev.filter(step => step.id !== stepId));
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = testSequenceSteps.findIndex(s => s.id === stepId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === testSequenceSteps.length - 1)) {
      return;
    }
    const newSteps = [...testSequenceSteps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    newSteps.forEach((step, i) => step.order = i + 1);
    setTestSequenceSteps(newSteps);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'system-check':
        return <Monitor className="h-5 w-5 text-primary" />;
      case 'form':
        return <PlayCircle className="h-5 w-5 text-primary" />;
      case 'survey':
        return <ClipboardList className="h-5 w-5 text-primary" />;
      case 'agreement':
        return <FileText className="h-5 w-5 text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'forms':
        return (
          <>
            {/* Toolbar */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-primary text-primary-foreground px-4 py-1.5">
                  Repository
                </Badge>
                <Select value={selectedRepository} onValueChange={setSelectedRepository}>
                  <SelectTrigger className="w-64 bg-background">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {mockRepositories.map((repo) => (
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
                      <TableCell className="text-muted-foreground">
                        {form.model}
                      </TableCell>
                      <TableCell>{getStatusBadge(form.status)}</TableCell>
                      <TableCell className="text-center text-foreground">
                        {form.scheduled}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {format(new Date(form.updatedAt), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell className="text-center text-foreground">
                        {form.version}
                      </TableCell>
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
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
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

      case 'configuration':
        return (
          <>
            <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-primary text-primary-foreground px-4 py-1.5">
                  Repository
                </Badge>
                <Select value={selectedRepository} onValueChange={setSelectedRepository}>
                  <SelectTrigger className="w-64 bg-background">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {mockRepositories.map((repo) => (
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
                    placeholder="Search configurations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate("/forms/configurations")}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Configuration
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                    <TableHead className="w-12"><Checkbox /></TableHead>
                    <TableHead className="font-semibold text-foreground">CONFIGURATION NAME</TableHead>
                    <TableHead className="font-semibold text-foreground">STATUS</TableHead>
                    <TableHead className="font-semibold text-foreground">MODIFIED DATE</TableHead>
                    <TableHead className="font-semibold text-foreground">VERSION</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConfigurations.map((config) => (
                    <TableRow key={config.id} className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border">
                      <TableCell><Checkbox /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{config.name}</span>
                          {config.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge('active')}</TableCell>
                      <TableCell className="text-foreground">{format(new Date(config.updatedAt), "dd-MM-yyyy")}</TableCell>
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

      case 'survey':
        return (
          <>
            <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-primary text-primary-foreground px-4 py-1.5">
                  Repository
                </Badge>
                <Select value={selectedRepository} onValueChange={setSelectedRepository}>
                  <SelectTrigger className="w-64 bg-background">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {mockRepositories.map((repo) => (
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
                    <TableHead className="w-12"><Checkbox /></TableHead>
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
                    <TableRow key={survey.id} className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border">
                      <TableCell><Checkbox /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{survey.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(survey.status)}</TableCell>
                      <TableCell className="text-center text-foreground">{survey.items.length}</TableCell>
                      <TableCell className="text-foreground">{format(new Date(survey.updatedAt), "dd-MM-yyyy")}</TableCell>
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

      case 'test-sequence':
        return (
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Test Sequence Builder</h2>
                <Badge variant="secondary" className="text-xs">{testSequenceSteps.length} steps</Badge>
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
                    <DropdownMenuItem onClick={() => addStep('form')}>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Form
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addStep('survey')}>
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Survey
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addStep('agreement')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Agreement
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline">
                  Save Sequence
                </Button>
              </div>
            </div>

            {/* Steps List */}
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-3 max-w-4xl mx-auto">
                {testSequenceSteps.map((step, index) => (
                  <Card key={step.id} className="border border-border">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                          <Badge variant="outline" className="text-xs font-mono">
                            Step {step.order}
                          </Badge>
                          {getStepIcon(step.type)}
                          <CardTitle className="text-base font-medium">{step.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => moveStep(step.id, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => moveStep(step.id, 'down')}
                            disabled={index === testSequenceSteps.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => toggleStepExpand(step.id)}
                          >
                            {expandedSteps.includes(step.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          {step.type !== 'system-check' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeStep(step.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedSteps.includes(step.id) && (
                      <CardContent className="pt-0 pb-4 px-4">
                        {step.type === 'system-check' && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-8">
                            <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <Label htmlFor="pop-blocker" className="text-sm">Pop Blocker</Label>
                              </div>
                              <Switch
                                id="pop-blocker"
                                checked={step.config?.popBlocker || false}
                                onCheckedChange={(checked) => updateSystemCheckConfig(step.id, 'popBlocker', checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Camera className="h-4 w-4 text-muted-foreground" />
                                <Label htmlFor="camera" className="text-sm">Camera</Label>
                              </div>
                              <Switch
                                id="camera"
                                checked={step.config?.camera || false}
                                onCheckedChange={(checked) => updateSystemCheckConfig(step.id, 'camera', checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <Label htmlFor="browser" className="text-sm">Browser</Label>
                              </div>
                              <Switch
                                id="browser"
                                checked={step.config?.browser || false}
                                onCheckedChange={(checked) => updateSystemCheckConfig(step.id, 'browser', checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Mic className="h-4 w-4 text-muted-foreground" />
                                <Label htmlFor="microphone" className="text-sm">Microphone</Label>
                              </div>
                              <Switch
                                id="microphone"
                                checked={step.config?.microphone || false}
                                onCheckedChange={(checked) => updateSystemCheckConfig(step.id, 'microphone', checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-muted-foreground" />
                                <Label htmlFor="screen-share" className="text-sm">Screen Share</Label>
                              </div>
                              <Switch
                                id="screen-share"
                                checked={step.config?.screenShare || false}
                                onCheckedChange={(checked) => updateSystemCheckConfig(step.id, 'screenShare', checked)}
                              />
                            </div>
                          </div>
                        )}
                        
                        {step.type === 'form' && (
                          <div className="pl-8 space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm text-muted-foreground">Select forms to include in this step</Label>
                              <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Form
                              </Button>
                            </div>
                            <div className="border border-dashed border-border rounded-lg p-6 text-center">
                              <PlayCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">No forms added yet</p>
                              <p className="text-xs text-muted-foreground mt-1">Click "Add Form" to select forms from the repository</p>
                            </div>
                          </div>
                        )}
                        
                        {step.type === 'survey' && (
                          <div className="pl-8 space-y-3">
                            <Label className="text-sm text-muted-foreground">Select a survey for this step</Label>
                            <Select>
                              <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Choose a survey" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover">
                                {mockSurveys.map((survey) => (
                                  <SelectItem key={survey.id} value={survey.id}>
                                    {survey.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {step.type === 'agreement' && (
                          <div className="pl-8 space-y-3">
                            <Label className="text-sm text-muted-foreground">Agreement Text</Label>
                            <textarea
                              className="w-full min-h-[120px] p-3 rounded-md border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Enter the agreement text that candidates must accept before proceeding..."
                            />
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
                
                {testSequenceSteps.length === 0 && (
                  <div className="text-center py-12">
                    <Monitor className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No steps configured</h3>
                    <p className="text-muted-foreground mb-4">Add steps to build your test sequence</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            {mockRepositories.map((repo) => (
              <div key={repo.id}>
                <button
                  onClick={() => {
                    setSelectedRepository(repo.id);
                    toggleRepoExpand(repo.id);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors ${
                    selectedRepository === repo.id 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted text-foreground"
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
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-border bg-card">
            <div className="flex">
              <button
                onClick={() => setActiveTab('forms')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'forms'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Forms
              </button>
              <button
                onClick={() => setActiveTab('configuration')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'configuration'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Configuration
              </button>
              <button
                onClick={() => setActiveTab('survey')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'survey'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Survey
              </button>
              <button
                onClick={() => setActiveTab('test-sequence')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'test-sequence'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Test Sequence
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex flex-col">
            {renderTabContent()}
          </div>

          {/* Pagination - Only for list views */}
          {activeTab !== 'test-sequence' && (
            <div className="p-4 border-t border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>1-{Math.min(parseInt(rowsPerPage), filteredForms.length)} of {filteredForms.length}</span>
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
    </div>
  );
};

export default FormsDashboard;