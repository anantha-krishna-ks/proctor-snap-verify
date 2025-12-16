import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Grid3X3, 
  List, 
  Columns, 
  LayoutTemplate, 
  PanelLeftClose,
  FolderOpen,
  FileText,
  Calendar,
  MoreHorizontal,
  Image,
  Shield,
  UserCheck,
  Eye,
  Edit,
  Users,
  ChevronRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockProjects } from "@/data/projectMockData";

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  admin: { label: "Admin", color: "bg-primary/10 text-primary border-primary/20", icon: Shield },
  marker: { label: "Marker", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200", icon: UserCheck },
  author: { label: "Author", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200", icon: Edit },
  proctor: { label: "Proctor", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200", icon: Eye },
};

const userRolesMap: Record<string, string[]> = {
  "1": ["admin", "author"],
  "2": ["marker", "proctor"],
  "3": ["admin"],
  "4": ["author"],
};

const ProjectLayoutShowcase = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(mockProjects[0]);
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);

  const handleSelectLayout = (layout: string) => {
    setSelectedLayout(layout);
  };

  // Layout 1: Current Card Grid
  const CardGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {mockProjects.map((project) => {
        const roles = userRolesMap[project.id] || ["admin"];
        return (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer">
            <div className="h-28 bg-muted flex items-center justify-center relative">
              {project.image ? (
                <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Image className="h-8 w-8 mb-1" />
                  <span className="text-xs">No Image</span>
                </div>
              )}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {roles.map((role) => {
                  const config = ROLE_CONFIG[role];
                  if (!config) return null;
                  const IconComponent = config.icon;
                  return (
                    <Badge key={role} variant="secondary" className={`text-xs ${config.color} border`}>
                      <IconComponent className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  );
                })}
              </div>
              <Button variant="secondary" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground truncate">Code: {project.code}</p>
              <h3 className="font-semibold text-foreground truncate text-sm">{project.name}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1"><FolderOpen className="h-3 w-3" /><span>{project.itemCount}</span></div>
                <div className="flex items-center gap-1"><FileText className="h-3 w-3" /><span>{project.testCount}</span></div>
                <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{project.scheduleCount}</span></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Layout 2: List/Table View
  const TableLayout = () => (
    <div className="p-4">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-center">Tests</TableHead>
              <TableHead className="text-center">Schedules</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProjects.map((project) => {
              const roles = userRolesMap[project.id] || ["admin"];
              return (
                <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                      {project.image ? (
                        <img src={project.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Image className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="text-muted-foreground">{project.code}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {roles.map((role) => {
                        const config = ROLE_CONFIG[role];
                        if (!config) return null;
                        return (
                          <Badge key={role} variant="secondary" className={`text-xs ${config.color} border`}>
                            {config.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{project.itemCount}</TableCell>
                  <TableCell className="text-center">{project.testCount}</TableCell>
                  <TableCell className="text-center">{project.scheduleCount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  // Layout 3: Kanban Board
  const KanbanLayout = () => {
    const statuses = [
      { key: "active", label: "Active", color: "bg-green-500" },
      { key: "draft", label: "Draft", color: "bg-yellow-500" },
      { key: "completed", label: "Completed", color: "bg-blue-500" },
    ];
    
    const getProjectsByStatus = (status: string) => {
      if (status === "active") return mockProjects.slice(0, 2);
      if (status === "draft") return mockProjects.slice(2, 3);
      return mockProjects.slice(3);
    };

    return (
      <div className="p-4 flex gap-4 overflow-x-auto">
        {statuses.map((status) => (
          <div key={status.key} className="flex-shrink-0 w-80">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${status.color}`} />
              <h3 className="font-semibold text-foreground">{status.label}</h3>
              <Badge variant="secondary" className="ml-auto">{getProjectsByStatus(status.key).length}</Badge>
            </div>
            <div className="space-y-3">
              {getProjectsByStatus(status.key).map((project) => {
                const roles = userRolesMap[project.id] || ["admin"];
                return (
                  <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex gap-1 mb-2">
                        {roles.map((role) => {
                          const config = ROLE_CONFIG[role];
                          if (!config) return null;
                          return (
                            <Badge key={role} variant="secondary" className={`text-xs ${config.color} border`}>
                              {config.label}
                            </Badge>
                          );
                        })}
                      </div>
                      <h4 className="font-medium text-sm mb-1">{project.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{project.code}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><FolderOpen className="h-3 w-3" />{project.itemCount}</span>
                        <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{project.testCount}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Layout 4: Large Hero Cards
  const HeroCardsLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {mockProjects.map((project) => {
        const roles = userRolesMap[project.id] || ["admin"];
        return (
          <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex">
              <div className="w-48 h-48 bg-muted flex-shrink-0 relative overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Image className="h-12 w-12 mb-2" />
                    <span className="text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-1 flex-wrap">
                    {roles.map((role) => {
                      const config = ROLE_CONFIG[role];
                      if (!config) return null;
                      const IconComponent = config.icon;
                      return (
                        <Badge key={role} variant="secondary" className={`${config.color} border`}>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      );
                    })}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{project.code}</p>
                <h3 className="font-semibold text-lg text-foreground mb-3">{project.name}</h3>
                <div className="mt-auto grid grid-cols-3 gap-4 pt-3 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{project.itemCount}</p>
                    <p className="text-xs text-muted-foreground">Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{project.testCount}</p>
                    <p className="text-xs text-muted-foreground">Tests</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{project.scheduleCount}</p>
                    <p className="text-xs text-muted-foreground">Schedules</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  // Layout 5: Sidebar + Detail Panel
  const SidebarDetailLayout = () => (
    <div className="flex h-[500px] border rounded-lg overflow-hidden m-4">
      <ScrollArea className="w-80 border-r bg-card">
        <div className="p-2">
          {mockProjects.map((project) => {
            const roles = userRolesMap[project.id] || ["admin"];
            const isSelected = selectedProject.id === project.id;
            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`p-3 rounded-lg cursor-pointer mb-1 transition-colors ${
                  isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Image className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{project.name}</h4>
                    <p className="text-xs text-muted-foreground">{project.code}</p>
                    <div className="flex gap-1 mt-1">
                      {roles.slice(0, 2).map((role) => {
                        const config = ROLE_CONFIG[role];
                        if (!config) return null;
                        return (
                          <Badge key={role} variant="secondary" className={`text-[10px] px-1.5 py-0 ${config.color} border`}>
                            {config.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  {isSelected && <ChevronRight className="h-4 w-4 text-primary" />}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="flex-1 bg-background p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden">
            {selectedProject.image ? (
              <img src={selectedProject.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              {(userRolesMap[selectedProject.id] || ["admin"]).map((role) => {
                const config = ROLE_CONFIG[role];
                if (!config) return null;
                const IconComponent = config.icon;
                return (
                  <Badge key={role} variant="secondary" className={`${config.color} border`}>
                    <IconComponent className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                );
              })}
            </div>
            <h2 className="text-2xl font-bold text-foreground">{selectedProject.name}</h2>
            <p className="text-muted-foreground">{selectedProject.code}</p>
          </div>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{selectedProject.itemCount}</p>
              <p className="text-sm text-muted-foreground">Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{selectedProject.testCount}</p>
              <p className="text-sm text-muted-foreground">Tests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{selectedProject.scheduleCount}</p>
              <p className="text-sm text-muted-foreground">Schedules</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1">Open Project</Button>
          <Button variant="outline" className="flex-1">View Details</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Project Layout Options</h1>
        </div>
        {selectedLayout && (
          <Button onClick={() => navigate("/admin")} className="gap-2">
            <Check className="h-4 w-4" />
            Apply "{selectedLayout}" Layout
          </Button>
        )}
      </header>

      <Tabs defaultValue="grid" className="w-full">
        <div className="border-b bg-card px-4">
          <TabsList className="h-12 bg-transparent gap-1">
            <TabsTrigger value="grid" className="gap-2 data-[state=active]:bg-primary/10" onClick={() => handleSelectLayout("Card Grid")}>
              <Grid3X3 className="h-4 w-4" />
              Card Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2 data-[state=active]:bg-primary/10" onClick={() => handleSelectLayout("List/Table")}>
              <List className="h-4 w-4" />
              List/Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="gap-2 data-[state=active]:bg-primary/10" onClick={() => handleSelectLayout("Kanban Board")}>
              <Columns className="h-4 w-4" />
              Kanban Board
            </TabsTrigger>
            <TabsTrigger value="hero" className="gap-2 data-[state=active]:bg-primary/10" onClick={() => handleSelectLayout("Hero Cards")}>
              <LayoutTemplate className="h-4 w-4" />
              Hero Cards
            </TabsTrigger>
            <TabsTrigger value="sidebar" className="gap-2 data-[state=active]:bg-primary/10" onClick={() => handleSelectLayout("Sidebar + Detail")}>
              <PanelLeftClose className="h-4 w-4" />
              Sidebar + Detail
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="mt-0">
          <CardGridLayout />
        </TabsContent>
        <TabsContent value="table" className="mt-0">
          <TableLayout />
        </TabsContent>
        <TabsContent value="kanban" className="mt-0">
          <KanbanLayout />
        </TabsContent>
        <TabsContent value="hero" className="mt-0">
          <HeroCardsLayout />
        </TabsContent>
        <TabsContent value="sidebar" className="mt-0">
          <SidebarDetailLayout />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectLayoutShowcase;
