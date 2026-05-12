// ── Item Workflow Types ──
export type ItemWorkflowStatus =
  | "draft"
  | "in_progress"
  | "rejected"
  | "published";

export interface ItemWorkflowHistoryEntry {
  stepId: string;
  stepName: string;
  action: "created" | "submitted" | "approved" | "rejected" | "published";
  by: string;
  at: string;
  comment?: string;
}

export interface ItemWorkflowState {
  workflowId: string;
  status: ItemWorkflowStatus;
  // index into workflow.steps representing the step that currently OWNS the item
  // when status === "draft", currentStepIndex points to the author step (0)
  // when status === "in_progress", it points to the reviewer/approver step that needs to act
  // when status === "published", it points past the last step
  currentStepIndex: number;
  history: ItemWorkflowHistoryEntry[];
}
