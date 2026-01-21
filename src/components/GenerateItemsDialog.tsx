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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GenerateItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (items: GeneratedItem[]) => void;
}

export interface GeneratedItem {
  id: string;
  code: string;
  question: string;
  type: string;
  options: { text: string; isCorrect: boolean }[];
  score: number;
}

const LLM_MODELS = [
  { id: "gemini-flash", name: "Gemini 3 Flash", provider: "Google", description: "Fast & efficient" },
  { id: "gemini-pro", name: "Gemini 3 Pro", provider: "Google", description: "Advanced reasoning" },
  { id: "gpt-5", name: "GPT-5", provider: "OpenAI", description: "Powerful all-rounder" },
  { id: "gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI", description: "Cost-effective" },
];

const ITEM_TYPES = [
  { id: "mcq", name: "Multiple Choice" },
  { id: "truefalse", name: "True/False" },
  { id: "fillin", name: "Fill in the Blanks" },
  { id: "essay", name: "Essay" },
];

const DIFFICULTY_LEVELS = [
  { id: "easy", name: "Easy" },
  { id: "medium", name: "Medium" },
  { id: "hard", name: "Hard" },
];

export const GenerateItemsDialog = ({
  open,
  onOpenChange,
  onGenerate,
}: GenerateItemsDialogProps) => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-flash");
  const [itemType, setItemType] = useState("mcq");
  const [difficulty, setDifficulty] = useState("medium");
  const [numberOfItems, setNumberOfItems] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedModelInfo = LLM_MODELS.find((m) => m.id === selectedModel);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation - in real implementation, this would call the AI gateway
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const mockGeneratedItems: GeneratedItem[] = Array.from(
      { length: parseInt(numberOfItems) },
      (_, i) => ({
        id: `gen-${Date.now()}-${i}`,
        code: `Demo001-Item-GEN${String(i + 1).padStart(3, "0")}`,
        question: `Generated question ${i + 1} based on: ${prompt.slice(0, 50)}...`,
        type: ITEM_TYPES.find((t) => t.id === itemType)?.name || "Multiple Choice",
        options: [
          { text: "Option A", isCorrect: i % 4 === 0 },
          { text: "Option B", isCorrect: i % 4 === 1 },
          { text: "Option C", isCorrect: i % 4 === 2 },
          { text: "Option D", isCorrect: i % 4 === 3 },
        ],
        score: 1,
      })
    );

    onGenerate(mockGeneratedItems);
    setIsGenerating(false);
    onOpenChange(false);
    setPrompt("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Items with AI
          </DialogTitle>
          <DialogDescription>
            Describe the topic or subject matter and let AI generate assessment items for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* LLM Model Selection */}
          <div className="space-y-2">
            <Label>AI Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {LLM_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <span>{model.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedModelInfo && (
              <p className="text-xs text-muted-foreground">
                {selectedModelInfo.description}
              </p>
            )}
          </div>

          {/* Item Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Item Type</Label>
              <Select value={itemType} onValueChange={setItemType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Number of Items */}
          <div className="space-y-2">
            <Label>Number of Items</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={numberOfItems}
              onChange={(e) => setNumberOfItems(e.target.value)}
              className="w-32"
            />
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <Label>Topic / Prompt</Label>
            <Textarea
              placeholder="Describe the topic or subject matter for the items. For example: 'Leadership styles and their effectiveness in crisis situations' or 'Change management strategies in organizations'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Items
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
