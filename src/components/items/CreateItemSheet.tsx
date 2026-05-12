import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export interface NewItemDraft {
  code: string;
  question: string;
  type: string;
  score: number;
  language: string;
  options: { text: string; isCorrect: boolean }[];
}

interface CreateItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveDraft: (item: NewItemDraft) => void;
}

const CreateItemSheet = ({ open, onOpenChange, onSaveDraft }: CreateItemSheetProps) => {
  const [form, setForm] = useState<NewItemDraft>({
    code: "",
    question: "",
    type: "Multiple Choice",
    score: 1,
    language: "English",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const update = <K extends keyof NewItemDraft>(k: K, v: NewItemDraft[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const updateOption = (i: number, patch: Partial<{ text: string; isCorrect: boolean }>) =>
    setForm((p) => ({
      ...p,
      options: p.options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)),
    }));

  const addOption = () =>
    setForm((p) => ({ ...p, options: [...p.options, { text: "", isCorrect: false }] }));

  const removeOption = (i: number) =>
    setForm((p) => ({ ...p, options: p.options.filter((_, idx) => idx !== i) }));

  const reset = () =>
    setForm({
      code: "",
      question: "",
      type: "Multiple Choice",
      score: 1,
      language: "English",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });

  const handleSave = () => {
    if (!form.code.trim() || !form.question.trim()) {
      toast.error("Item code and question are required.");
      return;
    }
    if (form.options.some((o) => !o.text.trim())) {
      toast.error("All options must have text.");
      return;
    }
    if (!form.options.some((o) => o.isCorrect)) {
      toast.error("Mark at least one option as correct.");
      return;
    }
    onSaveDraft(form);
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col p-0">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>Create New Item</SheetTitle>
          <SheetDescription>
            Item will be saved as a draft. Submit it to the workflow once ready.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="item-code">Item Code <span className="text-destructive">*</span></Label>
              <Input id="item-code" value={form.code} onChange={(e) => update("code", e.target.value)} placeholder="e.g., MBA001-31" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => update("type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                    <SelectItem value="True/False">True / False</SelectItem>
                    <SelectItem value="Short Answer">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Score</Label>
                <Input type="number" min={0} value={form.score}
                  onChange={(e) => update("score", parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={form.language} onValueChange={(v) => update("language", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Question <span className="text-destructive">*</span></Label>
              <Textarea id="question" rows={3} value={form.question}
                onChange={(e) => update("question", e.target.value)} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-3 w-3 mr-1" /> Add Option
                </Button>
              </div>
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Checkbox checked={opt.isCorrect} onCheckedChange={(c) => updateOption(i, { isCorrect: !!c })} />
                  <Input value={opt.text} placeholder={`Option ${i + 1}`}
                    onChange={(e) => updateOption(i, { text: e.target.value })} />
                  {form.options.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => removeOption(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Tick the checkbox to mark the correct option.</p>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t border-border">
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>Save as Draft</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateItemSheet;
