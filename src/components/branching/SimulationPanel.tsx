import { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BranchingAssessment, BranchingNode, LearnerPath } from "@/types/branching";

interface SimulationPanelProps {
  assessment: BranchingAssessment;
  learnerPaths: LearnerPath[];
  isSimulating: boolean;
  currentPath: string[];
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSelectPath: (path: LearnerPath) => void;
  currentNodeId?: string;
  onSimulateResponse: (response: 'correct' | 'incorrect') => void;
}

export const SimulationPanel = ({
  assessment,
  learnerPaths,
  isSimulating,
  currentPath,
  onStartSimulation,
  onPauseSimulation,
  onStepForward,
  onReset,
  onSelectPath,
  currentNodeId,
  onSimulateResponse,
}: SimulationPanelProps) => {
  const [selectedPathId, setSelectedPathId] = useState<string>("");
  
  const currentNode = assessment.nodes.find(n => n.id === currentNodeId);
  const progress = (currentPath.length / assessment.settings.maxItems) * 100;
  
  const handlePathSelect = (pathId: string) => {
    setSelectedPathId(pathId);
    const path = learnerPaths.find(p => p.id === pathId);
    if (path) {
      onSelectPath(path);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-l">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <Play className="h-4 w-4" />
          Simulation Mode
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Test learner paths through the assessment
        </p>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-2">
          {!isSimulating ? (
            <Button onClick={onStartSimulation} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={onPauseSimulation} variant="secondary" className="flex-1">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={onStepForward}
            disabled={!currentNode || currentNode.type === 'end'}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span>{currentPath.length} / {assessment.settings.maxItems} items</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Current Node */}
        {currentNode && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Current Position</CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentNode.type}</Badge>
                <span className="text-sm font-medium truncate">
                  {currentNode.label}
                </span>
              </div>
              
              {currentNode.type === 'item' && isSimulating && (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => onSimulateResponse('correct')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Correct
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onSimulateResponse('incorrect')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Incorrect
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Path Visualization */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Current Path</h4>
          <ScrollArea className="h-32">
            <div className="space-y-1">
              {currentPath.map((nodeId, index) => {
                const node = assessment.nodes.find(n => n.id === nodeId);
                const isActive = nodeId === currentNodeId;
                
                return (
                  <div
                    key={`${nodeId}-${index}`}
                    className={cn(
                      "flex items-center gap-2 text-sm p-1.5 rounded",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <span className="text-xs text-muted-foreground w-4">
                      {index + 1}.
                    </span>
                    <span className={cn("truncate", isActive && "font-medium")}>
                      {node?.label || nodeId}
                    </span>
                    {index < currentPath.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    )}
                  </div>
                );
              })}
              
              {currentPath.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Start simulation to see path
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      {/* Historical Paths */}
      <div className="flex-1 border-t">
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Learner Path Logs
          </h4>
          
          <Select value={selectedPathId} onValueChange={handlePathSelect}>
            <SelectTrigger className="mb-3">
              <SelectValue placeholder="Select a learner path" />
            </SelectTrigger>
            <SelectContent>
              {learnerPaths.map(path => (
                <SelectItem key={path.id} value={path.id}>
                  <div className="flex items-center gap-2">
                    <span>{path.learnerName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {path.totalScore}/{path.maxScore}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedPathId && (
            <ScrollArea className="h-48">
              {(() => {
                const path = learnerPaths.find(p => p.id === selectedPathId);
                if (!path) return null;
                
                return (
                  <div className="space-y-2">
                    {path.steps.map((step, index) => {
                      const node = assessment.nodes.find(n => n.id === step.nodeId);
                      
                      return (
                        <div
                          key={`${step.nodeId}-${index}`}
                          className="p-2 rounded border bg-muted/30 text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">
                              {node?.label || step.nodeId}
                            </span>
                            {step.score !== undefined && (
                              <Badge 
                                variant={step.score > 0 ? "default" : "secondary"}
                                className="text-xs"
                              >
                                +{step.score}
                              </Badge>
                            )}
                          </div>
                          
                          {step.response && (
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              {step.response === 'correct' ? (
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-600" />
                              )}
                              <span className="capitalize">{step.response}</span>
                              <Clock className="h-3 w-3 ml-2" />
                              <span>{step.timeSpent}s</span>
                            </div>
                          )}
                          
                          {step.branchRuleApplied && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Rule: {step.branchRuleApplied}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};
