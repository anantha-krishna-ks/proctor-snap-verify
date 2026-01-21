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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-items', {
        body: {
          prompt,
          model: selectedModel,
          itemType,
          difficulty,
          numberOfItems: parseInt(numberOfItems),
        },
      });

      console.log("Edge function response:", { data, error });

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Failed to generate items. Please try again.");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      // Handle both possible response formats
      const items = data?.items || (Array.isArray(data) ? data : null);
      
      if (items && items.length > 0) {
        onGenerate(items);
        onOpenChange(false);
        setPrompt("");
        toast.success(`Generated ${items.length} items successfully!`);
      } else {
        console.error("Unexpected response format:", data);
        toast.error("No items were generated. Please try again.");
      }
    } catch (err) {
      console.error("Error calling generate-items:", err);
      toast.error("Failed to connect to AI service. Please try again.");
    } finally {
      setIsGenerating(false);
    }
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
