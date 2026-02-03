import { useMemo, useState } from "react";
import { 
  ArrowRight, 
  Circle, 
  CornerDownRight, 
  Flag, 
  GitBranch, 
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FormItem, FormSection, BranchingTarget } from "@/types/forms";

interface BranchingFlowPreviewProps {
  sections: FormSection[];
  onClose?: () => void;
}

interface FlowNode {
  id: string;
  type: 'item' | 'section-start' | 'end';
  label: string;
  itemType?: FormItem['type'];
  hasBranching: boolean;
  branches: {
    label: string;
    target: BranchingTarget;
    targetLabel: string;
  }[];
  sectionId: string;
  sectionName: string;
}

const BranchingFlowPreview = ({ sections, onClose }: BranchingFlowPreviewProps) => {
  const [expanded, setExpanded] = useState(true);

  // Build flow nodes from sections and items
  const flowNodes = useMemo(() => {
    const nodes: FlowNode[] = [];
    
    sections.forEach((section) => {
      // Add section header node
      nodes.push({
        id: `section-${section.id}`,
        type: 'section-start',
        label: section.name,
        hasBranching: false,
        branches: [],
        sectionId: section.id,
        sectionName: section.name,
      });

      section.items.forEach((item) => {
        const branches: FlowNode['branches'] = [];

        if (item.hasBranching && item.options) {
          item.options.forEach((option) => {
            if (option.branchTo) {
              branches.push({
                label: option.text,
                target: option.branchTo,
                targetLabel: getTargetLabel(option.branchTo, sections),
              });
            }
          });
        } else if (item.hasBranching && item.options && item.options.length === 1) {
          // Simple branching for non-MCQ items
          const target = item.options[0]?.branchTo;
          if (target) {
            branches.push({
              label: 'After submission',
              target,
              targetLabel: getTargetLabel(target, sections),
            });
          }
        }

        nodes.push({
          id: item.id,
          type: 'item',
          label: item.title,
          itemType: item.type,
          hasBranching: item.hasBranching || false,
          branches,
          sectionId: section.id,
          sectionName: section.name,
        });
      });
    });

    // Add end node
    nodes.push({
      id: 'end',
      type: 'end',
      label: 'End of Form',
      hasBranching: false,
      branches: [],
      sectionId: 'end',
      sectionName: '',
    });

    return nodes;
  }, [sections]);

  const itemsWithBranching = flowNodes.filter(n => n.type === 'item' && n.hasBranching);

  const getTypeBadgeColor = (type?: FormItem['type']) => {
    switch (type) {
      case 'mcq': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'essay': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'fill-blank': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'true-false': return 'bg-green-500/10 text-green-600 border-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="border-primary/20 bg-card">
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                <GitBranch className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Branching Flow Preview</CardTitle>
                {expanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {itemsWithBranching.length} item{itemsWithBranching.length !== 1 ? 's' : ''} with branching
              </Badge>
              {onClose && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {itemsWithBranching.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No branching rules configured</p>
                <p className="text-xs">Click "Add Branching" on any item to get started</p>
              </div>
            ) : (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-4">
                  {/* Flow diagram */}
                  <div className="relative">
                    {flowNodes.map((node, index) => {
                      if (node.type === 'section-start') {
                        return (
                          <div key={node.id} className="mb-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              <div className="h-px flex-1 bg-border" />
                              <span>{node.label}</span>
                              <div className="h-px flex-1 bg-border" />
                            </div>
                          </div>
                        );
                      }

                      if (node.type === 'end') {
                        return (
                          <div key={node.id} className="flex items-center gap-2 pt-2">
                            <Flag className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">{node.label}</span>
                          </div>
                        );
                      }

                      const nextNode = flowNodes[index + 1];
                      const showConnector = nextNode && nextNode.type !== 'section-start';

                      return (
                        <div key={node.id} className="relative">
                          {/* Item node */}
                          <div className={cn(
                            "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                            node.hasBranching 
                              ? "bg-primary/5 border-primary/30" 
                              : "bg-muted/30 border-border"
                          )}>
                            <div className={cn(
                              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                              node.hasBranching ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                              {flowNodes.filter(n => n.type === 'item').indexOf(node) + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium truncate">{node.label}</span>
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-[10px] px-1.5", getTypeBadgeColor(node.itemType))}
                                >
                                  {node.itemType}
                                </Badge>
                              </div>
                              
                              {/* Branching paths */}
                              {node.hasBranching && node.branches.length > 0 && (
                                <div className="mt-2 space-y-1.5">
                                  {node.branches.map((branch, bIndex) => (
                                    <div 
                                      key={bIndex}
                                      className="flex items-center gap-2 text-xs bg-background/80 rounded px-2 py-1.5 border border-border/50"
                                    >
                                      <CornerDownRight className="h-3 w-3 text-primary flex-shrink-0" />
                                      <span className="text-muted-foreground truncate">
                                        If "<span className="text-foreground font-medium">{branch.label}</span>"
                                      </span>
                                      <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                      <Badge variant="secondary" className="text-[10px] px-1.5 flex-shrink-0">
                                        {branch.targetLabel}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {node.hasBranching && node.branches.length === 0 && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                  <CornerDownRight className="h-3 w-3 text-primary" />
                                  <span>After submission</span>
                                  <ArrowRight className="h-3 w-3" />
                                  <Badge variant="secondary" className="text-[10px] px-1.5">
                                    Custom navigation
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Connector line */}
                          {showConnector && !node.hasBranching && (
                            <div className="ml-[18px] h-4 w-px bg-border" />
                          )}
                          {showConnector && node.hasBranching && (
                            <div className="ml-[18px] h-4 w-px bg-primary/50 border-l border-dashed border-primary/30" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 pt-2 border-t text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span>Has branching</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-muted" />
                      <span>Linear flow</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CornerDownRight className="h-3 w-3 text-primary" />
                      <span>Branch path</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

// Helper function to get readable target label
function getTargetLabel(target: BranchingTarget, sections: FormSection[]): string {
  switch (target.type) {
    case 'next':
      return 'Next question';
    case 'end':
      return 'End form';
    case 'section':
      const section = sections.find(s => s.id === target.sectionId);
      return section ? `Go to ${section.name}` : 'Go to section';
    case 'item':
      for (const sec of sections) {
        const item = sec.items.find(i => i.id === target.itemId);
        if (item) {
          return `Go to: ${item.title.slice(0, 20)}${item.title.length > 20 ? '...' : ''}`;
        }
      }
      return 'Go to item';
    default:
      return 'Unknown';
  }
}

export default BranchingFlowPreview;
