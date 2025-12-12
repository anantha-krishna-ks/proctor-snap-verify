import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Settings, 
  MoreHorizontal, 
  Clock, 
  Shield, 
  FileText,
  ClipboardList,
  Search
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
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { mockConfigurations } from "@/data/formsMockData";
import { format } from "date-fns";

const ConfigurationsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConfigs = mockConfigurations.filter((config) =>
    config.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6">
          {/* Title and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-foreground">Configurations</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/forms")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Forms
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/forms/configurations")}
                  className="text-primary bg-primary/10"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configurations
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/surveys")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ClipboardList className="h-4 w-4 mr-1" />
                  Surveys
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate("/forms/configurations/create")}>
                <Plus className="h-4 w-4 mr-1" />
                Create Configuration
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search configurations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Configurations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredConfigs.map((config) => (
              <Card 
                key={config.id} 
                className="bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base group-hover:text-primary transition-colors truncate">
                          {config.name}
                        </CardTitle>
                        {config.isDefault && (
                          <Badge className="bg-success/10 text-success border-success/20 text-xs shrink-0">
                            Default
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        Created {format(new Date(config.createdAt), "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
                <CardContent className="space-y-3 pt-0">
                  {/* Exam Rules */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{config.examRules.duration} min</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{config.examRules.language}</span>
                  </div>

                  {/* Security Tags */}
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
                        <span className="text-xs text-muted-foreground italic">No restrictions</span>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredConfigs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No configurations found matching your search.
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
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