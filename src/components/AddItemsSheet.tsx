import { useState } from "react";
import { Search, Filter, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { FormItem } from "@/types/forms";

// Mock available items with options for MCQ
const availableItems: FormItem[] = [
  { 
    id: "item-1", 
    title: "What is the capital of France?", 
    type: "mcq", 
    marks: 2, 
    category: "Geography", 
    difficulty: "easy",
    options: [
      { id: "1a", text: "London" },
      { id: "1b", text: "Paris", isCorrect: true },
      { id: "1c", text: "Berlin" },
      { id: "1d", text: "Madrid" },
    ]
  },
  { id: "item-2", title: "Explain the theory of relativity", type: "essay", marks: 10, category: "Physics", difficulty: "hard" },
  { id: "item-3", title: "The sun rises in the ___", type: "fill-blank", marks: 1, category: "General Knowledge", difficulty: "easy" },
  { 
    id: "item-4", 
    title: "Water boils at 100°C", 
    type: "true-false", 
    marks: 1, 
    category: "Science", 
    difficulty: "easy",
    options: [
      { id: "4a", text: "True", isCorrect: true },
      { id: "4b", text: "False" },
    ]
  },
  { 
    id: "item-5", 
    title: "Calculate the area of a circle with radius 5", 
    type: "mcq", 
    marks: 3, 
    category: "Mathematics", 
    difficulty: "medium",
    options: [
      { id: "5a", text: "25π", isCorrect: true },
      { id: "5b", text: "10π" },
      { id: "5c", text: "50π" },
      { id: "5d", text: "5π" },
    ]
  },
  { id: "item-6", title: "Describe photosynthesis process", type: "essay", marks: 8, category: "Biology", difficulty: "medium" },
  { 
    id: "item-7", 
    title: "What is Newton's first law?", 
    type: "mcq", 
    marks: 2, 
    category: "Physics", 
    difficulty: "easy",
    options: [
      { id: "7a", text: "Law of Inertia", isCorrect: true },
      { id: "7b", text: "Law of Acceleration" },
      { id: "7c", text: "Law of Action-Reaction" },
      { id: "7d", text: "Law of Gravity" },
    ]
  },
  { id: "item-8", title: "Solve: 2x + 5 = 15", type: "fill-blank", marks: 2, category: "Mathematics", difficulty: "easy" },
  { 
    id: "item-9", 
    title: "The Earth is flat", 
    type: "true-false", 
    marks: 1, 
    category: "Geography", 
    difficulty: "easy",
    options: [
      { id: "9a", text: "True" },
      { id: "9b", text: "False", isCorrect: true },
    ]
  },
  { id: "item-10", title: "Explain the water cycle", type: "essay", marks: 6, category: "Science", difficulty: "medium" },
];

const categories = ["All", "Geography", "Physics", "Mathematics", "Biology", "Science", "General Knowledge"];
const types = ["All", "mcq", "essay", "fill-blank", "true-false"];
const difficulties = ["All", "easy", "medium", "hard"];

interface AddItemsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingItemIds: string[];
  onAddItems: (items: FormItem[]) => void;
}

const AddItemsSheet = ({ open, onOpenChange, existingItemIds, onAddItems }: AddItemsSheetProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [selectedItems, setSelectedItems] = useState<FormItem[]>([]);

  const filteredItems = availableItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    const matchesDifficulty = difficultyFilter === "All" || item.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  });

  const toggleItemSelection = (item: FormItem) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleAddItems = () => {
    onAddItems(selectedItems);
    setSelectedItems([]);
    onOpenChange(false);
  };

  const getItemTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      mcq: "bg-blue-500/10 text-blue-600",
      essay: "bg-purple-500/10 text-purple-600",
      "fill-blank": "bg-orange-500/10 text-orange-600",
      "true-false": "bg-green-500/10 text-green-600",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  const getDifficultyBadge = (difficulty?: string) => {
    const colors: Record<string, string> = {
      easy: "bg-emerald-500/10 text-emerald-600",
      medium: "bg-amber-500/10 text-amber-600",
      hard: "bg-red-500/10 text-red-600",
    };
    return colors[difficulty || ""] || "bg-muted text-muted-foreground";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Items</SheetTitle>
          <SheetDescription>
            Search and filter items to add to your section
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>{type === "All" ? "All Types" : type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff} value={diff}>{diff === "All" ? "All Levels" : diff}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected count */}
          {selectedItems.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium">
                {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
              </span>
              <Button size="sm" onClick={handleAddItems}>
                <Plus className="h-4 w-4 mr-2" />
                Add Selected
              </Button>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {filteredItems.map((item) => {
              const isAlreadyAdded = existingItemIds.includes(item.id);
              const isSelected = selectedItems.find((i) => i.id === item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => !isAlreadyAdded && toggleItemSelection(item)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isAlreadyAdded
                      ? "bg-muted/30 opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={!!isSelected || isAlreadyAdded}
                      disabled={isAlreadyAdded}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getItemTypeBadge(item.type)}`}>
                          {item.type}
                        </Badge>
                        {item.difficulty && (
                          <Badge className={`text-xs ${getDifficultyBadge(item.difficulty)}`}>
                            {item.difficulty}
                          </Badge>
                        )}
                        {item.category && (
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{item.marks} marks</span>
                      </div>
                    </div>
                    {isAlreadyAdded && (
                      <Badge variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Added
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No items found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddItemsSheet;
