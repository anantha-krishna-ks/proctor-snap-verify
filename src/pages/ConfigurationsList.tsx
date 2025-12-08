import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Settings, MoreHorizontal, Clock, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockConfigurations } from "@/data/formsMockData";
import { format } from "date-fns";

const ConfigurationsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConfigs = mockConfigurations.filter((config) =>
    config.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/forms")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Configurations</h1>
              <p className="text-sm text-muted-foreground">
                Manage exam configurations and settings
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search configurations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-sm"
          />
          <Button onClick={() => navigate("/forms/configurations/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Configuration
          </Button>
        </div>

        {/* Configurations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConfigs.map((config) => (
            <Card key={config.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      {config.isDefault && (
                        <Badge variant="secondary" className="text-xs">
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
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      {!config.isDefault && (
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Exam Rules Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Exam Rules</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-sm pl-6">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{config.examRules.duration} min</span>
                    <span className="text-muted-foreground">Language:</span>
                    <span>{config.examRules.language}</span>
                    <span className="text-muted-foreground">Back Navigation:</span>
                    <span>{config.examRules.allowBackNavigation ? "Yes" : "No"}</span>
                  </div>
                </div>

                {/* Security Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pl-6">
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
                        <span className="text-xs text-muted-foreground">No restrictions</span>
                      )}
                  </div>
                </div>

                {/* Instructions Preview */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Instructions</span>
                  </div>
                  <div
                    className="text-xs text-muted-foreground pl-6 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: config.examInstructions }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredConfigs.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No configurations found
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConfigurationsList;
