import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronRight,
  PenTool, Eye, CheckCircle2, Settings2, Clock, Bell,
  Filter, Users, AlertCircle, Zap, Shield,
} from "lucide-react";
import type { WorkflowStep, WorkflowLevelType, ApprovalRule, Workflow, WorkflowPreset } from "@/types/workflow";
import { allWorkflowRoles, organizationRoles, programRoles } from "@/data/workflowMockData";
import { mockUsers } from "@/data/adminMockData";

const levelIcons: Record<WorkflowLevelType, React.ElementType> = {
  author: PenTool,
  reviewer: Eye,
  approver: CheckCircle2,
  custom: Settings2,
};

const levelColors: Record<WorkflowLevelType, string> = {
  author: "bg-blue-500/10 text-blue-600 border-blue-200",
  reviewer: "bg-amber-500/10 text-amber-600 border-amber-200",
  approver: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  custom: "bg-purple-500/10 text-purple-600 border-purple-200",
};

const approvalRuleLabels: Record<ApprovalRule, string> = {
  any_one: "Any one member",
  all: "All members",
  majority: "Majority vote",
  minimum_count: "Minimum count",
};

interface WorkflowBuilderProps {
  workflow: Workflow;
  onChange: (workflow: Workflow) => void;
  compact?: boolean;
}

export const WorkflowBuilder = ({ workflow, onChange, compact = false }: WorkflowBuilderProps) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    onChange({
      ...workflow,
      steps: workflow.steps.map(s => s.id === stepId ? { ...s, ...updates } : s),
      updatedAt: new Date().toISOString(),
    });
  };

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      order: workflow.steps.length + 1,
      name: `Step ${workflow.steps.length + 1}`,
      levelType: "reviewer",
      roleId: programRoles[1]?.id || "",
      assignedUserIds: [],
      approvalRule: "any_one",
      slaHours: 24,
      notifications: [{ trigger: "on_submission", enabled: true, channels: ["email", "in_app"] }],
      conditions: [],
      isRequired: true,
      canSkip: false,
    };
    onChange({
      ...workflow,
      steps: [...workflow.steps, newStep],
      preset: "custom",
      updatedAt: new Date().toISOString(),
    });
    setExpandedStep(newStep.id);
  };

  const removeStep = (stepId: string) => {
    const filtered = workflow.steps.filter(s => s.id !== stepId);
    onChange({
      ...workflow,
      steps: filtered.map((s, i) => ({ ...s, order: i + 1 })),
      preset: "custom",
      updatedAt: new Date().toISOString(),
    });
  };

  const reorderSteps = (newOrder: WorkflowStep[]) => {
    onChange({
      ...workflow,
      steps: newOrder.map((s, i) => ({ ...s, order: i + 1 })),
      preset: "custom",
      updatedAt: new Date().toISOString(),
    });
  };

  const applyPreset = (preset: WorkflowPreset) => {
    // Keep the current workflow but signal preset change
    onChange({ ...workflow, preset, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="space-y-4">
      {/* Preset selector */}
      {!compact && (
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-muted-foreground">Preset:</Label>
          <div className="flex gap-1.5">
            {(["3-level", "4-level", "custom"] as WorkflowPreset[]).map(p => (
              <Button
                key={p}
                variant={workflow.preset === p ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => applyPreset(p)}
              >
                {p === "3-level" ? "3 Level" : p === "4-level" ? "4 Level" : "Custom"}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Vertical stepper */}
      <Reorder.Group axis="y" values={workflow.steps} onReorder={reorderSteps} className="space-y-0">
        {workflow.steps.map((step, idx) => {
          const isExpanded = expandedStep === step.id;
          const Icon = levelIcons[step.levelType];
          const role = allWorkflowRoles.find(r => r.id === step.roleId);
          const isLast = idx === workflow.steps.length - 1;

          return (
            <Reorder.Item key={step.id} value={step} className="relative">
              <div className="flex">
                {/* Connector line */}
                <div className="flex flex-col items-center mr-3 relative" style={{ width: 32 }}>
                  <motion.div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 relative",
                      levelColors[step.levelType]
                    )}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </motion.div>
                  {!isLast && (
                    <div className="w-0.5 bg-border flex-1 min-h-[16px]" />
                  )}
                </div>

                {/* Step card */}
                <div className="flex-1 mb-3">
                  <Collapsible open={isExpanded} onOpenChange={() => setExpandedStep(isExpanded ? null : step.id)}>
                    <motion.div
                      className={cn(
                        "border rounded-lg bg-card transition-shadow",
                        isExpanded ? "shadow-md ring-1 ring-primary/20" : "shadow-sm hover:shadow-md"
                      )}
                      layout
                    >
                      {/* Header */}
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center gap-2 p-3 cursor-pointer group">
                          <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-muted-foreground">#{step.order}</span>
                              <span className="text-sm font-semibold truncate">{step.name}</span>
                              <Badge variant="outline" className={cn("text-[10px] h-5", levelColors[step.levelType])}>
                                {step.levelType}
                              </Badge>
                              {role && (
                                <Badge variant="secondary" className="text-[10px] h-5">
                                  {role.scope === "organization" ? "🏢" : "📋"} {role.name}
                                </Badge>
                              )}
                            </div>
                            {!isExpanded && (
                              <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />{step.assignedUserIds.length} assigned
                                </span>
                                {step.slaHours && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />{step.slaHours}h SLA
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" />{approvalRuleLabels[step.approvalRule]}
                                </span>
                              </div>
                            )}
                          </div>
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </CollapsibleTrigger>

                      {/* Expanded config */}
                      <CollapsibleContent>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="px-3 pb-4 space-y-4 border-t border-border/50 pt-3"
                            >
                              {/* Basic info */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Step Name</Label>
                                  <Input
                                    value={step.name}
                                    onChange={e => updateStep(step.id, { name: e.target.value })}
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Level Type</Label>
                                  <Select value={step.levelType} onValueChange={(v: WorkflowLevelType) => updateStep(step.id, { levelType: v })}>
                                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="author">Author</SelectItem>
                                      <SelectItem value="reviewer">Reviewer</SelectItem>
                                      <SelectItem value="approver">Approver</SelectItem>
                                      <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Role assignment */}
                              <div className="space-y-1.5">
                                <Label className="text-xs flex items-center gap-1">
                                  Role
                                  <Badge variant="outline" className="text-[9px] h-4 ml-1">
                                    {allWorkflowRoles.find(r => r.id === step.roleId)?.scope === "organization" ? "Org Level" : "Program Level"}
                                  </Badge>
                                </Label>
                                <Select value={step.roleId} onValueChange={v => updateStep(step.id, { roleId: v })}>
                                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Organization Roles</div>
                                    {organizationRoles.map(r => (
                                      <SelectItem key={r.id} value={r.id}>
                                        <span className="flex items-center gap-1.5">🏢 {r.name}</span>
                                      </SelectItem>
                                    ))}
                                    <Separator className="my-1" />
                                    <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Program Roles</div>
                                    {programRoles.map(r => (
                                      <SelectItem key={r.id} value={r.id}>
                                        <span className="flex items-center gap-1.5">📋 {r.name}</span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Approval rule + SLA */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs flex items-center gap-1"><Shield className="h-3 w-3" /> Approval Rule</Label>
                                  <Select value={step.approvalRule} onValueChange={(v: ApprovalRule) => updateStep(step.id, { approvalRule: v })}>
                                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="any_one">Any one member</SelectItem>
                                      <SelectItem value="all">All members</SelectItem>
                                      <SelectItem value="majority">Majority vote</SelectItem>
                                      <SelectItem value="minimum_count">Minimum count</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> SLA (hours)</Label>
                                  <Input
                                    type="number"
                                    value={step.slaHours || ""}
                                    onChange={e => updateStep(step.id, { slaHours: parseInt(e.target.value) || undefined })}
                                    className="h-8 text-sm"
                                    placeholder="No SLA"
                                  />
                                </div>
                              </div>

                              {step.approvalRule === "minimum_count" && (
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Minimum Approvers</Label>
                                  <Input
                                    type="number"
                                    value={step.minimumApprovers || 1}
                                    onChange={e => updateStep(step.id, { minimumApprovers: parseInt(e.target.value) || 1 })}
                                    className="h-8 text-sm"
                                    min={1}
                                  />
                                </div>
                              )}

                              {/* Toggles */}
                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={step.isRequired}
                                    onCheckedChange={v => updateStep(step.id, { isRequired: v })}
                                    className="scale-75"
                                  />
                                  <Label className="text-xs">Required</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={step.canSkip}
                                    onCheckedChange={v => updateStep(step.id, { canSkip: v })}
                                    className="scale-75"
                                  />
                                  <Label className="text-xs">Can Skip</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Bell className="h-3 w-3 text-muted-foreground" />
                                  <Label className="text-xs text-muted-foreground">
                                    {step.notifications.filter(n => n.enabled).length} notifications
                                  </Label>
                                </div>
                              </div>

                              {/* Delete button */}
                              {workflow.steps.length > 1 && (
                                <div className="pt-2 border-t border-border/30">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeStep(step.id)}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" /> Remove Step
                                  </Button>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CollapsibleContent>
                    </motion.div>
                  </Collapsible>
                </div>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Add step */}
      <div className="flex pl-[44px]">
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-dashed" onClick={addStep}>
          <Plus className="h-3.5 w-3.5" /> Add Step
        </Button>
      </div>
    </div>
  );
};

// ── Compact read-only view for panel quick-view ──
export const WorkflowSummary = ({ workflow }: { workflow: Workflow }) => (
  <div className="space-y-1">
    {workflow.steps.map((step, idx) => {
      const Icon = levelIcons[step.levelType];
      const role = allWorkflowRoles.find(r => r.id === step.roleId);
      const isLast = idx === workflow.steps.length - 1;
      return (
        <div key={step.id} className="flex">
          <div className="flex flex-col items-center mr-3" style={{ width: 24 }}>
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border", levelColors[step.levelType])}>
              <Icon className="h-3 w-3" />
            </div>
            {!isLast && <div className="w-0.5 bg-border flex-1 min-h-[8px]" />}
          </div>
          <div className="flex-1 pb-2">
            <p className="text-xs font-medium">{step.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {role?.name} · {approvalRuleLabels[step.approvalRule]}
              {step.slaHours ? ` · ${step.slaHours}h SLA` : ""}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);
