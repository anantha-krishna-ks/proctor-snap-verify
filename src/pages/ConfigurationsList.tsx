import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Settings, 
  MoreHorizontal, 
  Clock, 
  Shield, 
  FileText,
  ChevronDown,
  Layers,
  ClipboardList,
  Search,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { mockConfigurations } from "@/data/formsMockData";
import { mockForms } from "@/data/formsMockData";
import { mockSurveys } from "@/data/surveyMockData";
import { format } from "date-fns";

const ConfigurationsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConfigs = mockConfigurations.filter((config) =>
    config.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalForms: mockForms.length,
    configurations: mockConfigurations.length,
    surveys: mockSurveys.length,
    defaultConfigs: mockConfigurations.filter((c) => c.isDefault).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              {/* Module Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-xl font-semibold hover:bg-transparent px-0">
                    <Layers className="h-5 w-5 text-accent" />
                    <span>Configurations</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-popover">
                  <DropdownMenuItem 
                    onClick={() => navigate("/forms")}
                    className="gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Forms</p>
                      <p className="text-xs text-muted-foreground">{stats.totalForms} forms</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/forms/configurations")}
                    className="gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      <Settings className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Configurations</p>
                      <p className="text-xs text-muted-foreground">{stats.configurations} configs</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => navigate("/surveys")}
                    className="gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                      <ClipboardList className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">Surveys</p>
                      <p className="text-xs text-muted-foreground">{stats.surveys} surveys</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button onClick={() => navigate("/forms/configurations/create")} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Configuration
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border/50 hover:border-border transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Configurations</p>
                  <p className="text-3xl font-bold text-foreground">{stats.configurations}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-border transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Default</p>
                  <p className="text-3xl font-bold text-success">{stats.defaultConfigs}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-border transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Forms Using</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalForms}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search configurations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
        </div>

        {/* Configurations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConfigs.map((config) => (
            <Card 
              key={config.id} 
              className="bg-card border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {config.name}
                      </CardTitle>
                      {config.isDefault && (
                        <Badge className="bg-success/10 text-success border-success/20 text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      Created {format(new Date(config.createdAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
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
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Exam Rules Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>Exam Rules</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm pl-8">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{config.examRules.duration} min</span>
                    <span className="text-muted-foreground">Language:</span>
                    <span className="font-medium">{config.examRules.language}</span>
                    <span className="text-muted-foreground">Back Nav:</span>
                    <span className="font-medium">{config.examRules.allowBackNavigation ? "Yes" : "No"}</span>
                  </div>
                </div>

                {/* Security Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <div className="h-6 w-6 rounded bg-warning/10 flex items-center justify-center">
                      <Shield className="h-3.5 w-3.5 text-warning" />
                    </div>
                    <span>Security</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-8">
                    {config.security.startPaused && (
                      <Badge variant="outline" className="text-xs">Start Paused</Badge>
                    )}
                    {config.security.fullScreenMode && (
                      <Badge variant="outline" className="text-xs">Full Screen</Badge>
                    )}
                    {config.security.shuffleQuestions && (
                      <Badge variant="outline" className="text-xs">Shuffle</Badge>
                    )}
                    {config.security.preventCopyPaste && (
                      <Badge variant="outline" className="text-xs">No Copy</Badge>
                    )}
                    {!config.security.startPaused &&
                      !config.security.fullScreenMode &&
                      !config.security.shuffleQuestions &&
                      !config.security.preventCopyPaste && (
                        <span className="text-xs text-muted-foreground italic">No restrictions</span>
                      )}
                  </div>
                </div>

                {/* Instructions Preview */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <div className="h-6 w-6 rounded bg-accent/10 flex items-center justify-center">
                      <FileText className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <span>Instructions</span>
                  </div>
                  <div
                    className="text-xs text-muted-foreground pl-8 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: config.examInstructions }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredConfigs.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <Settings className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">No configurations found</p>
              <Button 
                variant="outline"
                onClick={() => navigate("/forms/configurations/create")}
              >
                Create your first configuration
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConfigurationsList;
