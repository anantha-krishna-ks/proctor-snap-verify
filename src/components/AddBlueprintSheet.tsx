import { useState } from "react";
import { Plus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { FormBlueprint } from "@/types/forms";

// Mock blueprints
const availableBlueprints: FormBlueprint[] = [
  {
    id: "bp-1",
    name: "Balanced Assessment",
    description: "Mix of easy, medium, and hard questions",
    rules: [
      { difficulty: "easy", count: 5 },
      { difficulty: "medium", count: 3 },
      { difficulty: "hard", count: 2 },
    ],
  },
  {
    id: "bp-2",
    name: "MCQ Only",
    description: "Multiple choice questions for quick assessment",
    rules: [
      { type: "mcq", count: 10 },
    ],
  },
  {
    id: "bp-3",
    name: "Physics Section",
    description: "Questions from Physics category",
    rules: [
      { category: "Physics", difficulty: "easy", count: 2 },
      { category: "Physics", difficulty: "medium", count: 2 },
      { category: "Physics", difficulty: "hard", count: 1 },
    ],
  },
  {
    id: "bp-4",
    name: "Essay Assessment",
    description: "Long-form answer questions",
    rules: [
      { type: "essay", difficulty: "medium", count: 2 },
      { type: "essay", difficulty: "hard", count: 1 },
    ],
  },
];

interface AddBlueprintSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyBlueprint: (blueprint: FormBlueprint) => void;
}

const AddBlueprintSheet = ({ open, onOpenChange, onApplyBlueprint }: AddBlueprintSheetProps) => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<FormBlueprint | null>(null);

  const handleApply = () => {
    if (selectedBlueprint) {
      onApplyBlueprint(selectedBlueprint);
      setSelectedBlueprint(null);
      onOpenChange(false);
    }
  };

  const getRuleBadges = (rules: FormBlueprint['rules']) => {
    return rules.map((rule, index) => {
      const parts = [];
      if (rule.category) parts.push(rule.category);
      if (rule.difficulty) parts.push(rule.difficulty);
      if (rule.type) parts.push(rule.type);
      parts.push(`×${rule.count}`);
      return (
        <Badge key={index} variant="secondary" className="text-xs">
          {parts.join(" • ")}
        </Badge>
      );
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Rule/Blueprint</SheetTitle>
          <SheetDescription>
            Apply predefined rules to automatically select items
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-3">
            {availableBlueprints.map((blueprint) => (
              <Card
                key={blueprint.id}
                className={`cursor-pointer transition-all ${
                  selectedBlueprint?.id === blueprint.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/30"
                }`}
                onClick={() => setSelectedBlueprint(blueprint)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{blueprint.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {blueprint.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {getRuleBadges(blueprint.rules)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedBlueprint && (
            <div className="sticky bottom-0 pt-4 bg-background border-t">
              <Button className="w-full" onClick={handleApply}>
                <Plus className="h-4 w-4 mr-2" />
                Apply Blueprint
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddBlueprintSheet;
