import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, Sparkles } from "lucide-react";
import { GeneratedItem } from "./GenerateItemsDialog";

interface GeneratedItemsReviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: GeneratedItem[];
  onConfirm: (selectedItems: GeneratedItem[]) => void;
}

export const GeneratedItemsReview = ({
  open,
  onOpenChange,
  items,
  onConfirm,
}: GeneratedItemsReviewProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(items.map((item) => item.id))
  );

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  };

  const handleConfirm = () => {
    const selectedItems = items.filter((item) => selectedIds.has(item.id));
    onConfirm(selectedItems);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Review Generated Items
          </DialogTitle>
          <DialogDescription>
            Select the items you want to add to your assessment. {selectedIds.size} of {items.length} items selected.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 pb-2 border-b">
          <Checkbox
            checked={selectedIds.size === items.length}
            onCheckedChange={toggleAll}
            id="select-all"
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select All
          </label>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedIds.has(item.id)
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Q{index + 1}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.score} pt
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{item.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-2 p-2 rounded text-sm ${
                            option.isCorrect
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              : "bg-muted"
                          }`}
                        >
                          {option.isCorrect ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span>{option.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Add {selectedIds.size} Items
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
