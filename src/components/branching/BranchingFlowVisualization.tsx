import { useState, useCallback, useMemo } from "react";
import { 
  Play, 
  Square, 
  Circle, 
  Diamond,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Layers,
  Zap,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import type { BranchingNode, BranchingConnection, BranchingAssessment } from "@/types/branching";

interface BranchingFlowVisualizationProps {
  assessment: BranchingAssessment;
  selectedNodeId?: string;
  onNodeSelect?: (nodeId: string) => void;
  onNodeDoubleClick?: (nodeId: string) => void;
  simulationMode?: boolean;
  simulationPath?: string[];
  collapsedNodes?: string[];
  onToggleCollapse?: (nodeId: string) => void;
}

const NODE_HEIGHT = 80;
const NODE_WIDTH = 200;
const LEVEL_HEIGHT = 120;

const getNodeIcon = (type: BranchingNode['type']) => {
  switch (type) {
    case 'start':
      return <Play className="h-4 w-4" />;
    case 'end':
      return <Square className="h-4 w-4" />;
    case 'decision':
      return <Diamond className="h-4 w-4" />;
    case 'pool':
      return <Layers className="h-4 w-4" />;
    default:
      return <Circle className="h-4 w-4" />;
  }
};

const getNodeColors = (type: BranchingNode['type'], isSelected: boolean, isInPath: boolean) => {
  const baseColors = {
    start: 'bg-green-500/10 border-green-500 text-green-700',
    end: 'bg-blue-500/10 border-blue-500 text-blue-700',
    decision: 'bg-amber-500/10 border-amber-500 text-amber-700',
    pool: 'bg-purple-500/10 border-purple-500 text-purple-700',
    item: 'bg-card border-border text-foreground',
  };
  
  if (isInPath) {
    return 'bg-primary/10 border-primary text-primary ring-2 ring-primary/30';
  }
  
  if (isSelected) {
    return cn(baseColors[type], 'ring-2 ring-primary/50');
  }
  
  return baseColors[type];
};

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/10 text-green-600';
    case 'medium':
      return 'bg-amber-500/10 text-amber-600';
    case 'hard':
      return 'bg-red-500/10 text-red-600';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const BranchingFlowVisualization = ({
  assessment,
  selectedNodeId,
  onNodeSelect,
  onNodeDoubleClick,
  simulationMode = false,
  simulationPath = [],
  collapsedNodes = [],
  onToggleCollapse,
}: BranchingFlowVisualizationProps) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Build node levels for hierarchical layout
  const nodeLevels = useMemo(() => {
    const levels: Map<string, number> = new Map();
    const visited = new Set<string>();
    
    const assignLevel = (nodeId: string, level: number) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const currentLevel = levels.get(nodeId) ?? -1;
      levels.set(nodeId, Math.max(currentLevel, level));
      
      // Find outgoing connections
      const outgoing = assessment.connections.filter(c => c.sourceNodeId === nodeId);
      outgoing.forEach(conn => {
        assignLevel(conn.targetNodeId, level + 1);
      });
    };
    
    assignLevel(assessment.startNodeId, 0);
    
    return levels;
  }, [assessment]);

  // Group nodes by level
  const nodesByLevel = useMemo(() => {
    const groups: Map<number, BranchingNode[]> = new Map();
    
    assessment.nodes.forEach(node => {
      const level = nodeLevels.get(node.id) ?? 0;
      const existing = groups.get(level) || [];
      groups.set(level, [...existing, node]);
    });
    
    return groups;
  }, [assessment.nodes, nodeLevels]);

  // Calculate node positions
  const nodePositions = useMemo(() => {
    const positions: Map<string, { x: number; y: number }> = new Map();
    const maxLevel = Math.max(...Array.from(nodeLevels.values()));
    
    for (let level = 0; level <= maxLevel; level++) {
      const nodesAtLevel = nodesByLevel.get(level) || [];
      const totalWidth = nodesAtLevel.length * (NODE_WIDTH + 40);
      const startX = (800 - totalWidth) / 2 + NODE_WIDTH / 2;
      
      nodesAtLevel.forEach((node, index) => {
        positions.set(node.id, {
          x: startX + index * (NODE_WIDTH + 40),
          y: 60 + level * LEVEL_HEIGHT,
        });
      });
    }
    
    return positions;
  }, [nodeLevels, nodesByLevel]);

  const renderConnection = (connection: BranchingConnection) => {
    const sourcePos = nodePositions.get(connection.sourceNodeId);
    const targetPos = nodePositions.get(connection.targetNodeId);
    
    if (!sourcePos || !targetPos) return null;
    
    const isInPath = simulationPath.includes(connection.sourceNodeId) && 
                     simulationPath.includes(connection.targetNodeId) &&
                     simulationPath.indexOf(connection.targetNodeId) === simulationPath.indexOf(connection.sourceNodeId) + 1;
    
    const startX = sourcePos.x;
    const startY = sourcePos.y + NODE_HEIGHT / 2;
    const endX = targetPos.x;
    const endY = targetPos.y - NODE_HEIGHT / 2;
    
    // Calculate control points for curved path
    const midY = (startY + endY) / 2;
    const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
    
    return (
      <g key={connection.id}>
        <path
          d={path}
          fill="none"
          stroke={isInPath ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
          strokeWidth={isInPath ? 3 : 2}
          strokeDasharray={connection.isDefault ? '5,5' : undefined}
          className="transition-all duration-300"
        />
        {connection.label && (
          <text
            x={(startX + endX) / 2}
            y={midY - 5}
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            {connection.label}
          </text>
        )}
        {/* Arrow head */}
        <polygon
          points={`${endX},${endY} ${endX - 5},${endY - 10} ${endX + 5},${endY - 10}`}
          fill={isInPath ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
        />
      </g>
    );
  };

  const renderNode = (node: BranchingNode) => {
    const position = nodePositions.get(node.id);
    if (!position) return null;
    
    const isSelected = selectedNodeId === node.id;
    const isHovered = hoveredNodeId === node.id;
    const isInPath = simulationPath.includes(node.id);
    const isCollapsed = collapsedNodes.includes(node.id);
    const hasChildren = assessment.connections.some(c => c.sourceNodeId === node.id);
    
    return (
      <g
        key={node.id}
        transform={`translate(${position.x - NODE_WIDTH / 2}, ${position.y - NODE_HEIGHT / 2})`}
        className="cursor-pointer"
        onClick={() => onNodeSelect?.(node.id)}
        onDoubleClick={() => onNodeDoubleClick?.(node.id)}
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        <foreignObject width={NODE_WIDTH} height={NODE_HEIGHT}>
          <div
            className={cn(
              "h-full w-full rounded-lg border-2 p-3 transition-all duration-200",
              getNodeColors(node.type, isSelected, isInPath),
              isHovered && "shadow-lg scale-105",
              simulationMode && !isInPath && "opacity-50"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {getNodeIcon(node.type)}
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {node.label}
                </span>
              </div>
              {hasChildren && onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCollapse(node.id);
                  }}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
            
            {node.type === 'item' && node.metadata && (
              <div className="mt-2 flex items-center gap-1.5">
                <Badge variant="secondary" className={cn("text-[10px] px-1.5", getDifficultyColor(node.metadata.difficulty))}>
                  {node.metadata.difficulty}
                </Badge>
                {node.metadata.exposureCount !== undefined && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <Progress 
                            value={(node.metadata.exposureCount / (node.metadata.maxExposure || 100)) * 100} 
                            className="h-1.5 w-10"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Exposure: {node.metadata.exposureCount}/{node.metadata.maxExposure}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
            
            {node.branches.length > 0 && (
              <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Zap className="h-3 w-3" />
                {node.branches.length} rule{node.branches.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  const svgHeight = Math.max(...Array.from(nodeLevels.values())) * LEVEL_HEIGHT + 160;

  return (
    <div className="relative w-full overflow-auto bg-muted/30 rounded-lg border">
      <svg width="100%" height={svgHeight} className="min-w-[800px]">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--border))" />
          </marker>
        </defs>
        
        {/* Render connections first (behind nodes) */}
        <g className="connections">
          {assessment.connections.map(renderConnection)}
        </g>
        
        {/* Render nodes */}
        <g className="nodes">
          {assessment.nodes.map(renderNode)}
        </g>
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-card/90 backdrop-blur-sm rounded-lg border p-3 text-xs">
        <div className="flex items-center gap-1.5">
          <Play className="h-3 w-3 text-green-600" />
          <span>Start</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Circle className="h-3 w-3" />
          <span>Item</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="h-3 w-3 text-purple-600" />
          <span>Pool</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Square className="h-3 w-3 text-blue-600" />
          <span>End</span>
        </div>
        <div className="flex items-center gap-1.5 border-l pl-4">
          <div className="w-6 h-0.5 bg-border" />
          <span>Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-border border-dashed border" style={{ borderStyle: 'dashed' }} />
          <span>Conditional</span>
        </div>
      </div>
    </div>
  );
};
