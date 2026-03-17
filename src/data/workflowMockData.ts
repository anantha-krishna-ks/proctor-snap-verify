import type { Workflow, WorkflowRole, WorkflowStep } from "@/types/workflow";

// ── Organization-level roles ──
export const organizationRoles: WorkflowRole[] = [
  { id: "org-author", name: "Content Author", scope: "organization", description: "Creates and drafts content across all programs" },
  { id: "org-reviewer", name: "Content Reviewer", scope: "organization", description: "Reviews content for quality and accuracy" },
  { id: "org-approver", name: "Content Approver", scope: "organization", description: "Final approval authority at org level" },
  { id: "org-sme", name: "Subject Matter Expert", scope: "organization", description: "Domain expert for specialized review" },
  { id: "org-qa", name: "QA Analyst", scope: "organization", description: "Quality assurance and compliance checks" },
];

// ── Program-level roles ──
export const programRoles: WorkflowRole[] = [
  { id: "prog-author", name: "Item Author", scope: "program", description: "Creates items for this specific program" },
  { id: "prog-reviewer", name: "Item Reviewer", scope: "program", description: "Reviews items within this program" },
  { id: "prog-lead-reviewer", name: "Lead Reviewer", scope: "program", description: "Senior reviewer with escalation authority" },
  { id: "prog-approver", name: "Program Approver", scope: "program", description: "Approves items for publication in this program" },
  { id: "prog-publisher", name: "Publisher", scope: "program", description: "Publishes approved items to live assessments" },
];

export const allWorkflowRoles = [...organizationRoles, ...programRoles];

// ── Default notification templates ──
const defaultNotifications = (trigger: "on_assignment" | "on_submission" | "on_approval" | "on_rejection") => [
  { trigger, enabled: true, channels: ["email" as const, "in_app" as const] },
];

// ── Preset: 3-Level Workflow ──
const threeLevel: WorkflowStep[] = [
  {
    id: "step-1", order: 1, name: "Authoring", levelType: "author",
    roleId: "prog-author", assignedUserIds: ["user-4"],
    approvalRule: "any_one", slaHours: 48,
    notifications: defaultNotifications("on_assignment"),
    conditions: [], isRequired: true, canSkip: false,
  },
  {
    id: "step-2", order: 2, name: "Review", levelType: "reviewer",
    roleId: "prog-reviewer", assignedUserIds: ["user-2"],
    approvalRule: "any_one", slaHours: 24,
    notifications: defaultNotifications("on_submission"),
    conditions: [], isRequired: true, canSkip: false,
  },
  {
    id: "step-3", order: 3, name: "Final Approval", levelType: "approver",
    roleId: "prog-approver", assignedUserIds: ["user-1"],
    approvalRule: "all", slaHours: 12,
    notifications: defaultNotifications("on_approval"),
    conditions: [], isRequired: true, canSkip: false,
  },
];

// ── Preset: 4-Level Workflow ──
const fourLevel: WorkflowStep[] = [
  {
    id: "step-1", order: 1, name: "Authoring", levelType: "author",
    roleId: "prog-author", assignedUserIds: ["user-4"],
    approvalRule: "any_one", slaHours: 48,
    notifications: defaultNotifications("on_assignment"),
    conditions: [], isRequired: true, canSkip: false,
  },
  {
    id: "step-2", order: 2, name: "Peer Review", levelType: "reviewer",
    roleId: "prog-reviewer", assignedUserIds: ["user-2"],
    approvalRule: "any_one", slaHours: 24,
    notifications: defaultNotifications("on_submission"),
    conditions: [], isRequired: true, canSkip: false,
  },
  {
    id: "step-3", order: 3, name: "SME Review", levelType: "reviewer",
    roleId: "org-sme", assignedUserIds: ["user-3"],
    approvalRule: "all", slaHours: 36,
    notifications: defaultNotifications("on_submission"),
    conditions: [], isRequired: true, canSkip: true,
  },
  {
    id: "step-4", order: 4, name: "Final Approval", levelType: "approver",
    roleId: "prog-approver", assignedUserIds: ["user-1"],
    approvalRule: "all", slaHours: 12,
    notifications: defaultNotifications("on_approval"),
    conditions: [], isRequired: true, canSkip: false,
  },
];

// ── Mock Workflows ──
export const mockWorkflows: Workflow[] = [
  {
    id: "wf-1", name: "Standard 3-Level", description: "Author → Review → Approve",
    programId: "1", preset: "3-level", status: "active",
    steps: threeLevel, createdAt: "2025-01-15", updatedAt: "2025-02-01", createdBy: "user-1",
  },
  {
    id: "wf-2", name: "Enhanced 4-Level", description: "Author → Peer Review → SME Review → Approve",
    programId: "2", preset: "4-level", status: "active",
    steps: fourLevel, createdAt: "2025-01-20", updatedAt: "2025-02-05", createdBy: "user-1",
  },
  {
    id: "wf-3", name: "Quick Review", description: "Author → Approve (skip review)",
    programId: "3", preset: "custom", status: "draft",
    steps: [threeLevel[0], threeLevel[2]].map((s, i) => ({ ...s, id: `step-${i + 1}`, order: i + 1 })),
    createdAt: "2025-02-10", updatedAt: "2025-02-10", createdBy: "user-1",
  },
];

export const getWorkflowForProgram = (programId: string): Workflow | undefined => {
  return mockWorkflows.find(w => w.programId === programId);
};
