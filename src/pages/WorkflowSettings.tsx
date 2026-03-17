import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Save, GitBranch, Zap, Settings2, Plus,
  CheckCircle2, Clock, Shield, AlertCircle,
} from "lucide-react";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { mockWorkflows, getWorkflowForProgram } from "@/data/workflowMockData";
import { mockProjects } from "@/data/projectMockData";
import type { Workflow, WorkflowPreset, WorkflowStatus } from "@/types/workflow";
import { toast } from "@/hooks/use-toast";

const statusColors: Record<WorkflowStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-emerald-500/10 text-emerald-600",
  archived: "bg-secondary text-secondary-foreground",
};

const WorkflowSettings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get("programId");

  // Load existing or create new
  const existing = programId ? getWorkflowForProgram(programId) : undefined;
  const program = programId ? mockProjects.find(p => p.id === programId) : undefined;

  const [workflow, setWorkflow] = useState<Workflow>(
    existing || {
      id: `wf-${Date.now()}`,
      name: "New Workflow",
      description: "",
      programId: programId || "",
      preset: "3-level",
      status: "draft",
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user-1",
    }
  );

  const [selectedWorkflowId, setSelectedWorkflowId] = useState(workflow.id);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = () => {
    toast({ title: "Workflow saved", description: `"${workflow.name}" has been saved successfully.` });
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-primary" />
                    Workflow Configuration
                  </h1>
                  {program && (
                    <p className="text-sm text-muted-foreground">
                      Program: <span className="font-medium text-foreground">{program.name}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", statusColors[workflow.status])}>
                  {workflow.status}
                </Badge>
                <Button size="sm" onClick={handleSave} className="gap-1.5">
                  <Save className="h-3.5 w-3.5" /> Save Workflow
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left: All workflows list */}
              <Card className="col-span-1">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    Workflows
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {mockWorkflows.map(wf => (
                      <button
                        key={wf.id}
                        className={cn(
                          "w-full text-left px-4 py-3 border-b border-border/50 hover:bg-accent/50 transition-colors",
                          selectedWorkflowId === wf.id && "bg-accent"
                        )}
                        onClick={() => {
                          setSelectedWorkflowId(wf.id);
                          setWorkflow(wf);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{wf.name}</p>
                          <Badge variant="outline" className={cn("text-[10px] h-5 ml-2", statusColors[wf.status])}>
                            {wf.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{wf.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                          <span>{wf.steps.length} steps</span>
                          <span>·</span>
                          <span>{wf.preset}</span>
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Right: Workflow builder */}
              <div className="col-span-2 space-y-4">
                {/* Workflow meta */}
                <Card>
                  <CardContent className="pt-4 pb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Workflow Name</Label>
                        <Input
                          value={workflow.name}
                          onChange={e => setWorkflow(w => ({ ...w, name: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Status</Label>
                        <Select value={workflow.status} onValueChange={(v: WorkflowStatus) => setWorkflow(w => ({ ...w, status: v }))}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={workflow.description}
                        onChange={e => setWorkflow(w => ({ ...w, description: e.target.value }))}
                        className="min-h-[60px] text-sm"
                        placeholder="Describe this workflow..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{workflow.steps.length}</p>
                        <p className="text-[10px] text-muted-foreground">Workflow Steps</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">
                          {workflow.steps.reduce((sum, s) => sum + (s.slaHours || 0), 0)}h
                        </p>
                        <p className="text-[10px] text-muted-foreground">Total SLA</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{workflow.steps.filter(s => s.isRequired).length}</p>
                        <p className="text-[10px] text-muted-foreground">Required Steps</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Builder */}
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Settings2 className="h-4 w-4" /> Workflow Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <WorkflowBuilder workflow={workflow} onChange={setWorkflow} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSettings;
