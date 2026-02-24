import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Search, Plus, FolderOpen, FileText, Calendar, Image,
  Pencil, Trash2, UserPlus, ClipboardList, BarChart3,
  Copy, Archive, Settings, Eye, Download, Share2, Lock,
  ChevronDown, ChevronUp, Pin, PinOff, Clock,
} from "lucide-react";
import { mockProjects, Project } from "@/data/projectMockData";
import AddProductSheet from "@/components/AddProductSheet";
import EditProductSheet from "@/components/EditProductSheet";
import DeleteProductDialog from "@/components/DeleteProductDialog";
import ProductUserAssignmentSheet from "@/components/ProductUserAssignmentSheet";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  draft: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

interface ActionItem {
  icon: React.ElementType;
  label: string;
  onClick: (project: Project) => void;
  variant?: "default" | "destructive";
  group: string;
}

const ProductsShowcase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  const actions: ActionItem[] = [
    { icon: ClipboardList, label: "Items", onClick: (p) => navigate(`/admin/products/${p.id}/items`), group: "Content" },
    { icon: BarChart3, label: "Reports", onClick: (p) => navigate(`/admin/products/${p.id}/reports`), group: "Content" },
    { icon: Eye, label: "Preview", onClick: () => {}, group: "Content" },
    { icon: Download, label: "Export", onClick: () => {}, group: "Content" },
    { icon: Pencil, label: "Edit", onClick: (p) => { setSelectedProduct(p); setIsEditProductOpen(true); }, group: "Manage" },
    { icon: UserPlus, label: "Assign Users", onClick: (p) => { setSelectedProduct(p); setIsAssignUsersOpen(true); }, group: "Manage" },
    { icon: Copy, label: "Duplicate", onClick: () => {}, group: "Manage" },
    { icon: Share2, label: "Share", onClick: () => {}, group: "Manage" },
    { icon: Settings, label: "Settings", onClick: () => {}, group: "Manage" },
    { icon: Archive, label: "Archive", onClick: () => {}, group: "Manage" },
    { icon: Lock, label: "Permissions", onClick: () => {}, group: "Manage" },
    { icon: Trash2, label: "Delete", onClick: (p) => { setSelectedProduct(p); setIsDeleteDialogOpen(true); }, variant: "destructive", group: "Danger" },
  ];

  const groupedActions = actions.reduce<Record<string, ActionItem[]>>((acc, action) => {
    if (!acc[action.group]) acc[action.group] = [];
    acc[action.group].push(action);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Products (New Layout)</h1>
              <p className="text-sm text-muted-foreground mt-1">Click any product row to expand actions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="gap-2" onClick={() => setIsAddProductOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-3">
            {filteredProjects.map((project) => {
              const isExpanded = expandedId === project.id;
              return (
                <Card
                  key={project.id}
                  className={cn(
                    "transition-all duration-200 overflow-hidden",
                    isExpanded && "ring-2 ring-primary/20 shadow-lg"
                  )}
                >
                  {/* Main Row */}
                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedId(isExpanded ? null : project.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="h-12 w-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {project.image ? (
                            <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
                          ) : (
                            <Image className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                            {project.isPinned && <Pin className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-muted-foreground font-mono">{project.code}</span>
                            <Badge variant="secondary" className={cn("text-xs", STATUS_STYLES[project.status])}>
                              {project.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5" title="Items">
                            <FolderOpen className="h-4 w-4" />
                            <span>{project.itemCount}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Tests">
                            <FileText className="h-4 w-4" />
                            <span>{project.testCount}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Schedules">
                            <Calendar className="h-4 w-4" />
                            <span>{project.scheduleCount}</span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="hidden lg:flex items-center gap-3 w-32">
                          <Progress value={project.progress} className="h-2 flex-1" />
                          <span className="text-xs text-muted-foreground w-8 text-right">{project.progress}%</span>
                        </div>

                        {/* Last activity */}
                        <div className="hidden xl:flex items-center gap-1.5 text-xs text-muted-foreground w-28">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{project.lastActivity}</span>
                        </div>

                        {/* Expand icon */}
                        <div className="flex-shrink-0 text-muted-foreground">
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                    </CardContent>
                  </button>

                  {/* Expanded Actions Panel */}
                  {isExpanded && (
                    <div className="border-t border-border bg-muted/30 px-4 py-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex flex-wrap gap-x-8 gap-y-4">
                        {Object.entries(groupedActions).map(([group, items]) => (
                          <div key={group}>
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">{group}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {items.map((action) => {
                                const Icon = action.icon;
                                return (
                                  <Button
                                    key={action.label}
                                    variant={action.variant === "destructive" ? "destructive" : "outline"}
                                    size="sm"
                                    className="gap-1.5 h-8 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      action.onClick(project);
                                    }}
                                  >
                                    <Icon className="h-3.5 w-3.5" />
                                    {action.label}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No products found matching your search.
            </div>
          )}

          {/* Sheets/Dialogs */}
          <AddProductSheet open={isAddProductOpen} onOpenChange={setIsAddProductOpen} />
          <EditProductSheet open={isEditProductOpen} onOpenChange={setIsEditProductOpen} product={selectedProduct} />
          <DeleteProductDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} product={selectedProduct} />
          <ProductUserAssignmentSheet open={isAssignUsersOpen} onOpenChange={setIsAssignUsersOpen} product={selectedProduct} />

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd{" "}
            <a href="https://www.excelsoftcorp.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              https://www.excelsoftcorp.com
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsShowcase;
