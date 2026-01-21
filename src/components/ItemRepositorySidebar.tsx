import { useState } from "react";
import { ChevronRight, Folder, FolderOpen, Plus, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Repository {
  id: string;
  name: string;
  itemCount: number;
  children?: Repository[];
}

interface ItemRepositorySidebarProps {
  repositories: Repository[];
  selectedRepository: string | null;
  onSelectRepository: (id: string) => void;
}

const RepositoryItem = ({
  repository,
  level = 0,
  selectedRepository,
  onSelectRepository,
}: {
  repository: Repository;
  level?: number;
  selectedRepository: string | null;
  onSelectRepository: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = repository.children && repository.children.length > 0;
  const isSelected = selectedRepository === repository.id;

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            "flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors group",
            isSelected && "bg-primary/10 text-primary"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onSelectRepository(repository.id)}
        >
          {hasChildren ? (
            <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-90"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          ) : (
            <span className="w-5" />
          )}
          {isOpen && hasChildren ? (
            <FolderOpen className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-primary shrink-0" />
          )}
          <span className="text-sm font-medium truncate flex-1">
            {repository.name}
          </span>
          <span className="text-xs text-muted-foreground">
            ({repository.itemCount})
          </span>
        </div>
        {hasChildren && (
          <CollapsibleContent>
            {repository.children?.map((child) => (
              <RepositoryItem
                key={child.id}
                repository={child}
                level={level + 1}
                selectedRepository={selectedRepository}
                onSelectRepository={onSelectRepository}
              />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

export const ItemRepositorySidebar = ({
  repositories,
  selectedRepository,
  onSelectRepository,
}: ItemRepositorySidebarProps) => {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Repositories</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {repositories.map((repo) => (
          <RepositoryItem
            key={repo.id}
            repository={repo}
            selectedRepository={selectedRepository}
            onSelectRepository={onSelectRepository}
          />
        ))}
      </div>
    </div>
  );
};
