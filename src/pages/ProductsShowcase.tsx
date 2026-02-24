import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Search, Plus, FolderOpen, FileText, Calendar, Image,
  Pencil, Trash2, UserPlus, ClipboardList, BarChart3,
  Layers, BookOpen, FileStack, CalendarDays, Package,
  FolderArchive, BookMarked, ScrollText, UserCheck,
  Grid3X3, List, ChevronRight,
} from "lucide-react";
import { mockProjects, Project } from "@/data/projectMockData";
import AddProductSheet from "@/components/AddProductSheet";
import EditProductSheet from "@/components/EditProductSheet";
import DeleteProductDialog from "@/components/DeleteProductDialog";
import ProductUserAssignmentSheet from "@/components/ProductUserAssignmentSheet";

// ── Types ──
interface ActionItem {
  icon: React.ElementType;
  label: string;
  id: string;
  onClick: (project: Project) => void;
  variant?: "destructive";
}
interface ActionGroup {
  label: string;
  items: ActionItem[];
}

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

// ── Polished action button ──
const ActionButton = ({ action, project }: { action: ActionItem; project: Project }) => {
  const Icon = action.icon;
  const isDanger = action.variant === "destructive";
  return (
    <button
      onClick={() => action.onClick(project)}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left w-full",
        isDanger
          ? "text-destructive hover:bg-destructive/10 hover:shadow-sm"
          : "text-foreground hover:bg-primary/5 hover:shadow-sm hover:translate-x-0.5"
      )}
    >
      <div className={cn(
        "flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 flex-shrink-0",
        isDanger
          ? "bg-destructive/10 group-hover:bg-destructive/15"
          : "bg-primary/10 group-hover:bg-primary/15 group-hover:scale-105"
      )}>
        <Icon className={cn("h-4 w-4", isDanger ? "text-destructive" : "text-primary")} />
      </div>
      <span className="truncate font-medium">{action.label}</span>
      <ChevronRight className={cn(
        "h-3.5 w-3.5 ml-auto opacity-0 -translate-x-1 transition-all duration-200",
        "group-hover:opacity-50 group-hover:translate-x-0",
        isDanger ? "text-destructive" : "text-muted-foreground"
      )} />
    </button>
  );
};

// ════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════
const ProductsShowcase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Project | null>(null);

  // Sheet/dialog state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignUsersOpen, setIsAssignUsersOpen] = useState(false);
  const [actionTarget, setActionTarget] = useState<Project | null>(null);

  const filteredProjects = mockProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close the slide panel before opening a management sheet
  const closeAndDo = (fn: () => void) => {
    setSelected(null);
    setTimeout(fn, 200); // let sheet close animation finish
  };

  const buildActions = (): ActionGroup[] => [
    {
      label: "Program Actions",
      items: [
        { icon: Pencil, label: "Edit Program", id: "edit", onClick: (p) => closeAndDo(() => { setActionTarget(p); setIsEditProductOpen(true); }) },
        { icon: UserPlus, label: "Assign User", id: "assign", onClick: (p) => closeAndDo(() => { setActionTarget(p); setIsAssignUsersOpen(true); }) },
        { icon: Trash2, label: "Delete Program", id: "delete", onClick: (p) => closeAndDo(() => { setActionTarget(p); setIsDeleteDialogOpen(true); }), variant: "destructive" },
      ],
    },
    {
      label: "Author Actions",
      items: [
        { icon: Layers, label: "Manage Blueprint", id: "blueprint", onClick: () => {} },
        { icon: ClipboardList, label: "Manage Items", id: "items", onClick: (p) => navigate(`/admin/products/${p.id}/items`) },
        { icon: BookOpen, label: "Manage Passages", id: "passages", onClick: () => {} },
        { icon: FileStack, label: "Manage Assessment", id: "assessment", onClick: () => {} },
        { icon: CalendarDays, label: "Manage Schedules", id: "schedules", onClick: () => navigate("/scheduling") },
        { icon: Package, label: "Manage Batches", id: "batches", onClick: () => {} },
        { icon: FolderArchive, label: "Manage Assets", id: "assets", onClick: () => {} },
      ],
    },
    {
      label: "Resources",
      items: [
        { icon: BookMarked, label: "Knowledge Base", id: "kb", onClick: () => {} },
        { icon: ScrollText, label: "Guidelines", id: "guidelines", onClick: () => {} },
        { icon: BarChart3, label: "Reports", id: "reports", onClick: (p) => navigate(`/admin/products/${p.id}/reports`) },
      ],
    },
    {
      label: "Marker Actions",
      items: [
        { icon: UserCheck, label: "Start Evaluation", id: "evaluation", onClick: () => {} },
      ],
    },
  ];

  const actionGroups = buildActions();

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
              <div className="flex items-center border border-border rounded-md">
                <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-r-none">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-l-none">
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button className="gap-2" onClick={() => setIsAddProductOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
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
                <Card
                  key={p.id}
                  className="group cursor-pointer overflow-hidden border border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
                  onClick={() => setSelected(p)}
                >
                  <div className="h-32 bg-gradient-to-br from-primary/5 via-muted to-accent/5 flex items-center justify-center relative overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Image className="h-6 w-6 text-primary/60" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground font-mono mb-0.5">{p.code}</p>
                    <h3 className="font-semibold text-foreground truncate">{p.name}</h3>
                    <div className="mt-3">
                      <ProductMeta project={p} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">CODE</TableHead>
                    <TableHead className="font-semibold">NAME</TableHead>
                    <TableHead className="font-semibold text-center">ITEMS</TableHead>
                    <TableHead className="font-semibold text-center">TESTS</TableHead>
                    <TableHead className="font-semibold text-center">SCHEDULES</TableHead>
                    <TableHead className="font-semibold text-center">STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((p) => (
                    <TableRow key={p.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelected(p)}>
                      <TableCell className="font-medium text-primary font-mono">{p.code}</TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-center">{p.itemCount}</TableCell>
                      <TableCell className="text-center">{p.testCount}</TableCell>
                      <TableCell className="text-center">{p.scheduleCount}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={p.status === "active" ? "default" : "outline"} className="text-[10px]">{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No products found matching your search.</div>
          )}

          {/* ── Polished Right Slide Panel ── */}
          <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
            <SheetContent className="w-[400px] sm:w-[460px] p-0 border-l border-border/60 shadow-2xl">
              {selected && (
                <>
                  <motion.div
                    className="relative overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
                    <div className="relative p-6 pb-4">
                      <SheetHeader className="space-y-1.5">
                        <div className="flex items-start gap-3">
                          <motion.div
                            className="h-14 w-14 rounded-xl bg-card shadow-sm border border-border/50 flex items-center justify-center overflow-hidden flex-shrink-0"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                          >
                            {selected.image ? (
                              <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                            ) : (
                              <Image className="h-6 w-6 text-muted-foreground" />
                            )}
                          </motion.div>
                          <div className="min-w-0">
                            <SheetTitle className="text-lg leading-snug">{selected.name}</SheetTitle>
                            <SheetDescription className="text-xs font-mono mt-0.5">{selected.code}</SheetDescription>
                          </div>
                        </div>
                      </SheetHeader>
                      <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                        <ProductMeta project={selected} />
                      </motion.div>
                    </div>
                  </motion.div>

                  <Separator />

                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="p-5 space-y-6">
                      {actionGroups.map((group, groupIdx) => (
                        <motion.div
                          key={group.label}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + groupIdx * 0.08, duration: 0.35, ease: "easeOut" }}
                        >
                          <div className="flex items-center gap-2 mb-3 px-1">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                              {group.label}
                            </p>
                            <div className="flex-1 h-px bg-border/50 ml-2" />
                          </div>
                          <div className="space-y-0.5">
                            {group.items.map((a, itemIdx) => (
                              <motion.div
                                key={a.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + groupIdx * 0.08 + itemIdx * 0.04, duration: 0.25, ease: "easeOut" }}
                              >
                                <ActionButton action={a} project={selected} />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </SheetContent>
          </Sheet>

          {/* Management sheets/dialogs */}
          <AddProductSheet open={isAddProductOpen} onOpenChange={setIsAddProductOpen} />
          <EditProductSheet open={isEditProductOpen} onOpenChange={setIsEditProductOpen} product={actionTarget} />
          <DeleteProductDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} product={actionTarget} />
          <ProductUserAssignmentSheet open={isAssignUsersOpen} onOpenChange={setIsAssignUsersOpen} product={actionTarget} />

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
