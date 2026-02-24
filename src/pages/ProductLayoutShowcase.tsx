import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Search, Plus, FolderOpen, FileText, Calendar, Image,
  Pencil, Trash2, UserPlus, ClipboardList, BarChart3,
  Layers, BookOpen, FileStack, CalendarDays, Package,
  FolderArchive, BookMarked, ScrollText, UserCheck,
  ChevronDown, ChevronRight, ArrowRight, MoreHorizontal,
} from "lucide-react";
import { mockProjects, Project } from "@/data/projectMockData";
import { Input } from "@/components/ui/input";

// ── Shared action definitions ──
interface ActionItem {
  icon: React.ElementType;
  label: string;
  id: string;
}
interface ActionGroup {
  label: string;
  items: ActionItem[];
}

const actionGroups: ActionGroup[] = [
  {
    label: "Program Actions",
    items: [
      { icon: Pencil, label: "Edit Program", id: "edit" },
      { icon: UserPlus, label: "Assign User", id: "assign" },
      { icon: Trash2, label: "Delete Program", id: "delete" },
    ],
  },
  {
    label: "Author Actions",
    items: [
      { icon: Layers, label: "Manage Blueprint", id: "blueprint" },
      { icon: ClipboardList, label: "Manage Items", id: "items" },
      { icon: BookOpen, label: "Manage Passages", id: "passages" },
      { icon: FileStack, label: "Manage Assessment", id: "assessment" },
      { icon: CalendarDays, label: "Manage Schedules", id: "schedules" },
      { icon: Package, label: "Manage Batches", id: "batches" },
      { icon: FolderArchive, label: "Manage Assets", id: "assets" },
    ],
  },
  {
    label: "Resources",
    items: [
      { icon: BookMarked, label: "Knowledge Base", id: "kb" },
      { icon: ScrollText, label: "Guidelines", id: "guidelines" },
      { icon: BarChart3, label: "Reports", id: "reports" },
    ],
  },
  {
    label: "Marker Actions",
    items: [
      { icon: UserCheck, label: "Start Evaluation", id: "evaluation" },
    ],
  },
];

// ── Small reusable product info row ──
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

// ── Action button renderer ──
const ActionButton = ({ action, isDanger, variant = "default" }: { action: ActionItem; isDanger?: boolean; variant?: "default" | "polished" }) => {
  const Icon = action.icon;

  if (variant === "polished") {
    return (
      <button
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
  }

  return (
    <button
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left w-full",
        isDanger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{action.label}</span>
    </button>
  );
};

// ════════════════════════════════════════════════
// OPTION A – Right Slide Panel (Sheet)
// ════════════════════════════════════════════════
const OptionA = ({ projects }: { projects: Project[] }) => {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((p) => (
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

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-[400px] sm:w-[460px] p-0 border-l border-border/60 shadow-2xl">
          {selected && (
            <>
              {/* Polished header with gradient */}
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
                  <motion.div
                    className="mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
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
                            <ActionButton action={a} isDanger={a.id === "delete"} variant="polished" />
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
    </>
  );
};

// ════════════════════════════════════════════════
// OPTION B – Inline Accordion
// ════════════════════════════════════════════════
const OptionB = ({ projects }: { projects: Project[] }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {projects.map((p) => (
        <Collapsible
          key={p.id}
          open={expandedId === p.id}
          onOpenChange={(open) => setExpandedId(open ? p.id : null)}
        >
          <Card className={cn("transition-all", expandedId === p.id && "ring-1 ring-primary/30")}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Image className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">{p.code}</span>
                    <Badge variant={p.status === "active" ? "default" : "outline"} className="text-[10px] h-5">{p.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm truncate">{p.name}</h3>
                </div>
                <ProductMeta project={p} />
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", expandedId === p.id && "rotate-180")} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Separator />
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actionGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((a) => (
                        <ActionButton key={a.id} action={a} isDanger={a.id === "delete"} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════
// OPTION C – Detail Page (inline preview)
// ════════════════════════════════════════════════
const OptionC = ({ projects }: { projects: Project[] }) => {
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="gap-1">
            ← Back to Products
          </Button>
        </div>
        <div className="flex items-start gap-6">
          <div className="h-24 w-36 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {selected.image ? (
              <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
            ) : (
              <Image className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono">{selected.code}</p>
            <h2 className="text-xl font-semibold text-foreground">{selected.name}</h2>
            <ProductMeta project={selected} />
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actionGroups.map((group) => (
            <Card key={group.label} className="p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((a) => (
                  <ActionButton key={a.id} action={a} isDanger={a.id === "delete"} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((p) => (
        <Card
          key={p.id}
          className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          onClick={() => setSelected(p)}
        >
          <div className="h-28 bg-muted flex items-center justify-center overflow-hidden">
            {p.image ? (
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <Image className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground font-mono">{p.code}</p>
            <h3 className="font-semibold text-foreground text-sm truncate">{p.name}</h3>
            <div className="flex items-center justify-between mt-2">
              <ProductMeta project={p} />
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════
// OPTION D – Sidebar + Content (Master-Detail)
// ════════════════════════════════════════════════
const OptionD = ({ projects }: { projects: Project[] }) => {
  const [selected, setSelected] = useState<Project>(projects[0]);

  return (
    <div className="flex border border-border rounded-lg overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
      {/* Left list */}
      <ScrollArea className="w-72 border-r border-border bg-muted/20 flex-shrink-0">
        <div className="p-2 space-y-1">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={cn(
                "w-full text-left p-3 rounded-md transition-colors",
                selected.id === p.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Image className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-mono">{p.code}</p>
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Right content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {selected.image ? (
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
              ) : (
                <Image className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono">{selected.code}</p>
              <h2 className="text-lg font-semibold text-foreground">{selected.name}</h2>
              <ProductMeta project={selected} />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {actionGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                  {group.label}
                </p>
                <Card className="p-2">
                  <div className="space-y-0.5">
                    {group.items.map((a) => (
                      <ActionButton key={a.id} action={a} isDanger={a.id === "delete"} />
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// ════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════
const ProductLayoutShowcase = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = mockProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Product Layouts — Compare</h1>
          </div>

          <Tabs defaultValue="a" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-xl">
              <TabsTrigger value="a">A: Slide Panel</TabsTrigger>
              <TabsTrigger value="b">B: Accordion</TabsTrigger>
              <TabsTrigger value="c">C: Detail Page</TabsTrigger>
              <TabsTrigger value="d">D: Master-Detail</TabsTrigger>
            </TabsList>

            <TabsContent value="a">
              <p className="text-sm text-muted-foreground mb-4">Click a product card → a right-side sheet shows all grouped actions. Works well on all screen sizes.</p>
              <OptionA projects={filteredProjects} />
            </TabsContent>

            <TabsContent value="b">
              <p className="text-sm text-muted-foreground mb-4">Click a product row → it expands inline to reveal a full-width action panel in a 4-column grid.</p>
              <OptionB projects={filteredProjects} />
            </TabsContent>

            <TabsContent value="c">
              <p className="text-sm text-muted-foreground mb-4">Click a product card → navigates to a dedicated detail view with all actions organized in section cards.</p>
              <OptionC projects={filteredProjects} />
            </TabsContent>

            <TabsContent value="d">
              <p className="text-sm text-muted-foreground mb-4">Products listed on the left sidebar, clicking one shows its grouped actions in the main content area.</p>
              <OptionD projects={filteredProjects} />
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd{" "}
            <a href="https://www.excelsoftcorp.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.excelsoftcorp.com</a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductLayoutShowcase;
