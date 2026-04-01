import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft, Save, Plus, Minus, Brain, Target, Settings2,
  Gauge, ShieldCheck, FolderTree, ChevronRight, Info, Zap,
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

// ── Section wrapper ──
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
          "flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer text-sm transition-colors hover:bg-muted/50",
          isSelected && "bg-primary/10 text-primary font-medium"
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
          <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5">{folder.itemCount}</Badge>
        )}
      </div>
      {expanded && hasChildren && folder.children!.map(child => (
        <FolderTreeItem key={child.id} folder={child} level={level + 1} onSelect={onSelect} selectedIds={selectedIds} />
      ))}
    </div>
  );
};

// ── Field row ──
const FieldRow = ({ label, children, required, info }: {
  label: string; children: React.ReactNode; required?: boolean; info?: string;
}) => (
  <div className="grid grid-cols-[200px_1fr] items-center gap-3">
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

// ── Range Input ──
const RangeInput = ({ fromValue, toValue, onFromChange, onToChange, fromPlaceholder, toPlaceholder }: {
  fromValue: string; toValue: string; onFromChange: (v: string) => void; onToChange: (v: string) => void;
  fromPlaceholder?: string; toPlaceholder?: string;
}) => (
  <div className="flex items-center gap-2">
    <Input value={fromValue} onChange={e => onFromChange(e.target.value)} placeholder={fromPlaceholder || "eg: -1"} className="w-28" />
    <span className="text-sm text-muted-foreground">to</span>
    <Input value={toValue} onChange={e => onToChange(e.target.value)} placeholder={toPlaceholder || "eg: 1"} className="w-28" />
  </div>
);

// ── Main Component ──
const AdaptiveTestConfig = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

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
    toast({ title: "Configuration saved", description: "Adaptive test configuration has been saved successfully." });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader searchQuery="" onSearchChange={() => {}} />
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="border-b border-border bg-card">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center gap-3 mb-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-foreground">Adaptive Test Configuration</h1>
                    <Badge variant="secondary" className="text-xs">CAT</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">Configure computer adaptive testing parameters and item selection algorithms</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">

            {/* ─── Content Balancing ─── */}
            <SectionCard title="Content Balancing" icon={FolderTree} delay={0}>
              {/* Stats bar */}
              <div className="flex items-center gap-6 p-3 rounded-lg bg-muted/50 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total items in test:</span>
                  <span className="font-semibold text-foreground">{totalItems}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Selected:</span>
                  <span className="font-semibold text-primary">{selectedItemCount}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Test time:</span>
                  <span className="font-semibold text-foreground">180 min</span>
                </div>
                <div className="ml-auto flex gap-1">
                  <Button
                    size="sm"
                    variant={balancingMode === "non-unified" ? "default" : "outline"}
                    onClick={() => setBalancingMode("non-unified")}
                    className="h-7 text-xs"
                  >
                    Non-Unified
                  </Button>
                  <Button
                    size="sm"
                    variant={balancingMode === "unified" ? "default" : "outline"}
                    onClick={() => setBalancingMode("unified")}
                    className="h-7 text-xs"
                  >
                    Unified
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-[280px_1fr] gap-4">
                {/* Folder tree */}
                <div className="border border-border rounded-lg p-3 bg-card">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Item Folders</p>
                  {mockFolderTree.map(f => (
                    <FolderTreeItem
                      key={f.id}
                      folder={f}
                      onSelect={handleSelectFolder}
                      selectedIds={selectedFolders.map(sf => sf.id)}
                    />
                  ))}
                </div>

                {/* Selected folders table */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-[1fr_120px_100px_100px] gap-0 bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
                    <span>Selected Folder(s)</span>
                    <span>Number of Items</span>
                    <span>Percentage</span>
                    <span>Include Sub</span>
                  </div>
                  {selectedFolders.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Select folders from the tree to configure content balancing
                    </div>
                  ) : (
                    selectedFolders.map(sf => (
                      <div key={sf.id} className="grid grid-cols-[1fr_120px_100px_100px] gap-0 px-4 py-2.5 border-b border-border last:border-b-0 items-center">
                        <span className="text-sm text-foreground truncate">{sf.name}</span>
                        <Input
                          type="number"
                          value={sf.numberOfItems}
                          onChange={e => setSelectedFolders(prev => prev.map(f =>
                            f.id === sf.id ? { ...f, numberOfItems: Number(e.target.value) } : f
                          ))}
                          className="h-8 w-20"
                        />
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={sf.percentage}
                            onChange={e => setSelectedFolders(prev => prev.map(f =>
                              f.id === sf.id ? { ...f, percentage: Number(e.target.value) } : f
                            ))}
                            className="h-8 w-16"
                          />
                          <span className="text-xs text-muted-foreground">%</span>
                        </div>
                        <Checkbox
                          checked={sf.includeSubFolders}
                          onCheckedChange={(checked) => setSelectedFolders(prev => prev.map(f =>
                            f.id === sf.id ? { ...f, includeSubFolders: !!checked } : f
                          ))}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </SectionCard>

            {/* ─── CAT Algorithm Configuration ─── */}
            <SectionCard title="CAT Algorithm Configuration" icon={Brain} delay={0.05}>
              <div className="space-y-5">
                {/* Test Type */}
                <FieldRow label="Test Type(s)">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="testType" checked={testType === "fixed"} onChange={() => setTestType("fixed")}
                        className="h-4 w-4 text-primary accent-primary" />
                      <span className="text-sm">Fixed</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="testType" checked={testType === "variable"} onChange={() => setTestType("variable")}
                        className="h-4 w-4 text-primary accent-primary" />
                      <span className="text-sm">Variable</span>
                    </label>
                  </div>
                </FieldRow>

                <FieldRow label="Min & Max on IRT Scale" required info="The range of the IRT ability scale">
                  <RangeInput fromValue={irtMin} toValue={irtMax} onFromChange={setIrtMin} onToChange={setIrtMax}
                    fromPlaceholder="eg: -4.0" toPlaceholder="eg: 4.0" />
                </FieldRow>

                <FieldRow label="Difficulty of First Item" required info="IRT difficulty range for the first administered item">
                  <RangeInput fromValue={difficultyMin} toValue={difficultyMax} onFromChange={setDifficultyMin} onToChange={setDifficultyMax} />
                </FieldRow>

                <Separator />

                <FieldRow label="Item Selection" required>
                  <Select value={itemSelection} onValueChange={setItemSelection}>
                    <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maximum-fisher">Maximum Fisher Information</SelectItem>
                      <SelectItem value="a-stratified">A-Stratified</SelectItem>
                      <SelectItem value="weighted">Weighted Information</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>

                <FieldRow label="Item Exposure" required>
                  <Select value={itemExposure} onValueChange={setItemExposure}>
                    <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="randomesque">Randomesque</SelectItem>
                      <SelectItem value="sympson-hetter">Sympson-Hetter</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>

                {/* Exposure rows */}
                <div className="pl-[200px] space-y-2">
                  {exposureRows.map((row) => (
                    <div key={row.id} className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground whitespace-nowrap">Position</Label>
                        <Input
                          type="number" value={row.itemPositionFrom}
                          onChange={e => setExposureRows(prev => prev.map(r =>
                            r.id === row.id ? { ...r, itemPositionFrom: Number(e.target.value) } : r
                          ))}
                          className="h-8 w-16"
                        />
                        <span className="text-xs text-muted-foreground">to</span>
                        <Input
                          type="number" value={row.itemPositionTo}
                          onChange={e => setExposureRows(prev => prev.map(r =>
                            r.id === row.id ? { ...r, itemPositionTo: Number(e.target.value) } : r
                          ))}
                          className="h-8 w-16"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground whitespace-nowrap">Items</Label>
                        <Input
                          type="number" value={row.numberOfItems}
                          onChange={e => setExposureRows(prev => prev.map(r =>
                            r.id === row.id ? { ...r, numberOfItems: Number(e.target.value) } : r
                          ))}
                          className="h-8 w-20"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={addExposureRow} className="h-7">
                      <Plus className="h-3.5 w-3.5 mr-1" />Add
                    </Button>
                    {exposureRows.length > 1 && (
                      <Button size="sm" variant="outline" onClick={() => removeExposureRow(exposureRows[exposureRows.length - 1].id)} className="h-7">
                        <Minus className="h-3.5 w-3.5 mr-1" />Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ─── Item Constraints ─── */}
            <SectionCard title="Item Constraints" icon={ShieldCheck} delay={0.1}>
              <div className="space-y-4">
                <FieldRow label="Number of Scored Items" required>
                  <Input value={scoredItems} onChange={e => setScoredItems(e.target.value)} className="w-64" />
                </FieldRow>
                <FieldRow label="Number of Unscored Items" required>
                  <Input value={unscoredItems} onChange={e => setUnscoredItems(e.target.value)} className="w-64" />
                </FieldRow>
                <Separator />
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox checked={noRepetition} onCheckedChange={(c) => setNoRepetition(!!c)} />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      No item repetition between test takes for a candidate
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox checked={enemyExclusion} onCheckedChange={(c) => setEnemyExclusion(!!c)} />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      Enemy Item Exclusion
                    </span>
                  </label>
                </div>
              </div>
            </SectionCard>

            {/* ─── Theta Estimation ─── */}
            <SectionCard title="Theta Estimation" icon={Gauge} delay={0.15}>
              <div className="space-y-5">
                <FieldRow label="Initial Ability Estimation" required>
                  <Select value={initialAbility} onValueChange={setInitialAbility}>
                    <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="map">MAP</SelectItem>
                      <SelectItem value="eap">EAP</SelectItem>
                      <SelectItem value="fixed">Fixed Value</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>

                {initialAbility === "map" && (
                  <FieldRow label="Prior Distribution (Bayesian)" info="Mean and SD for the Bayesian prior">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Label className="text-xs text-muted-foreground">Mean</Label>
                        <Input value={priorMean} onChange={e => setPriorMean(e.target.value)} placeholder="eg: -1" className="w-24 h-8" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Label className="text-xs text-muted-foreground">SD</Label>
                        <Input value={priorSD} onChange={e => setPriorSD(e.target.value)} placeholder="eg: 1" className="w-24 h-8" />
                      </div>
                    </div>
                  </FieldRow>
                )}

                <FieldRow label="Interim Ability Estimation" required>
                  <Select value={interimEstimation} onValueChange={setInterimEstimation}>
                    <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mle">Maximum Likelihood Estimation</SelectItem>
                      <SelectItem value="map">MAP</SelectItem>
                      <SelectItem value="eap">EAP</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>

                <FieldRow label="Final Ability Estimation" required>
                  <Select value={finalEstimation} onValueChange={setFinalEstimation}>
                    <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mle">Maximum Likelihood Estimation</SelectItem>
                      <SelectItem value="map">MAP</SelectItem>
                      <SelectItem value="eap">EAP</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
              </div>
            </SectionCard>

            {/* ─── Finding Maximum in Likelihood ─── */}
            <SectionCard title="Finding Maximum in Likelihood" icon={Target} delay={0.2}>
              <div className="space-y-4">
                <FieldRow label="Method" required>
                  <Select value={maximumMethod} onValueChange={setMaximumMethod}>
                    <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newton-raphson">Newton Raphson Method</SelectItem>
                      <SelectItem value="bisection">Bisection Method</SelectItem>
                      <SelectItem value="brent">Brent's Method</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
                <FieldRow label="Start Theta Value">
                  <Input value={startTheta} onChange={e => setStartTheta(e.target.value)} placeholder="eg: -1" className="w-40" />
                </FieldRow>
                <FieldRow label="Tolerance" required>
                  <Input value={tolerance} onChange={e => setTolerance(e.target.value)} placeholder="eg: 1" className="w-40" />
                </FieldRow>
                <FieldRow label="Maximum Iterations" required>
                  <Input value={maxIterations} onChange={e => setMaxIterations(e.target.value)} placeholder="eg: 1" className="w-40" />
                </FieldRow>
                <FieldRow label="Maximum Allowed Delta" required>
                  <Input value={maxDelta} onChange={e => setMaxDelta(e.target.value)} placeholder="eg: 1" className="w-40" />
                </FieldRow>
              </div>
            </SectionCard>

            {/* ─── Content Balancing Method ─── */}
            <SectionCard title="Content Balancing Method" icon={Settings2} delay={0.25}>
              <div className="space-y-4">
                <FieldRow label="Method" required>
                  <Select value={cbMethod} onValueChange={setCbMethod}>
                    <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="script">Script</SelectItem>
                      <SelectItem value="ccat">CCAT</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldRow>
                {cbMethod === "script" && (
                  <FieldRow label="Content Item Admin Sequence" required>
                    <Input value={adminSequence} onChange={e => setAdminSequence(e.target.value)} className="w-64" placeholder="1,1,1,2" />
                  </FieldRow>
                )}
              </div>
            </SectionCard>

            {/* ─── Save Button ─── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end gap-3 pb-8"
            >
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />Save Configuration
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveTestConfig;
