import type { FormItem } from './forms';

// Branching condition operators
export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'greater_than' 
  | 'less_than' 
  | 'contains' 
  | 'in_range';

// Condition types
export type ConditionType = 
  | 'response_value' 
  | 'score_threshold' 
  | 'time_taken' 
  | 'attempts_count';

// Target types for branching
export type BranchTargetType = 
  | 'item' 
  | 'section' 
  | 'end_assessment' 
  | 'remedial_pool';

// Single branching condition
export interface BranchingCondition {
  id: string;
  type: ConditionType;
  operator: ConditionOperator;
  value: string | number | boolean;
  secondaryValue?: string | number; // For range comparisons
}

// Branch rule that combines conditions with target
export interface BranchRule {
  id: string;
  name: string;
  conditions: BranchingCondition[];
  conditionLogic: 'AND' | 'OR';
  targetType: BranchTargetType;
  targetId: string;
  priority: number;
}

// Branching node in the assessment flow
export interface BranchingNode {
  id: string;
  type: 'item' | 'decision' | 'start' | 'end' | 'pool';
  itemId?: string;
  item?: FormItem;
  label: string;
  description?: string;
  position: { x: number; y: number };
  branches: BranchRule[];
  defaultTargetId?: string; // Fallback if no conditions match
  metadata?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    topic?: string;
    skill?: string;
    exposureCount?: number;
    maxExposure?: number;
  };
}

// Connection between nodes
export interface BranchingConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  ruleId?: string;
  label?: string;
  isDefault?: boolean;
}

// Complete branching assessment flow
export interface BranchingAssessment {
  id: string;
  name: string;
  description?: string;
  repositoryId: string;
  nodes: BranchingNode[];
  connections: BranchingConnection[];
  startNodeId: string;
  endNodeIds: string[];
  settings: {
    maxItems: number;
    minItems: number;
    timeLimit?: number;
    allowBacktrack: boolean;
    showProgress: boolean;
    exposureControl: boolean;
    balanceExposure: boolean;
  };
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
}

// Learner path tracking
export interface LearnerPathStep {
  nodeId: string;
  itemId?: string;
  response?: string;
  score?: number;
  timeSpent: number;
  timestamp: string;
  branchRuleApplied?: string;
}

export interface LearnerPath {
  id: string;
  assessmentId: string;
  learnerId: string;
  learnerName: string;
  steps: LearnerPathStep[];
  totalScore: number;
  maxScore: number;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
}

// Item pool for dynamic selection
export interface ItemPool {
  id: string;
  name: string;
  items: FormItem[];
  selectionCriteria: {
    difficulty?: 'easy' | 'medium' | 'hard';
    topic?: string;
    skill?: string;
    randomize: boolean;
    maxItems: number;
  };
}

// Export configuration for backend
export interface BranchingExportConfig {
  assessment: BranchingAssessment;
  itemBank: FormItem[];
  pools: ItemPool[];
  exportedAt: string;
  version: string;
}
