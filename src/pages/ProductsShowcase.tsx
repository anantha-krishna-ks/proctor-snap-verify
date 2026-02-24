import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Search, Plus, FolderOpen, FileText, Calendar, Image,
  Pencil, Trash2, UserPlus, ClipboardList, BarChart3,
  Layers, BookOpen, FileStack, CalendarDays, Package,
  FolderArchive, BookMarked, ScrollText, UserCheck,
  Grid3X3, List, ChevronRight, ArrowLeft, Save, Upload, X,
  Users, SplitSquareHorizontal, Layers2, Replace,
} from "lucide-react";
import { mockProjects, Project } from "@/data/projectMockData";
import { mockUsers } from "@/data/adminMockData";
import AddProductSheet from "@/components/AddProductSheet";
import { toast } from "@/hooks/use-toast";

// ── Types ──
type PanelMode = "inplace" | "stacked" | "expand";
type SubView = null | "edit" | "assign" | "delete";

interface ActionItem {
  icon: React.ElementType;
  label: string;
  id: string;
  subView?: SubView;
  navTo?: string;
  variant?: "destructive";
}
interface ActionGroup { label: string; items: ActionItem[]; }

// ── Product metadata row ──
const ProductMeta = ({ project }: { project: Project }) => (
  <div className="flex items-center gap-4 text-xs text-muted-foreground">
    <span className="flex items-center gap-1"><FolderOpen className="h-3.5 w-3.5" />{project.itemCount}</span>
    <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{project.testCount}</span>
    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{project.scheduleCount}</span>
    <Badge variant={project.status === "active" ? "default" : project.status === "completed" ? "secondary" : "outline"} className="text-[10px] h-5">
      {project.status}
    </Badge>
  </div>
);

// ── Action groups (static, navigation handled by parent) ──
const actionGroups: ActionGroup[] = [
  {
    label: "Program Actions",
    items: [
      { icon: Pencil, label: "Edit Program", id: "edit", subView: "edit" },
      { icon: UserPlus, label: "Assign User", id: "assign", subView: "assign" },
      { icon: Trash2, label: "Delete Program", id: "delete", subView: "delete", variant: "destructive" },
    ],
  },
  {
    label: "Author Actions",
    items: [
      { icon: Layers, label: "Manage Blueprint", id: "blueprint" },
      { icon: ClipboardList, label: "Manage Items", id: "items", navTo: "/admin/products/{id}/items" },
      { icon: BookOpen, label: "Manage Passages", id: "passages" },
      { icon: FileStack, label: "Manage Assessment", id: "assessment" },
      { icon: CalendarDays, label: "Manage Schedules", id: "schedules", navTo: "/scheduling" },
      { icon: Package, label: "Manage Batches", id: "batches" },
      { icon: FolderArchive, label: "Manage Assets", id: "assets" },
    ],
  },
  {
    label: "Resources",
    items: [
      { icon: BookMarked, label: "Knowledge Base", id: "kb" },
      { icon: ScrollText, label: "Guidelines", id: "guidelines" },
      { icon: BarChart3, label: "Reports", id: "reports", navTo: "/admin/products/{id}/reports" },
    ],
  },
  {
    label: "Marker Actions",
    items: [
      { icon: UserCheck, label: "Start Evaluation", id: "evaluation" },
    ],
  },
];

// ── Inline Edit Form ──
const EditFormContent = ({ project, onBack, onSave }: { project: Project; onBack: () => void; onSave: () => void }) => {
  const [name, setName] = useState(project.name);
  const [code, setCode] = useState(project.code);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("cat-1");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold text-foreground">Edit Program</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <Label>Code <span className="text-destructive">*</span></Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Name <span className="text-destructive">*</span></Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Category <span className="text-destructive">*</span></Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cat-1">Assessment</SelectItem>
                <SelectItem value="cat-2">Certification</SelectItem>
                <SelectItem value="cat-3">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>Cancel</Button>
        <Button className="flex-1" onClick={onSave}><Save className="h-4 w-4 mr-2" />Save Changes</Button>
      </div>
    </div>
  );
};

// ── Inline Assign Users Form ──
const AssignUsersContent = ({ project, onBack, onSave }: { project: Project; onBack: () => void; onSave: () => void }) => {
  const [assigned, setAssigned] = useState<string[]>(mockUsers.slice(0, 3).map(u => u.id));
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => setAssigned(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Users className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Assign Users</h3>
      </div>
      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-2">
              Assigned <Badge variant="secondary" className="text-[10px]">{assigned.length}</Badge>
            </Label>
            <div className="border border-border rounded-lg overflow-hidden">
              <AnimatePresence mode="popLayout">
                {filtered.filter(u => assigned.includes(u.id)).map(user => (
                  <motion.div key={user.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 border-b border-border last:border-b-0 bg-primary/5"
                  >
                    <Checkbox checked onCheckedChange={() => toggle(user.id)} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filtered.filter(u => assigned.includes(u.id)).length === 0 && (
                <p className="p-3 text-sm text-muted-foreground text-center">No users assigned</p>
              )}
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-2">
              Available <Badge variant="outline" className="text-[10px]">{filtered.filter(u => !assigned.includes(u.id)).length}</Badge>
            </Label>
            <div className="border border-border rounded-lg overflow-hidden">
              <AnimatePresence mode="popLayout">
                {filtered.filter(u => !assigned.includes(u.id)).map(user => (
                  <motion.div key={user.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 border-b border-border last:border-b-0"
                  >
                    <Checkbox checked={false} onCheckedChange={() => toggle(user.id)} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>Cancel</Button>
        <Button className="flex-1" onClick={onSave}><Save className="h-4 w-4 mr-2" />Save Assignments</Button>
      </div>
    </div>
  );
};

// ── Polished action button ──
const ActionBtn = ({ action, onClick }: { action: ActionItem; onClick: () => void }) => {
  const Icon = action.icon;
  const isDanger = action.variant === "destructive";
  return (
    <button onClick={onClick} className={cn(
      "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left w-full",
      isDanger ? "text-destructive hover:bg-destructive/10 hover:shadow-sm" : "text-foreground hover:bg-primary/5 hover:shadow-sm hover:translate-x-0.5"
    )}>
      <div className={cn(
        "flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 flex-shrink-0",
        isDanger ? "bg-destructive/10 group-hover:bg-destructive/15" : "bg-primary/10 group-hover:bg-primary/15 group-hover:scale-105"
      )}>
        <Icon className={cn("h-4 w-4", isDanger ? "text-destructive" : "text-primary")} />
      </div>
      <span className="truncate font-medium">{action.label}</span>
      <ChevronRight className={cn(
        "h-3.5 w-3.5 ml-auto opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-50 group-hover:translate-x-0",
        isDanger ? "text-destructive" : "text-muted-foreground"
      )} />
    </button>
  );
};

// ── Action list panel content ──
const ActionListContent = ({ project, onAction, onNav }: {
  project: Project;
  onAction: (sub: SubView) => void;
  onNav: (path: string) => void;
}) => (
  <>
    <motion.div className="relative overflow-hidden" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
      <div className="relative p-6 pb-4">
        <SheetHeader className="space-y-1.5">
          <div className="flex items-start gap-3">
            <motion.div className="h-14 w-14 rounded-xl bg-card shadow-sm border border-border/50 flex items-center justify-center overflow-hidden flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}>
              {project.image ? <img src={project.image} alt={project.name} className="w-full h-full object-cover" /> : <Image className="h-6 w-6 text-muted-foreground" />}
            </motion.div>
            <div className="min-w-0">
              <SheetTitle className="text-lg leading-snug">{project.name}</SheetTitle>
              <SheetDescription className="text-xs font-mono mt-0.5">{project.code}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <ProductMeta project={project} />
        </motion.div>
      </div>
    </motion.div>
    <Separator />
    <ScrollArea className="flex-1">
      <div className="p-5 space-y-6">
        {actionGroups.map((group, gi) => (
          <motion.div key={group.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + gi * 0.08, duration: 0.35, ease: "easeOut" }}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{group.label}</p>
              <div className="flex-1 h-px bg-border/50 ml-2" />
            </div>
            <div className="space-y-0.5">
              {group.items.map((a, ii) => (
                <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + gi * 0.08 + ii * 0.04, duration: 0.25, ease: "easeOut" }}>
                  <ActionBtn action={a} onClick={() => {
                    if (a.subView) onAction(a.subView);
                    else if (a.navTo) onNav(a.navTo.replace("{id}", project.id));
                  }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  </>
);

// ════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════
const ProductsShowcase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Project | null>(null);
  const [subView, setSubView] = useState<SubView>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("inplace");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Reset sub-view when main panel closes
  useEffect(() => {
    if (!selected) setSubView(null);
  }, [selected]);

  const filteredProjects = mockProjects.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (sub: SubView) => {
    if (sub === "delete") {
      setDeleteTarget(selected);
      return;
    }
    setSubView(sub);
  };

  const handleSubSave = (label: string) => {
    toast({ title: `${label} Updated`, description: `Changes saved for "${selected?.name}".` });
    setSubView(null);
  };

  const handleDelete = () => {
    toast({ title: "Product Deleted", description: `"${deleteTarget?.name}" has been deleted.`, variant: "destructive" });
    setDeleteTarget(null);
    setSelected(null);
  };

  // ── Compute sheet width based on mode ──
  const getSheetWidth = () => {
    if (panelMode === "expand" && subView) return "w-[760px] sm:w-[840px]";
    return "w-[400px] sm:w-[460px]";
  };

  // ── Render sub-view content (shared between modes) ──
  const renderSubContent = () => {
    if (!selected || !subView) return null;
    if (subView === "edit") return <EditFormContent project={selected} onBack={() => setSubView(null)} onSave={() => handleSubSave("Product")} />;
    if (subView === "assign") return <AssignUsersContent project={selected} onBack={() => setSubView(null)} onSave={() => handleSubSave("Assignments")} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Products (V2)</h1>
            <div className="flex items-center gap-3">
              {/* Panel mode toggle */}
              <div className="flex items-center border border-border rounded-md">
                <Tooltip><TooltipTrigger asChild>
                  <Button variant={panelMode === "inplace" ? "secondary" : "ghost"} size="sm" onClick={() => setPanelMode("inplace")} className="rounded-r-none gap-1.5 text-xs">
                    <Replace className="h-3.5 w-3.5" /> In-place
                  </Button>
                </TooltipTrigger><TooltipContent>Content swaps within same panel</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild>
                  <Button variant={panelMode === "stacked" ? "secondary" : "ghost"} size="sm" onClick={() => setPanelMode("stacked")} className="gap-1.5 text-xs">
                    <Layers2 className="h-3.5 w-3.5" /> Stacked
                  </Button>
                </TooltipTrigger><TooltipContent>Second panel overlays first</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild>
                  <Button variant={panelMode === "expand" ? "secondary" : "ghost"} size="sm" onClick={() => setPanelMode("expand")} className="rounded-l-none gap-1.5 text-xs">
                    <SplitSquareHorizontal className="h-3.5 w-3.5" /> Expand
                  </Button>
                </TooltipTrigger><TooltipContent>Panel widens to show both</TooltipContent></Tooltip>
              </div>
              <Separator orientation="vertical" className="h-6" />
              {/* View toggle */}
              <div className="flex items-center border border-border rounded-md">
                <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-r-none"><Grid3X3 className="h-4 w-4" /></Button>
                <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-l-none"><List className="h-4 w-4" /></Button>
              </div>
              <Button className="gap-2" onClick={() => setIsAddProductOpen(true)}><Plus className="h-4 w-4" /> Add Product</Button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProjects.map((p) => (
                <Card key={p.id} className="group cursor-pointer overflow-hidden border border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300" onClick={() => setSelected(p)}>
                  <div className="h-32 bg-gradient-to-br from-primary/5 via-muted to-accent/5 flex items-center justify-center relative overflow-hidden">
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : (
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"><Image className="h-6 w-6 text-primary/60" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground font-mono mb-0.5">{p.code}</p>
                    <h3 className="font-semibold text-foreground truncate">{p.name}</h3>
                    <div className="mt-3"><ProductMeta project={p} /></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader><TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">CODE</TableHead>
                  <TableHead className="font-semibold">NAME</TableHead>
                  <TableHead className="font-semibold text-center">ITEMS</TableHead>
                  <TableHead className="font-semibold text-center">TESTS</TableHead>
                  <TableHead className="font-semibold text-center">SCHEDULES</TableHead>
                  <TableHead className="font-semibold text-center">STATUS</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredProjects.map((p) => (
                    <TableRow key={p.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelected(p)}>
                      <TableCell className="font-medium text-primary font-mono">{p.code}</TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-center">{p.itemCount}</TableCell>
                      <TableCell className="text-center">{p.testCount}</TableCell>
                      <TableCell className="text-center">{p.scheduleCount}</TableCell>
                      <TableCell className="text-center"><Badge variant={p.status === "active" ? "default" : "outline"} className="text-[10px]">{p.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredProjects.length === 0 && <div className="text-center py-12 text-muted-foreground">No products found.</div>}

          {/* ═══ MODE A: IN-PLACE SWAP ═══ */}
          {panelMode === "inplace" && (
            <Sheet open={!!selected} onOpenChange={(open) => { if (!open) { setSelected(null); setSubView(null); } }}>
              <SheetContent className="w-[400px] sm:w-[460px] p-0 border-l border-border/60 shadow-2xl flex flex-col">
                {selected && (
                  <AnimatePresence mode="wait">
                    {!subView ? (
                      <motion.div key="actions" className="flex flex-col flex-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                        <ActionListContent project={selected} onAction={handleAction} onNav={(path) => navigate(path)} />
                      </motion.div>
                    ) : (
                      <motion.div key={subView} className="flex-1 flex flex-col" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                        {renderSubContent()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </SheetContent>
            </Sheet>
          )}

          {/* ═══ MODE B: STACKED PANELS ═══ */}
          {panelMode === "stacked" && (
            <>
              <Sheet open={!!selected} onOpenChange={(open) => { if (!open) { setSelected(null); setSubView(null); } }}>
                <SheetContent className={cn("w-[400px] sm:w-[460px] p-0 border-l border-border/60 shadow-2xl flex flex-col transition-all duration-300", subView && "opacity-60 scale-[0.97] pointer-events-none")}>
                  {selected && <ActionListContent project={selected} onAction={handleAction} onNav={(path) => navigate(path)} />}
                </SheetContent>
              </Sheet>
              {/* Stacked overlay panel */}
              <AnimatePresence>
                {subView && selected && (
                  <motion.div
                    className="fixed inset-0 z-[60]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-black/20" onClick={() => setSubView(null)} />
                    <motion.div
                      className="absolute top-0 right-0 h-full w-[380px] sm:w-[420px] bg-card border-l border-border shadow-2xl flex flex-col"
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    >
                      {renderSubContent()}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* ═══ MODE C: EXPAND WIDTH ═══ */}
          {panelMode === "expand" && (
            <Sheet open={!!selected} onOpenChange={(open) => { if (!open) { setSelected(null); setSubView(null); } }}>
              <SheetContent className={cn("p-0 border-l border-border/60 shadow-2xl flex transition-all duration-300", getSheetWidth())}>
                {selected && (
                  <div className="flex flex-1 h-full">
                    {/* Actions side */}
                    <div className={cn("flex flex-col transition-all duration-300 overflow-hidden", subView ? "w-[340px] border-r border-border/40" : "flex-1")}>
                      <ActionListContent project={selected} onAction={handleAction} onNav={(path) => navigate(path)} />
                    </div>
                    {/* Sub-content side */}
                    <AnimatePresence>
                      {subView && (
                        <motion.div
                          className="flex-1 flex flex-col overflow-hidden"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "auto", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          {renderSubContent()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          )}

          {/* Delete confirmation (always modal) */}
          <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AddProductSheet open={isAddProductOpen} onOpenChange={setIsAddProductOpen} />

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd{" "}
            <a href="https://www.excelsoftcorp.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.excelsoftcorp.com</a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsShowcase;
