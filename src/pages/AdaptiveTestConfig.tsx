import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { mockProjects } from "@/data/projectMockData";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft, Save, Plus, Minus, Brain, Target, Settings2,
  Gauge, ShieldCheck, FolderTree, ChevronRight, Info, Layers,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ── Types ──
interface ContentBalancingFolder {
  id: string;
  name: string;
  children?: ContentBalancingFolder[];
  itemCount: number;
}

interface SelectedFolder {
  id: string;
  name: string;
  numberOfItems: number;
  percentage: number;
  includeSubFolders: boolean;
}

interface ItemExposureRow {
  id: string;
  itemPositionFrom: number;
  itemPositionTo: number;
  numberOfItems: number;
}

// ── Mock folder tree ──
const mockFolderTree: ContentBalancingFolder[] = [
  {
    id: "f1", name: "Item Bank", itemCount: 0, children: [
      { id: "f1a", name: "Quantitative Reasoning", itemCount: 45 },
      { id: "f1b", name: "Verbal Ability", itemCount: 32 },
      { id: "f1c", name: "Logical Reasoning", itemCount: 28, children: [
        { id: "f1c1", name: "Syllogisms", itemCount: 15 },
        { id: "f1c2", name: "Analogies", itemCount: 13 },
      ]},
      { id: "f1d", name: "Field Test Items", itemCount: 18 },
    ],
  },
];

// ── Nav tabs config ──
const navTabs = [
  { id: "content", label: "Content Balancing", icon: FolderTree },
  { id: "algorithm", label: "CAT Algorithm", icon: Brain },
  { id: "constraints", label: "Item Constraints", icon: ShieldCheck },
  { id: "theta", label: "Theta Estimation", icon: Gauge },
  { id: "likelihood", label: "Maximum Likelihood", icon: Target },
  { id: "balancing-method", label: "Balancing Method", icon: Settings2 },
] as const;

type TabId = typeof navTabs[number]["id"];

// ── Folder Tree Component ──
const FolderTreeItem = ({ folder, level = 0, onSelect, selectedIds }: {
  folder: ContentBalancingFolder; level?: number; onSelect: (f: ContentBalancingFolder) => void; selectedIds: string[];
}) => {
  const [expanded, setExpanded] = useState(level === 0);
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedIds.includes(folder.id);

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer text-sm transition-all hover:bg-accent/10",
          isSelected && "bg-primary/8 text-primary font-medium ring-1 ring-primary/20"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          if (folder.itemCount > 0) onSelect(folder);
        }}
      >
        {hasChildren && (
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform text-muted-foreground", expanded && "rotate-90")} />
        )}
        <FolderTree className="h-3.5 w-3.5 text-warning" />
        <span className="truncate">{folder.name}</span>
        {folder.itemCount > 0 && (
          <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5 font-mono">{folder.itemCount}</Badge>
        )}
      </div>
      {expanded && hasChildren && folder.children!.map(child => (
        <FolderTreeItem key={child.id} folder={child} level={level + 1} onSelect={onSelect} selectedIds={selectedIds} />
      ))}
    </div>
  );
};

// ── Field component ──
const Field = ({ label, children, required, info, stacked }: {
  label: string; children: React.ReactNode; required?: boolean; info?: string; stacked?: boolean;
}) => (
  <div className={cn(stacked ? "space-y-2" : "grid grid-cols-[220px_1fr] items-start gap-4")}>
    <div className={cn("flex items-center gap-1.5", !stacked && "pt-2")}>
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {required && <span className="text-destructive text-xs">*</span>}
      {info && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3 w-3 text-muted-foreground/40 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[220px] text-xs">{info}</TooltipContent>
        </Tooltip>
      )}
    </div>
    <div>{children}</div>
  </div>
);

// ── Main Component ──
const AdaptiveTestConfig = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [activeTab, setActiveTab] = useState<TabId>("content");

  // Product Selection
  const [selectedProduct, setSelectedProduct] = useState(productId || mockProjects[0]?.id || "");

  // Content Balancing
  const [balancingMode, setBalancingMode] = useState<"non-unified" | "unified">("non-unified");
  const [selectedFolders, setSelectedFolders] = useState<SelectedFolder[]>([
    { id: "f1a", name: "Quantitative Reasoning", numberOfItems: 5, percentage: 14, includeSubFolders: false },
  ]);
  const totalItems = 35;
  const selectedItemCount = selectedFolders.reduce((s, f) => s + f.numberOfItems, 0);

  // CAT Algorithm
  const [testType, setTestType] = useState<"fixed" | "variable">("fixed");
  const [irtMin, setIrtMin] = useState("-4.0");
  const [irtMax, setIrtMax] = useState("4.0");
  const [difficultyMin, setDifficultyMin] = useState("");
  const [difficultyMax, setDifficultyMax] = useState("");
  const [itemSelection, setItemSelection] = useState("maximum-fisher");
  const [itemExposure, setItemExposure] = useState("randomesque");
  const [exposureRows, setExposureRows] = useState<ItemExposureRow[]>([
    { id: "1", itemPositionFrom: 1, itemPositionTo: 5, numberOfItems: 3 },
  ]);

  // Item Constraints
  const [scoredItems, setScoredItems] = useState("1");
  const [unscoredItems, setUnscoredItems] = useState("0");
  const [noRepetition, setNoRepetition] = useState(false);
  const [enemyExclusion, setEnemyExclusion] = useState(false);

  // Theta Estimation
  const [initialAbility, setInitialAbility] = useState("map");
  const [priorMean, setPriorMean] = useState("");
  const [priorSD, setPriorSD] = useState("");
  const [interimEstimation, setInterimEstimation] = useState("mle");
  const [finalEstimation, setFinalEstimation] = useState("mle");

  // Finding Maximum
  const [maximumMethod, setMaximumMethod] = useState("newton-raphson");
  const [startTheta, setStartTheta] = useState("");
  const [tolerance, setTolerance] = useState("");
  const [maxIterations, setMaxIterations] = useState("");
  const [maxDelta, setMaxDelta] = useState("");

  // Content Balancing Method
  const [cbMethod, setCbMethod] = useState("script");
  const [adminSequence, setAdminSequence] = useState("1,1,1,2");

  const handleSelectFolder = (folder: ContentBalancingFolder) => {
    if (selectedFolders.find(f => f.id === folder.id)) {
      setSelectedFolders(prev => prev.filter(f => f.id !== folder.id));
    } else {
      setSelectedFolders(prev => [...prev, {
        id: folder.id, name: folder.name, numberOfItems: 0, percentage: 0, includeSubFolders: false,
      }]);
    }
  };

  const addExposureRow = () => {
    setExposureRows(prev => [...prev, {
      id: String(Date.now()), itemPositionFrom: 1, itemPositionTo: 1, numberOfItems: 0,
    }]);
  };

  const removeExposureRow = (id: string) => {
    setExposureRows(prev => prev.filter(r => r.id !== id));
  };

  const handleSave = () => {
    toast({ title: "Configuration saved", description: "Adaptive test settings updated successfully." });
  };

  // ── Section renderers ──
  const renderContent = () => (
    <div className="space-y-6">
      {/* Product selector */}
      <Field label="Program" required>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {mockProjects.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.code} — {p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* Stats chips */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Total:</span>
          <span className="font-semibold text-foreground">{totalItems}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm">
          <span className="text-primary/70">Selected:</span>
          <span className="font-semibold text-primary">{selectedItemCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm">
          <span className="text-muted-foreground">Time:</span>
          <span className="font-semibold text-foreground">180 min</span>
        </div>
        <div className="ml-auto inline-flex rounded-lg border border-border p-0.5 bg-muted/50">
          <button
            onClick={() => setBalancingMode("non-unified")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-all",
              balancingMode === "non-unified"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >Non-Unified</button>
          <button
            onClick={() => setBalancingMode("unified")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-all",
              balancingMode === "unified"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >Unified</button>
        </div>
      </div>

      {/* Folder tree + table */}
      <div className="grid grid-cols-[260px_1fr] gap-4">
        <div className="rounded-xl border border-border bg-card p-3 space-y-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Folders</p>
          {mockFolderTree.map(f => (
            <FolderTreeItem key={f.id} folder={f} onSelect={handleSelectFolder} selectedIds={selectedFolders.map(sf => sf.id)} />
          ))}
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <div className="grid grid-cols-[1fr_110px_90px_80px] gap-0 bg-muted/60 px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            <span>Folder</span>
            <span>Items</span>
            <span>%</span>
            <span>Sub-folders</span>
          </div>
          {selectedFolders.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground/60">
              Click folders on the left to add them
            </div>
          ) : (
            selectedFolders.map(sf => (
              <div key={sf.id} className="grid grid-cols-[1fr_110px_90px_80px] gap-0 px-4 py-3 border-b border-border/50 last:border-b-0 items-center hover:bg-muted/20 transition-colors">
                <span className="text-sm font-medium text-foreground">{sf.name}</span>
                <Input
                  type="number" value={sf.numberOfItems}
                  onChange={e => setSelectedFolders(prev => prev.map(f => f.id === sf.id ? { ...f, numberOfItems: Number(e.target.value) } : f))}
                  className="h-8 w-20"
                />
                <div className="flex items-center gap-1">
                  <Input
                    type="number" value={sf.percentage}
                    onChange={e => setSelectedFolders(prev => prev.map(f => f.id === sf.id ? { ...f, percentage: Number(e.target.value) } : f))}
                    className="h-8 w-16"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
                <Checkbox
                  checked={sf.includeSubFolders}
                  onCheckedChange={(checked) => setSelectedFolders(prev => prev.map(f => f.id === sf.id ? { ...f, includeSubFolders: !!checked } : f))}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderAlgorithm = () => (
    <div className="space-y-6">
      <Field label="Test Type(s)">
        <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/50">
          <button
            onClick={() => setTestType("fixed")}
            className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", testType === "fixed" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
          >Fixed</button>
          <button
            onClick={() => setTestType("variable")}
            className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", testType === "variable" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
          >Variable</button>
        </div>
      </Field>

      <Field label="IRT Scale Range" required info="The range of the IRT ability scale">
        <div className="flex items-center gap-2">
          <Input value={irtMin} onChange={e => setIrtMin(e.target.value)} placeholder="-4.0" className="w-28" />
          <span className="text-sm text-muted-foreground font-medium">→</span>
          <Input value={irtMax} onChange={e => setIrtMax(e.target.value)} placeholder="4.0" className="w-28" />
        </div>
      </Field>

      <Field label="First Item Difficulty" required info="IRT difficulty range for the first administered item">
        <div className="flex items-center gap-2">
          <Input value={difficultyMin} onChange={e => setDifficultyMin(e.target.value)} placeholder="Min" className="w-28" />
          <span className="text-sm text-muted-foreground font-medium">→</span>
          <Input value={difficultyMax} onChange={e => setDifficultyMax(e.target.value)} placeholder="Max" className="w-28" />
        </div>
      </Field>

      <Separator />

      <Field label="Item Selection" required>
        <Select value={itemSelection} onValueChange={setItemSelection}>
          <SelectTrigger className="w-full max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="maximum-fisher">Maximum Fisher Information</SelectItem>
            <SelectItem value="a-stratified">A-Stratified</SelectItem>
            <SelectItem value="weighted">Weighted Information</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="Item Exposure" required>
        <Select value={itemExposure} onValueChange={setItemExposure}>
          <SelectTrigger className="w-full max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="randomesque">Randomesque</SelectItem>
            <SelectItem value="sympson-hetter">Sympson-Hetter</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {/* Exposure rows */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exposure Control Ranges</p>
        {exposureRows.map((row) => (
          <div key={row.id} className="flex items-center gap-3 bg-card rounded-lg px-3 py-2 border border-border/50">
            <Label className="text-xs text-muted-foreground shrink-0">Pos</Label>
            <Input type="number" value={row.itemPositionFrom}
              onChange={e => setExposureRows(prev => prev.map(r => r.id === row.id ? { ...r, itemPositionFrom: Number(e.target.value) } : r))}
              className="h-8 w-16" />
            <span className="text-xs text-muted-foreground">→</span>
            <Input type="number" value={row.itemPositionTo}
              onChange={e => setExposureRows(prev => prev.map(r => r.id === row.id ? { ...r, itemPositionTo: Number(e.target.value) } : r))}
              className="h-8 w-16" />
            <Separator orientation="vertical" className="h-5" />
            <Label className="text-xs text-muted-foreground shrink-0">Items</Label>
            <Input type="number" value={row.numberOfItems}
              onChange={e => setExposureRows(prev => prev.map(r => r.id === row.id ? { ...r, numberOfItems: Number(e.target.value) } : r))}
              className="h-8 w-20" />
          </div>
        ))}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={addExposureRow} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />Add Row
          </Button>
          {exposureRows.length > 1 && (
            <Button size="sm" variant="outline" onClick={() => removeExposureRow(exposureRows[exposureRows.length - 1].id)} className="h-7 text-xs">
              <Minus className="h-3 w-3 mr-1" />Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderConstraints = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <Label className="text-sm text-muted-foreground">Scored Items</Label>
          <Input value={scoredItems} onChange={e => setScoredItems(e.target.value)} className="text-lg font-semibold" />
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <Label className="text-sm text-muted-foreground">Unscored Items</Label>
          <Input value={unscoredItems} onChange={e => setUnscoredItems(e.target.value)} className="text-lg font-semibold" />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-border p-4 hover:border-primary/30 hover:bg-primary/[0.02] transition-all group">
          <Checkbox checked={noRepetition} onCheckedChange={(c) => setNoRepetition(!!c)} className="mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">No Item Repetition</p>
            <p className="text-xs text-muted-foreground mt-0.5">Prevent the same item from appearing in multiple test sessions for a candidate</p>
          </div>
        </label>
        <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-border p-4 hover:border-primary/30 hover:bg-primary/[0.02] transition-all group">
          <Checkbox checked={enemyExclusion} onCheckedChange={(c) => setEnemyExclusion(!!c)} className="mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Enemy Item Exclusion</p>
            <p className="text-xs text-muted-foreground mt-0.5">Exclude items that conflict or overlap in content from the same test session</p>
          </div>
        </label>
      </div>
    </div>
  );

  const renderTheta = () => (
    <div className="space-y-6">
      <Field label="Initial Ability Estimation" required>
        <Select value={initialAbility} onValueChange={setInitialAbility}>
          <SelectTrigger className="w-full max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="map">MAP</SelectItem>
            <SelectItem value="eap">EAP</SelectItem>
            <SelectItem value="fixed">Fixed Value</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {initialAbility === "map" && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bayesian Prior Distribution</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Mean</Label>
              <Input value={priorMean} onChange={e => setPriorMean(e.target.value)} placeholder="eg: -1" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Standard Deviation</Label>
              <Input value={priorSD} onChange={e => setPriorSD(e.target.value)} placeholder="eg: 1" />
            </div>
          </div>
        </div>
      )}

      <Field label="Interim Ability Estimation" required>
        <Select value={interimEstimation} onValueChange={setInterimEstimation}>
          <SelectTrigger className="w-full max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mle">Maximum Likelihood Estimation</SelectItem>
            <SelectItem value="map">MAP</SelectItem>
            <SelectItem value="eap">EAP</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="Final Ability Estimation" required>
        <Select value={finalEstimation} onValueChange={setFinalEstimation}>
          <SelectTrigger className="w-full max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mle">Maximum Likelihood Estimation</SelectItem>
            <SelectItem value="map">MAP</SelectItem>
            <SelectItem value="eap">EAP</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );

  const renderLikelihood = () => (
    <div className="space-y-6">
      <Field label="Method" required>
        <Select value={maximumMethod} onValueChange={setMaximumMethod}>
          <SelectTrigger className="w-full max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newton-raphson">Newton Raphson Method</SelectItem>
            <SelectItem value="bisection">Bisection Method</SelectItem>
            <SelectItem value="brent">Brent's Method</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Start Theta Value</Label>
          <Input value={startTheta} onChange={e => setStartTheta(e.target.value)} placeholder="eg: -1" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Tolerance <span className="text-destructive">*</span></Label>
          <Input value={tolerance} onChange={e => setTolerance(e.target.value)} placeholder="eg: 1" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Max Iterations <span className="text-destructive">*</span></Label>
          <Input value={maxIterations} onChange={e => setMaxIterations(e.target.value)} placeholder="eg: 1" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Max Allowed Delta <span className="text-destructive">*</span></Label>
          <Input value={maxDelta} onChange={e => setMaxDelta(e.target.value)} placeholder="eg: 1" />
        </div>
      </div>
    </div>
  );

  const renderBalancingMethod = () => (
    <div className="space-y-6">
      <Field label="Method" required>
        <Select value={cbMethod} onValueChange={setCbMethod}>
          <SelectTrigger className="w-full max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="script">Script</SelectItem>
            <SelectItem value="ccat">CCAT</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      {cbMethod === "script" && (
        <Field label="Admin Sequence" required>
          <Input value={adminSequence} onChange={e => setAdminSequence(e.target.value)} className="w-full max-w-xs font-mono" placeholder="1,1,1,2" />
        </Field>
      )}
    </div>
  );

  const tabRenderers: Record<TabId, () => JSX.Element> = {
    content: renderContent,
    algorithm: renderAlgorithm,
    constraints: renderConstraints,
    theta: renderTheta,
    likelihood: renderLikelihood,
    "balancing-method": renderBalancingMethod,
  };

  const activeTabInfo = navTabs.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader searchQuery="" onSearchChange={() => {}} />
        <div className="flex-1 overflow-auto">
          {/* Compact header */}
          <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold text-foreground">Adaptive Test</h1>
                    <Badge className="bg-primary/10 text-primary border-0 text-[10px] font-semibold">CAT</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Computer adaptive testing configuration</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>Cancel</Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-3.5 w-3.5 mr-1.5" />Save
                </Button>
              </div>
            </div>
          </div>

          {/* Body: sidebar nav + content */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex gap-6">
              {/* Left nav */}
              <nav className="w-56 shrink-0 space-y-1 sticky top-20 self-start">
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {/* Right content */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="flex items-center gap-2.5 mb-6">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <activeTabInfo.icon className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <h2 className="text-base font-semibold text-foreground">{activeTabInfo.label}</h2>
                    </div>
                    {tabRenderers[activeTab]()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveTestConfig;
