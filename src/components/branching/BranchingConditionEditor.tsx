import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { 
  BranchRule, 
  BranchingCondition, 
  ConditionType, 
  ConditionOperator,
  BranchTargetType,
  BranchingNode 
} from "@/types/branching";

interface BranchingConditionEditorProps {
  node: BranchingNode;
  availableNodes: BranchingNode[];
  onUpdateBranches: (branches: BranchRule[]) => void;
  onUpdateDefaultTarget: (targetId: string) => void;
}

const CONDITION_TYPES: { value: ConditionType; label: string }[] = [
  { value: 'response_value', label: 'Response Value' },
  { value: 'score_threshold', label: 'Score Threshold' },
  { value: 'time_taken', label: 'Time Taken' },
  { value: 'attempts_count', label: 'Attempts Count' },
];

const OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'contains', label: 'Contains' },
  { value: 'in_range', label: 'In Range' },
];

const TARGET_TYPES: { value: BranchTargetType; label: string }[] = [
  { value: 'item', label: 'Go to Item' },
  { value: 'section', label: 'Go to Section' },
  { value: 'end_assessment', label: 'End Assessment' },
  { value: 'remedial_pool', label: 'Remedial Pool' },
];

export const BranchingConditionEditor = ({
  node,
  availableNodes,
  onUpdateBranches,
  onUpdateDefaultTarget,
}: BranchingConditionEditorProps) => {
  const [expandedRules, setExpandedRules] = useState<string[]>([]);

  const toggleRuleExpanded = (ruleId: string) => {
    setExpandedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId) 
        : [...prev, ruleId]
    );
  };

  const addRule = () => {
    const newRule: BranchRule = {
      id: `rule-${Date.now()}`,
      name: `Rule ${node.branches.length + 1}`,
      conditions: [
        {
          id: `cond-${Date.now()}`,
          type: 'response_value',
          operator: 'equals',
          value: 'correct',
        }
      ],
      conditionLogic: 'AND',
      targetType: 'item',
      targetId: '',
      priority: node.branches.length + 1,
    };
    
    onUpdateBranches([...node.branches, newRule]);
    setExpandedRules([...expandedRules, newRule.id]);
  };

  const removeRule = (ruleId: string) => {
    onUpdateBranches(node.branches.filter(r => r.id !== ruleId));
  };

  const updateRule = (ruleId: string, updates: Partial<BranchRule>) => {
    onUpdateBranches(
      node.branches.map(r => r.id === ruleId ? { ...r, ...updates } : r)
    );
  };

  const addCondition = (ruleId: string) => {
    const newCondition: BranchingCondition = {
      id: `cond-${Date.now()}`,
      type: 'response_value',
      operator: 'equals',
      value: '',
    };
    
    onUpdateBranches(
      node.branches.map(r => 
        r.id === ruleId 
          ? { ...r, conditions: [...r.conditions, newCondition] }
          : r
      )
    );
  };

  const removeCondition = (ruleId: string, conditionId: string) => {
    onUpdateBranches(
      node.branches.map(r => 
        r.id === ruleId 
          ? { ...r, conditions: r.conditions.filter(c => c.id !== conditionId) }
          : r
      )
    );
  };

  const updateCondition = (ruleId: string, conditionId: string, updates: Partial<BranchingCondition>) => {
    onUpdateBranches(
      node.branches.map(r => 
        r.id === ruleId 
          ? { 
              ...r, 
              conditions: r.conditions.map(c => 
                c.id === conditionId ? { ...c, ...updates } : c
              )
            }
          : r
      )
    );
  };

  const moveRule = (ruleId: string, direction: 'up' | 'down') => {
    const index = node.branches.findIndex(r => r.id === ruleId);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === node.branches.length - 1)
    ) {
      return;
    }
    
    const newBranches = [...node.branches];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBranches[index], newBranches[swapIndex]] = [newBranches[swapIndex], newBranches[index]];
    newBranches.forEach((rule, i) => rule.priority = i + 1);
    
    onUpdateBranches(newBranches);
  };

  const getTargetOptions = () => {
    return availableNodes.filter(n => n.id !== node.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Branching Rules</Label>
        <Button variant="outline" size="sm" onClick={addRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {node.branches.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No branching rules defined</p>
          <p className="text-xs">Add a rule to create conditional paths</p>
        </div>
      ) : (
        <div className="space-y-3">
          {node.branches.map((rule, index) => (
            <Collapsible
              key={rule.id}
              open={expandedRules.includes(rule.id)}
              onOpenChange={() => toggleRuleExpanded(rule.id)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <CardTitle className="text-sm font-medium">
                          {rule.name}
                        </CardTitle>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {getTargetOptions().find(n => n.id === rule.targetId)?.label || 'Not set'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); moveRule(rule.id, 'up'); }}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); moveRule(rule.id, 'down'); }}
                          disabled={index === node.branches.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => { e.stopPropagation(); removeRule(rule.id); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {expandedRules.includes(rule.id) ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    {/* Rule Name */}
                    <div className="space-y-2">
                      <Label>Rule Name</Label>
                      <Input
                        value={rule.name}
                        onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                        placeholder="Enter rule name"
                      />
                    </div>
                    
                    {/* Conditions */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Conditions</Label>
                        <div className="flex items-center gap-2">
                          <Select
                            value={rule.conditionLogic}
                            onValueChange={(value: 'AND' | 'OR') => updateRule(rule.id, { conditionLogic: value })}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addCondition(rule.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {rule.conditions.map((condition, condIndex) => (
                          <div
                            key={condition.id}
                            className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                          >
                            {condIndex > 0 && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                {rule.conditionLogic}
                              </Badge>
                            )}
                            <Select
                              value={condition.type}
                              onValueChange={(value: ConditionType) => 
                                updateCondition(rule.id, condition.id, { type: value })
                              }
                            >
                              <SelectTrigger className="w-36 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CONDITION_TYPES.map(t => (
                                  <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Select
                              value={condition.operator}
                              onValueChange={(value: ConditionOperator) => 
                                updateCondition(rule.id, condition.id, { operator: value })
                              }
                            >
                              <SelectTrigger className="w-28 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {OPERATORS.map(o => (
                                  <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Input
                              value={String(condition.value)}
                              onChange={(e) => 
                                updateCondition(rule.id, condition.id, { value: e.target.value })
                              }
                              placeholder="Value"
                              className="h-8 flex-1"
                            />
                            
                            {condition.operator === 'in_range' && (
                              <Input
                                value={String(condition.secondaryValue || '')}
                                onChange={(e) => 
                                  updateCondition(rule.id, condition.id, { secondaryValue: e.target.value })
                                }
                                placeholder="To"
                                className="h-8 w-20"
                              />
                            )}
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-destructive"
                              onClick={() => removeCondition(rule.id, condition.id)}
                              disabled={rule.conditions.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Target */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Action</Label>
                        <Select
                          value={rule.targetType}
                          onValueChange={(value: BranchTargetType) => 
                            updateRule(rule.id, { targetType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TARGET_TYPES.map(t => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Target</Label>
                        <Select
                          value={rule.targetId}
                          onValueChange={(value) => updateRule(rule.id, { targetId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target" />
                          </SelectTrigger>
                          <SelectContent>
                            {getTargetOptions().map(n => (
                              <SelectItem key={n.id} value={n.id}>
                                {n.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}

      {/* Default Target */}
      <div className="pt-4 border-t">
        <div className="space-y-2">
          <Label>Default Path (if no rules match)</Label>
          <Select
            value={node.defaultTargetId || ''}
            onValueChange={onUpdateDefaultTarget}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select default target" />
            </SelectTrigger>
            <SelectContent>
              {getTargetOptions().map(n => (
                <SelectItem key={n.id} value={n.id}>
                  {n.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
