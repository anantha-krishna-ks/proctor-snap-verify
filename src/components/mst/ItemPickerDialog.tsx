import { useState, useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormItem } from "@/types/forms";

interface ItemPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: FormItem[];
  alreadyAssignedIds: string[];
  moduleName: string;
  onAssign: (items: FormItem[]) => void;
}

const difficultyColor: Record<string, string> = {
  easy: "bg-green-500/10 text-green-600 border-green-500/30",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  hard: "bg-red-500/10 text-red-600 border-red-500/30",
};

const typeColor: Record<string, string> = {
  mcq: "bg-blue-500/10 text-blue-600",
  essay: "bg-purple-500/10 text-purple-600",
  "fill-blank": "bg-orange-500/10 text-orange-600",
  "true-false": "bg-cyan-500/10 text-cyan-600",
};

export const ItemPickerDialog = ({
  open, onOpenChange, items, alreadyAssignedIds, moduleName, onAssign,
}: ItemPickerDialogProps) => {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.category?.toLowerCase().includes(search.toLowerCase()));
      const matchDiff = diffFilter === "all" || item.difficulty === diffFilter;
      const matchType = typeFilter === "all" || item.type === typeFilter;
      return matchSearch && matchDiff && matchType;
    });
  }, [items, search, diffFilter, typeFilter]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const available = filtered.filter(i => !alreadyAssignedIds.includes(i.id));
    if (available.every(i => selected.has(i.id))) {
      setSelected(prev => {
        const next = new Set(prev);
        available.forEach(i => next.delete(i.id));
        return next;
      });
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        available.forEach(i => next.add(i.id));
        return next;
      });
    }
  };

  const handleAssign = () => {
    const selectedItems = items.filter(i => selected.has(i.id));
    onAssign(selectedItems);
    setSelected(new Set());
    setSearch("");
    setDiffFilter("all");
    setTypeFilter("all");
    onOpenChange(false);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setSelected(new Set());
      setSearch("");
    }
    onOpenChange(v);
  };

  const availableFiltered = filtered.filter(i => !alreadyAssignedIds.includes(i.id));
  const allSelected = availableFiltered.length > 0 && availableFiltered.every(i => selected.has(i.id));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Items to {moduleName}</DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={diffFilter} onValueChange={setDiffFilter}>
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-32">
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
          {filtered.length} items found • {selected.size} selected
        </p>

        {/* Item List */}
        <ScrollArea className="flex-1 min-h-0 border rounded-lg">
          <div className="divide-y divide-border">
            {/* Select all header */}
            <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 sticky top-0">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
              />
              <span className="text-sm font-medium text-muted-foreground">Select All</span>
            </div>

            {filtered.map(item => {
              const isAssigned = alreadyAssignedIds.includes(item.id);
              const isChecked = selected.has(item.id);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors",
                    isAssigned && "opacity-40 cursor-not-allowed",
                    !isAssigned && "hover:bg-muted/30 cursor-pointer",
                    isChecked && !isAssigned && "bg-primary/5",
                  )}
                  onClick={() => !isAssigned && toggle(item.id)}
                >
                  <Checkbox
                    checked={isChecked}
                    disabled={isAssigned}
                    onCheckedChange={() => !isAssigned && toggle(item.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {item.difficulty && (
                        <Badge variant="outline" className={cn("text-[10px] px-1.5", difficultyColor[item.difficulty])}>
                          {item.difficulty}
                        </Badge>
                      )}
                      <Badge variant="secondary" className={cn("text-[10px] px-1.5", typeColor[item.type])}>
                        {item.type}
                      </Badge>
                      {item.category && (
                        <span className="text-[10px] text-muted-foreground">{item.category}</span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{item.marks}pts</span>
                    </div>
                  </div>
                  {isAssigned && (
                    <Badge variant="outline" className="text-[10px] shrink-0">Assigned</Badge>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No items found</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAssign} disabled={selected.size === 0}>
            Add {selected.size} Item{selected.size !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
