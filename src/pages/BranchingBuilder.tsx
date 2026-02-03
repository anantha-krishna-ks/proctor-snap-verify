import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Download,
  Settings,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Play,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize2,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { BranchingFlowVisualization } from "@/components/branching/BranchingFlowVisualization";
import { BranchingConditionEditor } from "@/components/branching/BranchingConditionEditor";
import { ItemBankSidebar } from "@/components/branching/ItemBankSidebar";
import { SimulationPanel } from "@/components/branching/SimulationPanel";

import {
  mockBranchingAssessment,
  mockItemBank,
  mockLearnerPaths,
} from "@/data/branchingMockData";
import type { 
  BranchingAssessment, 
  BranchingNode, 
  BranchRule,
  LearnerPath,
  BranchingExportConfig 
} from "@/types/branching";
import type { FormItem } from "@/types/forms";

const BranchingBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Assessment state
  const [assessment, setAssessment] = useState<BranchingAssessment>(mockBranchingAssessment);
  const [assessmentName, setAssessmentName] = useState(assessment.name);
  
  // UI state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showItemBank, setShowItemBank] = useState(true);
  const [showSimulation, setShowSimulation] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("flow");
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [collapsedNodes, setCollapsedNodes] = useState<string[]>([]);
  
  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPath, setSimulationPath] = useState<string[]>([]);
  const [currentSimulationNode, setCurrentSimulationNode] = useState<string | undefined>();
  
  // Undo/Redo state (simplified)
  const [history, setHistory] = useState<BranchingAssessment[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const selectedNode = assessment.nodes.find(n => n.id === selectedNodeId);
  const usedItemIds = assessment.nodes
    .filter(n => n.itemId)
    .map(n => n.itemId as string);

  // Save current state to history
  const saveToHistory = useCallback((newAssessment: BranchingAssessment) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAssessment);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Handle node selection
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  // Handle node double-click (edit)
  const handleNodeDoubleClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setActiveTab("rules");
  };

  // Toggle node collapse
  const handleToggleCollapse = (nodeId: string) => {
    setCollapsedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  // Add item from bank to flow
  const handleAddItem = (item: FormItem) => {
    const newNode: BranchingNode = {
      id: `node-${Date.now()}`,
      type: 'item',
      itemId: item.id,
      item,
      label: item.title.substring(0, 30) + (item.title.length > 30 ? '...' : ''),
      position: { x: 400, y: 100 + assessment.nodes.length * 120 },
      branches: [],
      metadata: {
        difficulty: item.difficulty,
        topic: item.category,
        exposureCount: 0,
        maxExposure: 100,
      },
    };
    
    const newAssessment = {
      ...assessment,
      nodes: [...assessment.nodes, newNode],
    };
    
    setAssessment(newAssessment);
    saveToHistory(newAssessment);
    setSelectedNodeId(newNode.id);
    toast.success(`Added "${item.title}" to flow`);
  };

  // Update node branches
  const handleUpdateBranches = (nodeId: string, branches: BranchRule[]) => {
    const newAssessment = {
      ...assessment,
      nodes: assessment.nodes.map(n => 
        n.id === nodeId ? { ...n, branches } : n
      ),
    };
    setAssessment(newAssessment);
  };

  // Update node default target
  const handleUpdateDefaultTarget = (nodeId: string, targetId: string) => {
    const newAssessment = {
      ...assessment,
      nodes: assessment.nodes.map(n => 
        n.id === nodeId ? { ...n, defaultTargetId: targetId } : n
      ),
    };
    setAssessment(newAssessment);
  };

  // Delete selected node
  const handleDeleteNode = () => {
    if (!selectedNodeId) return;
    
    const node = assessment.nodes.find(n => n.id === selectedNodeId);
    if (node?.type === 'start') {
      toast.error("Cannot delete start node");
      return;
    }
    
    const newAssessment = {
      ...assessment,
      nodes: assessment.nodes.filter(n => n.id !== selectedNodeId),
      connections: assessment.connections.filter(
        c => c.sourceNodeId !== selectedNodeId && c.targetNodeId !== selectedNodeId
      ),
    };
    
    setAssessment(newAssessment);
    saveToHistory(newAssessment);
    setSelectedNodeId(null);
    toast.success("Node deleted");
  };

  // Simulation controls
  const handleStartSimulation = () => {
    setIsSimulating(true);
    setSimulationPath([assessment.startNodeId]);
    setCurrentSimulationNode(assessment.startNodeId);
    setShowSimulation(true);
  };

  const handlePauseSimulation = () => {
    setIsSimulating(false);
  };

  const handleStepForward = () => {
    if (!currentSimulationNode) return;
    
    const currentNode = assessment.nodes.find(n => n.id === currentSimulationNode);
    if (!currentNode || currentNode.type === 'end') return;
    
    // Find next node (use default target for now)
    const nextNodeId = currentNode.defaultTargetId;
    if (nextNodeId) {
      setSimulationPath(prev => [...prev, nextNodeId]);
      setCurrentSimulationNode(nextNodeId);
    }
  };

  const handleSimulateResponse = (response: 'correct' | 'incorrect') => {
    if (!currentSimulationNode) return;
    
    const currentNode = assessment.nodes.find(n => n.id === currentSimulationNode);
    if (!currentNode) return;
    
    // Find matching rule
    const matchingRule = currentNode.branches.find(rule => 
      rule.conditions.some(cond => 
        cond.type === 'response_value' && cond.value === response
      )
    );
    
    const nextNodeId = matchingRule?.targetId || currentNode.defaultTargetId;
    
    if (nextNodeId) {
      setSimulationPath(prev => [...prev, nextNodeId]);
      setCurrentSimulationNode(nextNodeId);
    } else {
      toast.info("No path defined for this response");
    }
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationPath([]);
    setCurrentSimulationNode(undefined);
  };

  const handleSelectPath = (path: LearnerPath) => {
    setSimulationPath(path.steps.map(s => s.nodeId));
    setCurrentSimulationNode(path.steps[path.steps.length - 1]?.nodeId);
  };

  // Export assessment as JSON
  const handleExport = () => {
    const exportConfig: BranchingExportConfig = {
      assessment,
      itemBank: mockItemBank.filter(item => usedItemIds.includes(item.id)),
      pools: [],
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    
    const blob = new Blob([JSON.stringify(exportConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assessment.name.toLowerCase().replace(/\s+/g, '-')}-branching-rules.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportDialog(false);
    toast.success("Branching rules exported successfully");
  };

  // Save assessment
  const handleSave = () => {
    const updatedAssessment = {
      ...assessment,
      name: assessmentName,
      updatedAt: new Date().toISOString(),
    };
    setAssessment(updatedAssessment);
    toast.success("Assessment saved");
  };

  // Undo/Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (canUndo) {
      setHistoryIndex(prev => prev - 1);
      setAssessment(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      setHistoryIndex(prev => prev + 1);
      setAssessment(history[historyIndex + 1]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/forms")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <Input
                value={assessmentName}
                onChange={(e) => setAssessmentName(e.target.value)}
                className="h-8 text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0"
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{assessment.status}</Badge>
                <span>•</span>
                <span>v{assessment.version}</span>
                <span>•</span>
                <span>{assessment.nodes.length} nodes</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleUndo} disabled={!canUndo}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRedo} disabled={!canRedo}>
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowItemBank(!showItemBank)}
            >
              <PanelLeftClose className={cn("h-4 w-4 mr-2", !showItemBank && "rotate-180")} />
              Items
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSimulation(!showSimulation)}
            >
              <PanelRightClose className={cn("h-4 w-4 mr-2", !showSimulation && "rotate-180")} />
              Simulate
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm" onClick={() => setShowSettingsSheet(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Item Bank Sidebar */}
        {showItemBank && (
          <div className="w-72 shrink-0">
            <ItemBankSidebar
              items={mockItemBank}
              usedItemIds={usedItemIds}
              onAddItem={handleAddItem}
            />
          </div>
        )}

        {/* Flow Canvas & Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList className="h-10">
                <TabsTrigger value="flow">Flow Diagram</TabsTrigger>
                <TabsTrigger value="rules" disabled={!selectedNode}>
                  Branching Rules
                </TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="flow" className="flex-1 m-0 p-4 overflow-auto">
              <div className="h-full">
                <BranchingFlowVisualization
                  assessment={assessment}
                  selectedNodeId={selectedNodeId || undefined}
                  onNodeSelect={handleNodeSelect}
                  onNodeDoubleClick={handleNodeDoubleClick}
                  simulationMode={isSimulating}
                  simulationPath={simulationPath}
                  collapsedNodes={collapsedNodes}
                  onToggleCollapse={handleToggleCollapse}
                />
              </div>
              
              {/* Floating toolbar */}
              {selectedNodeId && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border rounded-lg shadow-lg p-2 flex items-center gap-2">
                  <span className="text-sm px-2 text-muted-foreground">
                    {selectedNode?.label}
                  </span>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("rules")}
                  >
                    Edit Rules
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={handleDeleteNode}
                    disabled={selectedNode?.type === 'start'}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rules" className="flex-1 m-0 p-4 overflow-auto">
              {selectedNode ? (
                <div className="max-w-3xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="secondary">{selectedNode.type}</Badge>
                        {selectedNode.label}
                      </CardTitle>
                      <CardDescription>
                        Configure branching conditions for this node
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BranchingConditionEditor
                        node={selectedNode}
                        availableNodes={assessment.nodes}
                        onUpdateBranches={(branches) => handleUpdateBranches(selectedNode.id, branches)}
                        onUpdateDefaultTarget={(targetId) => handleUpdateDefaultTarget(selectedNode.id, targetId)}
                      />
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Select a node to edit its branching rules</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analytics" className="flex-1 m-0 p-4 overflow-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Path Analytics</CardTitle>
                    <CardDescription>
                      View learner path statistics and exposure data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-3xl font-bold">{mockLearnerPaths.length}</p>
                        <p className="text-sm text-muted-foreground">Total Attempts</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-3xl font-bold">
                          {Math.round(mockLearnerPaths.reduce((sum, p) => sum + (p.totalScore / p.maxScore) * 100, 0) / mockLearnerPaths.length)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Avg Score</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-3xl font-bold">
                          {Math.round(mockLearnerPaths.reduce((sum, p) => sum + p.steps.length, 0) / mockLearnerPaths.length)}
                        </p>
                        <p className="text-sm text-muted-foreground">Avg Items Served</p>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h4 className="font-medium mb-4">Exposure Control</h4>
                    <div className="space-y-3">
                      {assessment.nodes
                        .filter(n => n.type === 'item' && n.metadata?.exposureCount !== undefined)
                        .map(node => (
                          <div key={node.id} className="flex items-center gap-4">
                            <span className="text-sm flex-1 truncate">{node.label}</span>
                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{
                                  width: `${(node.metadata!.exposureCount! / node.metadata!.maxExposure!) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-16 text-right">
                              {node.metadata!.exposureCount}/{node.metadata!.maxExposure}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Simulation Panel */}
        {showSimulation && (
          <div className="w-80 shrink-0">
            <SimulationPanel
              assessment={assessment}
              learnerPaths={mockLearnerPaths}
              isSimulating={isSimulating}
              currentPath={simulationPath}
              onStartSimulation={handleStartSimulation}
              onPauseSimulation={handlePauseSimulation}
              onStepForward={handleStepForward}
              onReset={handleResetSimulation}
              onSelectPath={handleSelectPath}
              currentNodeId={currentSimulationNode}
              onSimulateResponse={handleSimulateResponse}
            />
          </div>
        )}
      </div>

      {/* Settings Sheet */}
      <Sheet open={showSettingsSheet} onOpenChange={setShowSettingsSheet}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Assessment Settings</SheetTitle>
            <SheetDescription>
              Configure assessment behavior and constraints
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Item Limits</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Items</Label>
                  <Input
                    type="number"
                    value={assessment.settings.minItems}
                    onChange={(e) => setAssessment({
                      ...assessment,
                      settings: { ...assessment.settings, minItems: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Items</Label>
                  <Input
                    type="number"
                    value={assessment.settings.maxItems}
                    onChange={(e) => setAssessment({
                      ...assessment,
                      settings: { ...assessment.settings, maxItems: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Time Limit (minutes)</Label>
                <Input
                  type="number"
                  value={assessment.settings.timeLimit || ''}
                  onChange={(e) => setAssessment({
                    ...assessment,
                    settings: { ...assessment.settings, timeLimit: parseInt(e.target.value) || undefined }
                  })}
                  placeholder="No limit"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Behavior</h4>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Backtracking</Label>
                  <p className="text-xs text-muted-foreground">Let learners go back to previous items</p>
                </div>
                <Switch
                  checked={assessment.settings.allowBacktrack}
                  onCheckedChange={(checked) => setAssessment({
                    ...assessment,
                    settings: { ...assessment.settings, allowBacktrack: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Progress</Label>
                  <p className="text-xs text-muted-foreground">Display progress indicator to learners</p>
                </div>
                <Switch
                  checked={assessment.settings.showProgress}
                  onCheckedChange={(checked) => setAssessment({
                    ...assessment,
                    settings: { ...assessment.settings, showProgress: checked }
                  })}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Exposure Control</h4>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Exposure Control</Label>
                  <p className="text-xs text-muted-foreground">Track and limit item exposure</p>
                </div>
                <Switch
                  checked={assessment.settings.exposureControl}
                  onCheckedChange={(checked) => setAssessment({
                    ...assessment,
                    settings: { ...assessment.settings, exposureControl: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Balance Exposure</Label>
                  <p className="text-xs text-muted-foreground">Prefer less-exposed items in pools</p>
                </div>
                <Switch
                  checked={assessment.settings.balanceExposure}
                  onCheckedChange={(checked) => setAssessment({
                    ...assessment,
                    settings: { ...assessment.settings, balanceExposure: checked }
                  })}
                  disabled={!assessment.settings.exposureControl}
                />
              </div>
            </div>
          </div>
          
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowSettingsSheet(false)}>
              Cancel
            </Button>
            <Button onClick={() => { handleSave(); setShowSettingsSheet(false); }}>
              Save Settings
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Branching Rules</DialogTitle>
            <DialogDescription>
              Download the assessment configuration as a JSON file for backend integration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
              <p><strong>Assessment:</strong> {assessment.name}</p>
              <p><strong>Nodes:</strong> {assessment.nodes.length}</p>
              <p><strong>Connections:</strong> {assessment.connections.length}</p>
              <p><strong>Items Used:</strong> {usedItemIds.length}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BranchingBuilder;
