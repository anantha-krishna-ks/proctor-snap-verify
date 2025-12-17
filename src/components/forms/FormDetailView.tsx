import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  Shield,
  Eye,
  Navigation,
  FileText,
  History,
  Pencil,
  Copy,
  Calendar,
  RotateCcw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { mockFormTemplates, type FormTemplate } from "@/types/formTemplates";
import { toast } from "sonner";

interface FormDetailViewProps {
  formId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export const FormDetailView = ({ formId, onBack, onEdit }: FormDetailViewProps) => {
  const form = mockFormTemplates.find((f) => f.id === formId);

  if (!form) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Form not found</p>
      </div>
    );
  }

  const { metadata, preferences, blueprint, exposure, versions } = form;
  const totalItems = blueprint.reduce((sum, rule) => sum + rule.count, 0);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-card">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="mt-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="capitalize">{metadata.type}</Badge>
                <Badge variant="outline" className={form.status === "active" ? "bg-success/10 text-success" : ""}>
                  {form.status}
                </Badge>
                <span className="text-sm text-muted-foreground">v{metadata.version}</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">{metadata.title}</h1>
              <p className="text-muted-foreground mt-1">{metadata.subject} {metadata.grade && `• ${metadata.grade}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast.success("Form duplicated")}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline" onClick={() => toast.info("Opening scheduler...")}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button onClick={() => onEdit(formId)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
            <TabsTrigger value="exposure">Exposure</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{preferences.duration}m</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalItems}</p>
                      <p className="text-xs text-muted-foreground">Items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{exposure.totalCandidates.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Candidates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{exposure.avgScore > 0 ? `${exposure.avgScore}%` : "—"}</p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Navigation</span><span className="font-medium capitalize">{preferences.navigationStyle.replace("-", " ")}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Scoring</span><span className="font-medium capitalize">{preferences.scoringType}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Passing Score</span><span className="font-medium">{preferences.passingScore || "—"}%</span></div>
                  <div className="flex justify-between py-2"><span className="text-muted-foreground">Proctoring</span><Badge variant={preferences.proctoring.enabled ? "default" : "secondary"}>{preferences.proctoring.enabled ? "Enabled" : "Disabled"}</Badge></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {metadata.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">{metadata.description}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blueprint">
            <Card>
              <CardHeader><CardTitle>Blueprint Rules</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {blueprint.map((rule, i) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">{rule.count}</span>
                      <div>
                        <p className="font-medium">{rule.topic}</p>
                        <p className="text-sm text-muted-foreground capitalize">{rule.difficulty} • {rule.bloomLevel || "Any"}</p>
                      </div>
                    </div>
                    {rule.mandatory && <Badge>Mandatory</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exposure">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Usage Statistics</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><p className="text-sm text-muted-foreground mb-1">Completion Rate</p><Progress value={exposure.completionRate} /><p className="text-right text-sm mt-1">{exposure.completionRate}%</p></div>
                  <div><p className="text-sm text-muted-foreground mb-1">Usage Count</p><p className="text-2xl font-bold">{exposure.usageCount} sessions</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Psychometric Health</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between"><span>Reliability (α)</span><span className="font-bold">{exposure.reliability > 0 ? exposure.reliability.toFixed(2) : "—"}</span></div>
                  <div className="flex justify-between"><span>Avg Score</span><span className="font-bold">{exposure.avgScore}%</span></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="versions">
            <Card>
              <CardHeader><CardTitle>Version History</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {versions.map((v) => (
                  <div key={v.version} className={cn("flex items-center justify-between p-4 rounded-lg border", v.isActive ? "bg-primary/5 border-primary/20" : "bg-muted/30")}>
                    <div className="flex items-center gap-4">
                      <History className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Version {v.version} {v.isActive && <Badge className="ml-2">Current</Badge>}</p>
                        <p className="text-sm text-muted-foreground">{v.changes}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{v.createdAt}</p>
                      {!v.isActive && <Button variant="ghost" size="sm"><RotateCcw className="h-3 w-3 mr-1" />Rollback</Button>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
