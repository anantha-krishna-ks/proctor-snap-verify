import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  GripVertical,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { FormItem } from "@/types/forms";

interface ItemBankSidebarProps {
  items: FormItem[];
  onDragStart?: (item: FormItem) => void;
  onAddItem?: (item: FormItem) => void;
  usedItemIds?: string[];
}

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/10 text-green-600 border-green-500/30';
    case 'medium':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
    case 'hard':
      return 'bg-red-500/10 text-red-600 border-red-500/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    mcq: 'bg-blue-500/10 text-blue-600',
    essay: 'bg-purple-500/10 text-purple-600',
    'fill-blank': 'bg-orange-500/10 text-orange-600',
    'true-false': 'bg-cyan-500/10 text-cyan-600',
  };
  return colors[type] || 'bg-muted text-muted-foreground';
};

export const ItemBankSidebar = ({
  items,
  onDragStart,
  onAddItem,
  usedItemIds = [],
}: ItemBankSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(items.map(i => i.category || 'Uncategorized'));
    return Array.from(cats).sort();
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDifficulty = 
        difficultyFilter === 'all' || item.difficulty === difficultyFilter;
      
      const matchesType = 
        typeFilter === 'all' || item.type === typeFilter;
      
      return matchesSearch && matchesDifficulty && matchesType;
    });
  }, [items, searchQuery, difficultyFilter, typeFilter]);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const groups: Record<string, FormItem[]> = {};
    
    filteredItems.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    
    return groups;
  }, [filteredItems]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleDragStart = (e: React.DragEvent, item: FormItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(item);
  };

  return (
    <div className="h-full flex flex-col bg-card border-r">
      <div className="p-4 border-b space-y-3">
        <h3 className="font-semibold">Item Bank</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="flex-1 h-8">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="flex-1 h-8">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="mcq">MCQ</SelectItem>
              <SelectItem value="essay">Essay</SelectItem>
              <SelectItem value="fill-blank">Fill Blank</SelectItem>
              <SelectItem value="true-false">True/False</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <p className="text-xs text-muted-foreground">
          {filteredItems.length} items • Drag to add to flow
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <Collapsible
              key={category}
              open={expandedCategories.includes(category)}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between h-9 px-2"
                >
                  <div className="flex items-center gap-2">
                    {expandedCategories.includes(category) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {categoryItems.length}
                  </Badge>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="pl-4 space-y-1 mt-1">
                  {categoryItems.map(item => {
                    const isUsed = usedItemIds.includes(item.id);
                    
                    return (
                      <div
                        key={item.id}
                        draggable={!isUsed}
                        onDragStart={(e) => handleDragStart(e, item)}
                        className={cn(
                          "group flex items-center gap-2 p-2 rounded-md border bg-background transition-colors",
                          !isUsed && "cursor-grab hover:bg-muted/50 hover:border-primary/50",
                          isUsed && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate" title={item.title}>
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge 
                              variant="outline" 
                              className={cn("text-[10px] px-1.5", getDifficultyColor(item.difficulty))}
                            >
                              {item.difficulty}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={cn("text-[10px] px-1.5", getTypeColor(item.type))}
                            >
                              {item.type}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {item.marks}pts
                            </span>
                          </div>
                        </div>
                        
                        {!isUsed && onAddItem && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100"
                            onClick={() => onAddItem(item)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {isUsed && (
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            In use
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
          
          {Object.keys(itemsByCategory).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No items found</p>
              <p className="text-xs">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
