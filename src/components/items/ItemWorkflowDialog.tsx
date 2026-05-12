import { useState } from "react";
import { Check, Send, X, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Workflow } from "@/types/workflow";
import type { ItemWorkflowState } from "@/types/itemWorkflow";
import { allWorkflowRoles } from "@/data/workflowMockData";

interface ItemWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemCode: string;
  workflow: Workflow;
  state: ItemWorkflowState;
  onAdvance: (action: "submit" | "approve" | "publish", comment: string) => void;
  onReject: (comment: string) => void;
}

const roleName = (id: string) => allWorkflowRoles.find((r) => r.id === id)?.name ?? id;

const ItemWorkflowDialog = ({
  open, onOpenChange, itemCode, workflow, state, onAdvance, onReject,
}: ItemWorkflowDialogProps) => {
  const [comment, setComment] = useState("");

  const steps = workflow.steps;
  const currentIdx = state.currentStepIndex;
  const isPublished = state.status === "published";
  const isRejected = state.status === "rejected";
  const currentStep = steps[currentIdx];
  const isLastStep = currentIdx === steps.length - 1;
  const isAuthorStep = currentIdx === 0 && state.status === "draft";

  const primaryAction: { label: string; action: "submit" | "approve" | "publish" } | null =
    isPublished || isRejected
      ? null
      : isAuthorStep
      ? { label: "Submit for Review", action: "submit" }
      : isLastStep
      ? { label: "Approve & Publish", action: "publish" }
      : { label: "Approve & Send to Next", action: "approve" };

  const handlePrimary = () => {
    if (!primaryAction) return;
    onAdvance(primaryAction.action, comment);
    setComment("");
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject(comment);
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Item Workflow — {itemCode}</DialogTitle>
          <DialogDescription>
            Following workflow: <span className="font-medium text-foreground">{workflow.name}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="space-y-3 py-2">
          {steps.map((step, idx) => {
            const completed = isPublished || idx < currentIdx || (isRejected && idx < currentIdx);
            const active = !isPublished && !isRejected && idx === currentIdx;
            const Icon = completed ? CheckCircle2 : active ? Clock : Circle;
            return (
              <div key={step.id} className="flex items-start gap-3">
                <Icon className={cn(
                  "h-5 w-5 mt-0.5 shrink-0",
                  completed && "text-primary",
                  active && "text-amber-500",
                  !completed && !active && "text-muted-foreground"
                )} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{step.name}</p>
                    <Badge variant="outline" className="text-xs">{roleName(step.roleId)}</Badge>
                    {active && <Badge className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30" variant="outline">Pending</Badge>}
                    {completed && <Badge className="text-xs bg-primary/10 text-primary border-primary/30" variant="outline">Done</Badge>}
                  </div>
                  {step.slaHours && (
                    <p className="text-xs text-muted-foreground">SLA: {step.slaHours}h • Approval: {step.approvalRule.replace("_", " ")}</p>
                  )}
                </div>
              </div>
            );
          })}
          {isRejected && (
            <div className="flex items-start gap-3 rounded-md bg-destructive/10 border border-destructive/30 p-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Item rejected</p>
                <p className="text-muted-foreground text-xs">Returned to author. Update and resubmit.</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* History */}
        {state.history.length > 0 && (
          <div className="max-h-40 overflow-auto space-y-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground">History</p>
            {state.history.slice().reverse().map((h, i) => (
              <div key={i} className="text-xs flex justify-between gap-3 border-b last:border-0 border-border pb-1">
                <div>
                  <span className="font-medium capitalize">{h.action}</span>
                  <span className="text-muted-foreground"> at {h.stepName} by {h.by}</span>
                  {h.comment && <p className="text-muted-foreground italic">“{h.comment}”</p>}
                </div>
                <span className="text-muted-foreground whitespace-nowrap">{h.at}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action area */}
        {!isPublished && (
          <div className="space-y-2">
            <label className="text-xs font-medium">Comment (optional)</label>
            <Textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder={isAuthorStep ? "Notes for the reviewer..." : "Review notes..."} />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {!isPublished && !isAuthorStep && !isRejected && (
            <Button variant="destructive" onClick={handleReject}>
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
          )}
          {primaryAction && (
            <Button onClick={handlePrimary}>
              {primaryAction.action === "submit" ? <Send className="h-4 w-4 mr-1" /> : <Check className="h-4 w-4 mr-1" />}
              {primaryAction.label}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemWorkflowDialog;
