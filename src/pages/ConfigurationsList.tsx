import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  Clock,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockConfigurations, mockRepositories } from "@/data/formsMockData";
import { format } from "date-fns";

const ConfigurationsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepository, setSelectedRepository] = useState(mockRepositories[0]?.id || "");
  const [expandedRepos, setExpandedRepos] = useState<string[]>([mockRepositories[0]?.id || ""]);
  const [rowsPerPage, setRowsPerPage] = useState("25");

  const toggleRepoExpand = (repoId: string) => {
    setExpandedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    );
  };

  const filteredConfigs = mockConfigurations.filter(
    (config) =>
      config.repositoryId === selectedRepository &&
      config.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConfigCount = (repoId: string) => {
    return mockConfigurations.filter(c => c.repositoryId === repoId).length;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">Saras</span>
              <span className="text-[10px] text-muted-foreground block -mt-1">TEST & ASSESSMENT</span>
            </div>
          </div>
          <div className="ml-6">
            <span className="text-xs text-muted-foreground">Manage Configurations</span>
            <h1 className="text-lg font-semibold text-foreground -mt-0.5">Manage Configurations</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground">NSE Admin</span>
          <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
            <span className="text-primary text-sm font-medium">NA</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Repository Sidebar */}
        <aside className="w-80 border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Repositories</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            {mockRepositories.map((repo) => (
              <div key={repo.id}>
                <button
                  onClick={() => {
                    setSelectedRepository(repo.id);
                    toggleRepoExpand(repo.id);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors ${
                    selectedRepository === repo.id 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  {expandedRepos.includes(repo.id) ? (
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                  {expandedRepos.includes(repo.id) ? (
                    <FolderOpen className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  ) : (
                    <Folder className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  )}
                  <span className="flex-1 truncate">{repo.name}</span>
                  <span className="text-xs text-muted-foreground">({getConfigCount(repo.id)})</span>
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-primary text-primary-foreground px-4 py-1.5">
                Repository
              </Badge>
              <Select value={selectedRepository} onValueChange={setSelectedRepository}>
                <SelectTrigger className="w-64 bg-background">
                  <SelectValue placeholder="Select repository" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockRepositories.map((repo) => (
                    <SelectItem key={repo.id} value={repo.id}>
                      {repo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by configuration name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate("/forms/configurations/create")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Configuration
              </Button>
              
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      CONFIGURATION NAME
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">DURATION</TableHead>
                  <TableHead className="font-semibold text-foreground">LANGUAGE</TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      SECURITY
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      MODIFIED DATE
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      VERSION
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfigs.map((config) => (
                  <TableRow 
                    key={config.id} 
                    className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border"
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{config.name}</span>
                        {config.isDefault && (
                          <Badge className="bg-success/10 text-success border-success/20 text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {config.examRules.duration} min
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {config.examRules.language}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {config.security.fullScreenMode && (
                          <Badge variant="outline" className="text-xs">Full Screen</Badge>
                        )}
                        {config.security.shuffleQuestions && (
                          <Badge variant="outline" className="text-xs">Shuffle</Badge>
                        )}
                        {config.security.preventCopyPaste && (
                          <Badge variant="outline" className="text-xs">No Copy</Badge>
                        )}
                        {!config.security.fullScreenMode &&
                          !config.security.shuffleQuestions &&
                          !config.security.preventCopyPaste && (
                            <span className="text-xs text-muted-foreground italic">None</span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(config.updatedAt), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="text-center text-foreground">
                      {config.version}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          {!config.isDefault && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredConfigs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Settings className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No configurations found in this repository</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate("/forms/configurations/create")}
                          className="mt-2"
                        >
                          Create your first configuration
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>1-{Math.min(parseInt(rowsPerPage), filteredConfigs.length)} of {filteredConfigs.length}</span>
              <span className="ml-4">Rows per page:</span>
              <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                <SelectTrigger className="w-16 h-8 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm text-foreground">1/1</span>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="py-3 text-center text-xs text-muted-foreground border-t border-border">
            Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd{" "}
            <a
              href="https://www.excelsoftcorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://www.excelsoftcorp.com
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConfigurationsList;