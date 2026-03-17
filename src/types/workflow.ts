// ── Workflow Types ──

export type WorkflowLevelType = "author" | "reviewer" | "approver" | "custom";
export type WorkflowRoleScope = "organization" | "program";
export type ApprovalRule = "any_one" | "all" | "majority" | "minimum_count";
export type WorkflowPreset = "3-level" | "4-level" | "custom";
export type WorkflowStatus = "draft" | "active" | "archived";
export type NotificationTrigger = "on_assignment" | "on_submission" | "on_approval" | "on_rejection" | "sla_warning" | "sla_breach";

export interface WorkflowRole {
  id: string;
  name: string;
  scope: WorkflowRoleScope;
  description: string;
}

export interface WorkflowNotification {
  trigger: NotificationTrigger;
  enabled: boolean;
  channels: ("email" | "in_app")[];
  templateId?: string;
}

export interface WorkflowCondition {
  id: string;
  field: string; // e.g. "item_type", "difficulty", "score"
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains";
  value: string;
}

export interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  levelType: WorkflowLevelType;
  roleId: string; // references WorkflowRole
  assignedUserIds: string[];
  approvalRule: ApprovalRule;
  minimumApprovers?: number; // used when approvalRule = "minimum_count"
  slaHours?: number; // deadline in hours
  notifications: WorkflowNotification[];
  conditions: WorkflowCondition[];
  isRequired: boolean;
  canSkip: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  programId: string;
  preset: WorkflowPreset;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
