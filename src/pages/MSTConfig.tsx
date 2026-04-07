import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft, Save, Plus, Minus, GitBranch, Layers, Settings2,
  Gauge, Info, ChevronDown, ChevronUp, Package,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// ── Types ──
interface Stage {
  id: string;
  name: string;
  branches: number;
  modules: Module[];
}

interface Module {
  id: string;
  name: string;
  itemCount: number;
}

interface Panel {
  id: string;
  name: string;
  stages: Stage[];
}

interface BranchRoute {
  id: string;
  fromStage: string;
  toStage: string;
  module: string;
  fromTheta: string;
  toTheta: string;
}

// ── Section Card ──
const SectionCard = ({ title, icon: Icon, children, className, delay = 0 }: {
  title: string; icon: React.ElementType; children: React.ReactNode; className?: string; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    <Card className={cn("border border-border shadow-sm", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  </motion.div>
);

// ── Counter component ──
const Counter = ({ value, onChange, min = 1, max = 20, label }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; label?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
    <div className="flex items-center gap-0">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-r-none bg-primary/10 border-primary/20 hover:bg-primary/20"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className="h-4 w-4 text-primary" />
      </Button>
      <div className="h-9 w-12 flex items-center justify-center border-y border-border bg-background text-sm font-medium">
        {value}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-l-none bg-primary/10 border-primary/20 hover:bg-primary/20"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus className="h-4 w-4 text-primary" />
      </Button>
    </div>
  </div>
);

// ── Field row ──
const FieldRow = ({ label, children, required, info }: {
  label: string; children: React.ReactNode; required?: boolean; info?: string;
}) => (
  <div className="grid grid-cols-[180px_1fr] items-center gap-3">
    <div className="flex items-center gap-1.5">
      <Label className="text-sm text-muted-foreground whitespace-nowrap">{label}</Label>
      {required && <span className="text-destructive text-xs">*</span>}
      {info && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3.5 w-3.5 text-muted-foreground/50 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[220px] text-xs">{info}</TooltipContent>
        </Tooltip>
      )}
    </div>
    <div>{children}</div>
  </div>
);

const MSTConfig = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [activeTab, setActiveTab] = useState("config");

  // MST Algorithm State
  const [numberOfPanels, setNumberOfPanels] = useState(1);
  const [stagesPerPanel, setStagesPerPanel] = useState(2);
  const [stages, setStages] = useState<Stage[]>([
    { id: "s1", name: "Stage 1", branches: 1, modules: [{ id: "m1", name: "Module 1", itemCount: 0 }] },
    { id: "s2", name: "Stage 2", branches: 1, modules: [{ id: "m2", name: "Module 2", itemCount: 0 }] },
  ]);
  const [branchingRule, setBranchingRule] = useState<"mfi" | "sum-score">("mfi");
  const [branchRoutes, setBranchRoutes] = useState<BranchRoute[]>([
    { id: "br1", fromStage: "Stage 1", toStage: "Stage 2", module: "Module 1", fromTheta: "", toTheta: "" },
  ]);

  // Item Pool
  const [irtFrom, setIrtFrom] = useState("0");
  const [irtTo, setIrtTo] = useState("0");
  const [intervalPoint, setIntervalPoint] = useState([0.5]);
  const [enemyItemExclusion, setEnemyItemExclusion] = useState(false);

  // Theta Estimation
  const [initialAbility, setInitialAbility] = useState("map");
  const [interimAbility, setInterimAbility] = useState("mle");
  const [priorMean, setPriorMean] = useState("0");
  const [priorSD, setPriorSD] = useState("0");
  const [findingMaximum, setFindingMaximum] = useState("newton-raphson");
  const [startTheta, setStartTheta] = useState("0");
  const [tolerance, setTolerance] = useState("0");
  const [maxIterations, setMaxIterations] = useState("0");
  const [maxDelta, setMaxDelta] = useState("0");
  const [backNavigation, setBackNavigation] = useState(false);

  // Update stages when count changes
  const updateStagesCount = (newCount: number) => {
    setStagesPerPanel(newCount);
    const newStages: Stage[] = [];
    for (let i = 0; i < newCount; i++) {
      if (stages[i]) {
        newStages.push(stages[i]);
      } else {
        newStages.push({
          id: `s${i + 1}`,
          name: `Stage ${i + 1}`,
          branches: 1,
          modules: [{ id: `m${i + 1}`, name: `Module ${i + 1}`, itemCount: 0 }],
        });
      }
    }
    setStages(newStages);

    // Rebuild branch routes
    const routes: BranchRoute[] = [];
    for (let i = 0; i < newCount - 1; i++) {
      routes.push({
        id: `br${i + 1}`,
        fromStage: newStages[i].name,
        toStage: newStages[i + 1].name,
        module: newStages[i + 1].modules[0]?.name || `Module ${i + 2}`,
        fromTheta: "",
        toTheta: "",
      });
    }
    setBranchRoutes(routes);
  };

  const updateStageName = (index: number, name: string) => {
    setStages(prev => prev.map((s, i) => i === index ? { ...s, name } : s));
  };

  const updateStageBranches = (index: number, branches: number) => {
    setStages(prev => prev.map((s, i) => {
      if (i !== index) return s;
      const modules: Module[] = [];
      for (let j = 0; j < branches; j++) {
        if (s.modules[j]) {
          modules.push(s.modules[j]);
        } else {
          modules.push({ id: `m${index}-${j}`, name: `Module ${j + 1}`, itemCount: 0 });
        }
      }
      return { ...s, branches, modules };
    }));
  };

  const handleSave = () => {
    toast({ title: "MST Configuration Saved", description: "Your MST algorithm configuration has been saved." });
  };

  // Sidebar nav items
  const navSections = [
    { id: "algorithm", label: "MST Algorithm", icon: GitBranch },
    { id: "item-pool", label: "Item Pool", icon: Package },
    { id: "panels", label: "Panels & Stages", icon: Layers },
    { id: "theta", label: "Theta Estimation", icon: Gauge },
  ];

  const [activeSection, setActiveSection] = useState("algorithm");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(`mst-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/admin">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/forms">Manage Adaptive Test</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Adaptive MST</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-xl font-bold text-foreground mt-1">Create MST Assessment</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-primary px-6">
          <TabsList className="bg-transparent h-auto p-0 gap-0">
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-foreground data-[state=active]:bg-primary-foreground/10 data-[state=active]:text-primary-foreground text-primary-foreground/70 px-6 py-3"
            >
              Assessment Details
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-foreground data-[state=active]:bg-primary-foreground/10 data-[state=active]:text-primary-foreground text-primary-foreground/70 px-6 py-3"
            >
              Assign Items/Config
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-foreground data-[state=active]:bg-primary-foreground/10 data-[state=active]:text-primary-foreground text-primary-foreground/70 px-6 py-3"
            >
              Preferences
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Assessment Details Tab */}
        <TabsContent value="details" className="flex-1 p-6 mt-0">
          <SectionCard title="Assessment Details" icon={Settings2} delay={0}>
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Assessment Name" required>
                <Input placeholder="Enter assessment name" />
              </FieldRow>
              <FieldRow label="Assessment Code" required>
                <Input placeholder="Enter assessment code" />
              </FieldRow>
              <FieldRow label="Description">
                <Input placeholder="Enter description" />
              </FieldRow>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Assign Items/Config Tab */}
        <TabsContent value="config" className="flex-1 mt-0">
          <div className="flex h-full">
            {/* Left Nav */}
            <motion.aside
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-56 border-r border-border bg-card shrink-0 p-3 sticky top-0 self-start"
            >
              <nav className="space-y-1">
                {navSections.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* MST Algorithm Configuration */}
              <div id="mst-algorithm">
                <SectionCard title="MST Algorithm Configuration" icon={GitBranch} delay={0.1}>
                  <div className="space-y-6">
                    {/* Number of Panels */}
                    <Counter label="Number of Panels" value={numberOfPanels} onChange={setNumberOfPanels} min={1} max={10} />

                    {/* Stages configuration */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted-foreground">Stages in each panel</Label>
                        <Counter value={stagesPerPanel} onChange={updateStagesCount} min={1} max={10} />
                      </div>

                      {/* Stages table */}
                      <div className="bg-background rounded-lg border border-border overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-muted/30 border-b border-border">
                          <Label className="text-sm font-semibold text-foreground">Stages Name</Label>
                          <Label className="text-sm font-semibold text-foreground">No. of Branches</Label>
                          <Label className="text-sm font-semibold text-foreground">No. of Items in Modules</Label>
                        </div>
                        {stages.map((stage, index) => (
                          <div key={stage.id} className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-border/50 last:border-0 items-center">
                            <Input
                              value={stage.name}
                              onChange={(e) => updateStageName(index, e.target.value)}
                              className="bg-background"
                            />
                            <Counter
                              value={stage.branches}
                              onChange={(v) => updateStageBranches(index, v)}
                              min={1}
                              max={10}
                            />
                            <div className="flex items-center gap-2 flex-wrap">
                              {stage.modules.map((mod) => (
                                <Input
                                  key={mod.id}
                                  value={mod.name}
                                  onChange={(e) => {
                                    setStages(prev => prev.map((s, i) => {
                                      if (i !== index) return s;
                                      return {
                                        ...s,
                                        modules: s.modules.map(m =>
                                          m.id === mod.id ? { ...m, name: e.target.value } : m
                                        ),
                                      };
                                    }));
                                  }}
                                  className="w-28 bg-background"
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Branching Rule */}
                    <div className="flex items-center gap-4">
                      <Label className="text-sm font-medium text-foreground">Branching Rule</Label>
                      <RadioGroup
                        value={branchingRule}
                        onValueChange={(v) => setBranchingRule(v as "mfi" | "sum-score")}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="mfi" id="mfi" />
                          <Label htmlFor="mfi" className="text-sm cursor-pointer">MFI</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="sum-score" id="sum-score" />
                          <Label htmlFor="sum-score" className="text-sm cursor-pointer">Sum score</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Branch Routing Table */}
                    {branchRoutes.length > 0 && (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 px-2">
                          <span className="text-sm text-muted-foreground" />
                          <span className="text-sm text-muted-foreground" />
                          <span className="text-sm font-semibold text-foreground text-right">From (Theta)</span>
                          <span className="text-sm font-semibold text-foreground text-right">To (Theta)</span>
                        </div>
                        {Array.from({ length: numberOfPanels }).map((_, pIdx) => (
                          <div key={pIdx} className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Panel {pIdx + 1}</Label>
                            {branchRoutes.map((route) => (
                              <div key={route.id} className="bg-background rounded-lg border border-border p-4">
                                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 items-center">
                                  <span className="text-sm text-muted-foreground">{route.fromStage} – {route.toStage}</span>
                                  <span className="text-sm text-muted-foreground">{route.module}</span>
                                  <Select>
                                    <SelectTrigger className="bg-background">
                                      <SelectValue placeholder="No selection" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">No selection</SelectItem>
                                      <SelectItem value="-3">-3.0</SelectItem>
                                      <SelectItem value="-2">-2.0</SelectItem>
                                      <SelectItem value="-1">-1.0</SelectItem>
                                      <SelectItem value="0">0.0</SelectItem>
                                      <SelectItem value="1">1.0</SelectItem>
                                      <SelectItem value="2">2.0</SelectItem>
                                      <SelectItem value="3">3.0</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Select>
                                    <SelectTrigger className="bg-background">
                                      <SelectValue placeholder="No selection" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">No selection</SelectItem>
                                      <SelectItem value="-3">-3.0</SelectItem>
                                      <SelectItem value="-2">-2.0</SelectItem>
                                      <SelectItem value="-1">-1.0</SelectItem>
                                      <SelectItem value="0">0.0</SelectItem>
                                      <SelectItem value="1">1.0</SelectItem>
                                      <SelectItem value="2">2.0</SelectItem>
                                      <SelectItem value="3">3.0</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </SectionCard>
              </div>

              {/* Item Pool */}
              <div id="mst-item-pool">
                <SectionCard title="Item Pool" icon={Package} delay={0.2}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* IRT Scale */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">IRT Scale</Label>
                        <div className="flex items-center gap-2">
                          <div className="space-y-1">
                            <Input
                              value={irtFrom}
                              onChange={(e) => setIrtFrom(e.target.value)}
                              className="w-24 bg-background"
                            />
                            <p className="text-xs text-destructive">
                              {irtFrom === "0" && "IRT Scale from value should not be empty, 0 and should be lesser than to value"}
                            </p>
                          </div>
                          <span className="text-muted-foreground">–</span>
                          <div className="space-y-1">
                            <Input
                              value={irtTo}
                              onChange={(e) => setIrtTo(e.target.value)}
                              className="w-24 bg-background"
                            />
                            <p className="text-xs text-destructive">
                              {irtTo === "0" && "IRT Scale to value should not be empty, 0 and should be greater than from value"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Interval Point */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Interval point: {intervalPoint[0]}</Label>
                        <Slider
                          value={intervalPoint}
                          onValueChange={setIntervalPoint}
                          min={0}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Enemy Item Exclusion */}
                    <div className="flex items-center gap-3">
                      <Switch checked={enemyItemExclusion} onCheckedChange={setEnemyItemExclusion} />
                      <Label className="text-sm text-foreground">Enemy Item Exclusion</Label>
                    </div>
                  </div>
                </SectionCard>
              </div>

              {/* Panels & Stages */}
              <div id="mst-panels">
                <SectionCard title="Panels & Stages" icon={Layers} delay={0.3}>
                  {Array.from({ length: numberOfPanels }).map((_, pIdx) => (
                    <div key={pIdx} className="space-y-4">
                      {/* Panel Tab */}
                      <div className="bg-primary rounded-t-lg px-4 py-2">
                        <span className="text-sm font-medium text-primary-foreground">Panel {pIdx + 1}</span>
                      </div>

                      {/* Stages */}
                      <div className="space-y-4">
                        {stages.map((stage) => (
                          <Collapsible key={stage.id} defaultOpen>
                            <div className="bg-muted/30 rounded-lg border border-border overflow-hidden">
                              <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
                                <Badge variant="secondary" className="text-sm font-medium">
                                  {stage.name}
                                </Badge>
                                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-4 space-y-3">
                                  <div className="flex flex-wrap gap-3">
                                    {stage.modules.map((mod) => (
                                      <div key={mod.id} className="space-y-1">
                                        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 flex items-center gap-2">
                                          <span className="text-sm font-medium">{mod.name}</span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                                          >
                                            Add Item +
                                          </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground pl-1">
                                          No of Items: {mod.itemCount}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ))}
                      </div>
                    </div>
                  ))}
                </SectionCard>
              </div>

              {/* Theta Estimation */}
              <div id="mst-theta">
                <SectionCard title="Theta Estimation" icon={Gauge} delay={0.4}>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <FieldRow label="Initial Ability Estimation" required>
                        <Select value={initialAbility} onValueChange={setInitialAbility}>
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="map">MAP</SelectItem>
                            <SelectItem value="mle">MLE</SelectItem>
                            <SelectItem value="eap">EAP</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldRow>

                      <div className="space-y-3">
                        <Label className="text-sm text-muted-foreground">Prior Theta Distribution for Bayesian Score</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">MEAN</Label>
                            <Input value={priorMean} onChange={(e) => setPriorMean(e.target.value)} className="bg-background" />
                            {priorMean === "0" && (
                              <p className="text-xs text-destructive">Mean value should not be empty</p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">SD</Label>
                            <Input value={priorSD} onChange={(e) => setPriorSD(e.target.value)} className="bg-background" />
                            {priorSD === "0" && (
                              <p className="text-xs text-destructive">SD value should not be 0 or empty</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <FieldRow label="Interim Ability Estimation" required>
                        <Select value={interimAbility} onValueChange={setInterimAbility}>
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mle">Maximum Likelihood Estimation</SelectItem>
                            <SelectItem value="map">MAP</SelectItem>
                            <SelectItem value="eap">EAP</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldRow>

                      <div className="flex items-center gap-3">
                        <Switch checked={backNavigation} onCheckedChange={setBackNavigation} />
                        <Label className="text-sm text-foreground">Back Navigation Within Stage</Label>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <FieldRow label="Finding maximum in likelihood" required>
                        <Select value={findingMaximum} onValueChange={setFindingMaximum}>
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newton-raphson">Newton Raphson Method</SelectItem>
                            <SelectItem value="fisher-scoring">Fisher Scoring</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldRow>

                      <div className="space-y-1">
                        <FieldRow label="Start Theta Value">
                          <Input value={startTheta} onChange={(e) => setStartTheta(e.target.value)} className="bg-background" />
                        </FieldRow>
                      </div>

                      <div className="space-y-1">
                        <FieldRow label="Tolerance" required>
                          <Input value={tolerance} onChange={(e) => setTolerance(e.target.value)} className="bg-background" />
                        </FieldRow>
                        {tolerance === "0" && (
                          <p className="text-xs text-destructive ml-[192px]">Tolerance value should be greater than 0 and lesser than 1</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <FieldRow label="Maximum Iterations" required>
                          <Input value={maxIterations} onChange={(e) => setMaxIterations(e.target.value)} className="bg-background" />
                        </FieldRow>
                        {maxIterations === "0" && (
                          <p className="text-xs text-destructive ml-[192px]">Maximum iteration value should be greater than 0 and lesser or equal to 100</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <FieldRow label="Maximum Allowed Delta" required>
                          <Input value={maxDelta} onChange={(e) => setMaxDelta(e.target.value)} className="bg-background" />
                        </FieldRow>
                        {maxDelta === "0" && (
                          <p className="text-xs text-destructive ml-[192px]">Maximum Allowed Delta value should be greater than 0 and lesser than 1</p>
                        )}
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="flex-1 p-6 mt-0">
          <SectionCard title="Preferences" icon={Settings2} delay={0}>
            <p className="text-sm text-muted-foreground">
              Configure additional preferences for this MST assessment.
            </p>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MSTConfig;
