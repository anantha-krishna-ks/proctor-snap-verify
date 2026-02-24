import { useState } from "react";
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
const ActionButton = ({ action, isDanger }: { action: ActionItem; isDanger?: boolean }) => {
  const Icon = action.icon;
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
            className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            onClick={() => setSelected(p)}
          >
            <div className="h-28 bg-muted flex items-center justify-center relative overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <Image className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground font-mono">{p.code}</p>
              <h3 className="font-semibold text-foreground text-sm truncate">{p.name}</h3>
              <ProductMeta project={p} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-[380px] sm:w-[440px] p-0">
          {selected && (
            <>
              <SheetHeader className="p-5 pb-3">
                <SheetTitle className="text-lg">{selected.name}</SheetTitle>
                <SheetDescription className="text-xs font-mono">{selected.code}</SheetDescription>
                <ProductMeta project={selected} />
              </SheetHeader>
              <Separator />
              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-4 space-y-5">
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
