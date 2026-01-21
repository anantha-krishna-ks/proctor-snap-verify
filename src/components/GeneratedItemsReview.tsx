import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Sparkles, Pencil, Save } from "lucide-react";
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
  items: initialItems,
  onConfirm,
}: GeneratedItemsReviewProps) => {
  const [items, setItems] = useState<GeneratedItem[]>(initialItems);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialItems.map((item) => item.id))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    question: string;
    options: { text: string; isCorrect: boolean }[];
  }>({ question: "", options: [] });

  // Reset state when dialog opens with new items
  useEffect(() => {
    if (open && initialItems.length > 0) {
      setItems(initialItems);
      setSelectedIds(new Set(initialItems.map((item) => item.id)));
      setEditingId(null);
    }
  }, [open, initialItems]);

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

  const startEditing = (item: GeneratedItem) => {
    setEditingId(item.id);
    setEditForm({
      question: item.question,
      options: item.options.map((opt) => ({ ...opt })),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ question: "", options: [] });
  };

  const saveEditing = () => {
    if (!editingId) return;
    
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId
          ? { ...item, question: editForm.question, options: editForm.options }
          : item
      )
    );
    setEditingId(null);
    setEditForm({ question: "", options: [] });
  };

  const updateOptionText = (index: number, text: string) => {
    setEditForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, text } : opt
      ),
    }));
  };

  const toggleCorrectOption = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      })),
    }));
  };

  const handleConfirm = () => {
    const selectedItems = items.filter((item) => selectedIds.has(item.id));
    onConfirm(selectedItems);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Review Generated Items
          </DialogTitle>
          <DialogDescription>
            Review and edit the generated items before adding them. Click the edit icon to modify any item. {selectedIds.size} of {items.length} items selected.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 pb-2 border-b">
          <Checkbox
            checked={selectedIds.size === items.length && items.length > 0}
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
                    disabled={editingId === item.id}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
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
                      {editingId === item.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEditing}
                            className="h-7 px-2"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={saveEditing}
                            className="h-7 px-2"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(item)}
                          className="h-7 px-2"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>

                    {editingId === item.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editForm.question}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              question: e.target.value,
                            }))
                          }
                          className="text-sm min-h-[60px]"
                          placeholder="Enter question text..."
                        />
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Click an option to mark it as correct:
                          </p>
                          {editForm.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex items-center gap-2"
                            >
                              <button
                                type="button"
                                onClick={() => toggleCorrectOption(optIndex)}
                                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  option.isCorrect
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground hover:border-primary"
                                }`}
                              >
                                {option.isCorrect && (
                                  <Check className="h-3 w-3" />
                                )}
                              </button>
                              <Input
                                value={option.text}
                                onChange={(e) =>
                                  updateOptionText(optIndex, e.target.value)
                                }
                                className="text-sm h-8"
                                placeholder={`Option ${optIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium">{item.question}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {item.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`flex items-center gap-2 p-2 rounded text-sm ${
                                option.isCorrect
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted"
                              }`}
                            >
                              {option.isCorrect ? (
                                <Check className="h-3 w-3 flex-shrink-0" />
                              ) : (
                                <X className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              )}
                              <span className="truncate">{option.text}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
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
            disabled={selectedIds.size === 0 || editingId !== null}
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
