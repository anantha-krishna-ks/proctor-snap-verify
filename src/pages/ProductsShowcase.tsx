import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search, Plus, FolderOpen, FileText, Calendar, Image,
  Pencil, Trash2, UserPlus, ClipboardList, BarChart3,
  Layers, BookOpen, FileStack, CalendarDays, Package,
  FolderArchive, BookMarked, ScrollText, UserCheck,
  Grid3X3, List, MoreHorizontal,
} from "lucide-react";
import { mockProjects, Project } from "@/data/projectMockData";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import AddProductSheet from "@/components/AddProductSheet";
import EditProductSheet from "@/components/EditProductSheet";
import DeleteProductDialog from "@/components/DeleteProductDialog";
import ProductUserAssignmentSheet from "@/components/ProductUserAssignmentSheet";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ActionItem {
  icon: React.ElementType;
  label: string;
  onClick: (project: Project) => void;
  variant?: "destructive";
}

type ActionGroup = { label: string; items: ActionItem[] };

const ProductsShowcase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignUsersOpen, setIsAssignUsersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Project | null>(null);

  const filteredProjects = mockProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const buildActions = (project: Project): ActionGroup[] => [
    {
      label: "Program Actions",
      items: [
        { icon: Pencil, label: "Edit Program", onClick: (p) => { setSelectedProduct(p); setIsEditProductOpen(true); } },
        { icon: UserPlus, label: "Assign User", onClick: (p) => { setSelectedProduct(p); setIsAssignUsersOpen(true); } },
        { icon: Trash2, label: "Delete Program", onClick: (p) => { setSelectedProduct(p); setIsDeleteDialogOpen(true); }, variant: "destructive" },
      ],
    },
    {
      label: "Author Actions",
      items: [
        { icon: Layers, label: "Manage Blueprint", onClick: () => {} },
        { icon: ClipboardList, label: "Manage Items", onClick: (p) => navigate(`/admin/products/${p.id}/items`) },
        { icon: BookOpen, label: "Manage Passages", onClick: () => {} },
        { icon: FileStack, label: "Manage Assessment", onClick: () => {} },
        { icon: CalendarDays, label: "Manage Schedules", onClick: () => navigate("/scheduling") },
        { icon: Package, label: "Manage Batches", onClick: () => {} },
        { icon: FolderArchive, label: "Manage Assets", onClick: () => {} },
      ],
    },
    {
      label: "Resources",
      items: [
        { icon: BookMarked, label: "Knowledge Base", onClick: () => {} },
        { icon: ScrollText, label: "Guidelines", onClick: () => {} },
        { icon: BarChart3, label: "Reports", onClick: (p) => navigate(`/admin/products/${p.id}/reports`) },
      ],
    },
    {
      label: "Marker Actions",
      items: [
        { icon: UserCheck, label: "Start Evaluation", onClick: () => {} },
      ],
    },
  ];

  const ActionPopover = ({ project }: { project: Project }) => {
    const groups = buildActions(project);
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          className="w-[340px] p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-3 space-y-3 max-h-[420px] overflow-y-auto">
            {groups.map((group, gi) => (
              <div key={group.label}>
                {gi > 0 && <Separator className="mb-3" />}
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                  {group.label}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {group.items.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={() => action.onClick(project)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left w-full",
                          action.variant === "destructive"
                            ? "text-destructive hover:bg-destructive/10"
                            : "text-foreground hover:bg-accent"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  {/* Image */}
                  <div className="h-32 bg-muted flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                    {project.image ? (
                      <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Image className="h-10 w-10 mb-1" />
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                    {/* Action button */}
                    <div className="absolute top-2 right-2 z-20">
                      <ActionPopover project={project} />
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground font-mono truncate">Code:{project.code}</p>
                    <h3 className="font-semibold text-foreground truncate text-sm mt-0.5" title={project.name}>{project.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><FolderOpen className="h-3.5 w-3.5" />{project.itemCount}</span>
                      <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{project.testCount}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{project.scheduleCount}</span>
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
                    <TableHead className="font-semibold text-center w-16">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-primary">{project.code}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell className="text-center">{project.itemCount}</TableCell>
                      <TableCell className="text-center">{project.testCount}</TableCell>
                      <TableCell className="text-center">{project.scheduleCount}</TableCell>
                      <TableCell className="text-center">
                        <ActionPopover project={project} />
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

          {/* Sheets/Dialogs */}
          <AddProductSheet open={isAddProductOpen} onOpenChange={setIsAddProductOpen} />
          <EditProductSheet open={isEditProductOpen} onOpenChange={setIsEditProductOpen} product={selectedProduct} />
          <DeleteProductDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} product={selectedProduct} />
          <ProductUserAssignmentSheet open={isAssignUsersOpen} onOpenChange={setIsAssignUsersOpen} product={selectedProduct} />

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
