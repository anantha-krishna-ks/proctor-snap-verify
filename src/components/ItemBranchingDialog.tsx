import { useState, useEffect } from "react";
import { GitBranch, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormItem, FormSection, ItemOption, BranchingTarget } from "@/types/forms";

const getItemTypeLabel = (type: FormItem["type"]) => {
  switch (type) {
    case "mcq": return "Multiple Choice";
    case "true-false": return "True/False";
    case "essay": return "Essay";
    case "fill-blank": return "Fill in the Blank";
    default: return type;
  }
};

interface ItemBranchingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FormItem;
  sections: FormSection[];
  currentSectionId: string;
  allItems: { sectionId: string; item: FormItem; index: number }[];
  onSaveBranching: (item: FormItem) => void;
}

const ItemBranchingDialog = ({
  open,
  onOpenChange,
  item,
  sections,
  currentSectionId,
  allItems,
  onSaveBranching,
}: ItemBranchingDialogProps) => {
  // Initialize options with defaults based on item type
  const [options, setOptions] = useState<ItemOption[]>([]);
  // For essay/fill-blank, we use a simple "after answer" navigation
  const [simpleTarget, setSimpleTarget] = useState<BranchingTarget>({ type: "next" });

  useEffect(() => {
    if (item.type === "mcq") {
      // Use existing options or create default ones
      const defaultOptions: ItemOption[] = item.options?.length
        ? item.options
        : [
            { id: "opt-a", text: "Option A", branchTo: { type: "next" } },
            { id: "opt-b", text: "Option B", branchTo: { type: "next" } },
            { id: "opt-c", text: "Option C", branchTo: { type: "next" } },
            { id: "opt-d", text: "Option D", branchTo: { type: "next" } },
          ];
      setOptions(defaultOptions);
    } else if (item.type === "true-false") {
      const defaultOptions: ItemOption[] = item.options?.length
        ? item.options
        : [
            { id: "opt-true", text: "True", branchTo: { type: "next" } },
            { id: "opt-false", text: "False", branchTo: { type: "next" } },
          ];
      setOptions(defaultOptions);
    } else if (item.type === "essay" || item.type === "fill-blank") {
      // For essay/fill-blank, check if there's existing branching config
      const existingTarget = item.options?.[0]?.branchTo || { type: "next" };
      setSimpleTarget(existingTarget);
    }
  }, [item]);

  const getBranchTargetValue = (branchTo?: BranchingTarget): string => {
    if (!branchTo) return "next";
    if (branchTo.type === "next") return "next";
    if (branchTo.type === "end") return "end";
    if (branchTo.type === "section") return `section:${branchTo.sectionId}`;
    if (branchTo.type === "item") return `item:${branchTo.itemId}`;
    return "next";
  };

  const parseBranchTargetValue = (value: string): BranchingTarget => {
    if (value === "next") return { type: "next" };
    if (value === "end") return { type: "end" };
    if (value.startsWith("section:")) {
      return { type: "section", sectionId: value.replace("section:", "") };
    }
    if (value.startsWith("item:")) {
      return { type: "item", itemId: value.replace("item:", "") };
    }
    return { type: "next" };
  };

  const handleOptionBranchChange = (optionId: string, value: string) => {
    setOptions(
      options.map((opt) =>
        opt.id === optionId
          ? { ...opt, branchTo: parseBranchTargetValue(value) }
          : opt
      )
    );
  };

  const handleSave = () => {
    if (item.type === "essay" || item.type === "fill-blank") {
      // For essay/fill-blank, save simple target
      const hasAnyBranching = simpleTarget.type !== "next";
      onSaveBranching({
        ...item,
        options: [{ id: "after-answer", text: "After answer", branchTo: simpleTarget }],
        hasBranching: hasAnyBranching,
      });
    } else {
      // For MCQ/true-false, save per-option branching
      const hasAnyBranching = options.some(
        (opt) => opt.branchTo && opt.branchTo.type !== "next"
      );
      onSaveBranching({
        ...item,
        options,
        hasBranching: hasAnyBranching,
      });
    }
    onOpenChange(false);
  };

  const handleRemoveBranching = () => {
    if (item.type === "essay" || item.type === "fill-blank") {
      onSaveBranching({
        ...item,
        options: [{ id: "after-answer", text: "After answer", branchTo: { type: "next" } }],
        hasBranching: false,
      });
    } else {
      onSaveBranching({
        ...item,
        options: options.map((opt) => ({ ...opt, branchTo: { type: "next" } })),
        hasBranching: false,
      });
    }
    onOpenChange(false);
  };

  // Get items that come after the current item
  const getAvailableTargets = () => {
    const currentItemIndex = allItems.findIndex(
      (ai) => ai.item.id === item.id && ai.sectionId === currentSectionId
    );

    return allItems
      .filter((_, idx) => idx > currentItemIndex)
      .map((ai) => ({
        value: `item:${ai.item.id}`,
        label: `Q${ai.index + 1}: ${ai.item.title.substring(0, 40)}${ai.item.title.length > 40 ? "..." : ""}`,
        sectionName: sections.find((s) => s.id === ai.sectionId)?.name || "",
      }));
  };

  const availableTargets = getAvailableTargets();

  // Render simple branching UI for essay/fill-blank
  const renderSimpleBranching = () => (
    <div className="space-y-4 py-4">
      {/* Question Preview */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium line-clamp-2">{item.title}</p>
        <Badge variant="secondary" className="mt-2 text-xs">
          {getItemTypeLabel(item.type)}
        </Badge>
      </div>

      {/* Simple navigation after answer */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">After this question, go to:</Label>
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary font-medium rounded-full text-sm">
            ✓
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">After answer submitted</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select
            value={getBranchTargetValue(simpleTarget)}
            onValueChange={(value) => setSimpleTarget(parseBranchTargetValue(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Go to..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">
                <span className="text-muted-foreground">Continue to next question</span>
              </SelectItem>
              {sections
                .filter((s) => s.id !== currentSectionId || sections.length === 1)
                .map((section) => (
                  <SelectItem key={section.id} value={`section:${section.id}`}>
                    Go to: {section.name}
                  </SelectItem>
                ))}
              {availableTargets.slice(0, 10).map((target) => (
                <SelectItem key={target.value} value={target.value}>
                  <span className="truncate">{target.label}</span>
                </SelectItem>
              ))}
              <SelectItem value="end">
                <span className="text-destructive">End form</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // Render per-option branching UI for MCQ/true-false
  const renderOptionsBranching = () => (
    <div className="space-y-4 py-4">
      {/* Question Preview */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium line-clamp-2">{item.title}</p>
        <Badge variant="secondary" className="mt-2 text-xs">
          {getItemTypeLabel(item.type)}
        </Badge>
      </div>

      {/* Options with branching */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Answer Options</Label>
        {options.map((option, idx) => (
          <div
            key={option.id}
            className="flex items-center gap-3 p-3 border rounded-lg bg-card"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary font-medium rounded-full text-sm">
              {item.type === "mcq"
                ? String.fromCharCode(65 + idx)
                : option.text.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{option.text}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select
              value={getBranchTargetValue(option.branchTo)}
              onValueChange={(value) =>
                handleOptionBranchChange(option.id, value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Go to..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next">
                  <span className="text-muted-foreground">Continue to next question</span>
                </SelectItem>
                {sections
                  .filter((s) => s.id !== currentSectionId || sections.length === 1)
                  .map((section) => (
                    <SelectItem key={section.id} value={`section:${section.id}`}>
                      Go to: {section.name}
                    </SelectItem>
                  ))}
                {availableTargets.slice(0, 10).map((target) => (
                  <SelectItem key={target.value} value={target.value}>
                    <span className="truncate">{target.label}</span>
                  </SelectItem>
                ))}
                <SelectItem value="end">
                  <span className="text-destructive">End form</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Add Branching
          </DialogTitle>
          <DialogDescription>
            {item.type === "essay" || item.type === "fill-blank"
              ? "Choose where to navigate after this question is answered."
              : "Choose where to navigate based on each answer option."}
          </DialogDescription>
        </DialogHeader>

        {item.type === "essay" || item.type === "fill-blank"
          ? renderSimpleBranching()
          : renderOptionsBranching()}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {item.hasBranching && (
            <Button
              variant="outline"
              onClick={handleRemoveBranching}
              className="text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Remove Branching
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Branching</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemBranchingDialog;
