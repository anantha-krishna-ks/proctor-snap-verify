import type { 
  BranchingAssessment, 
  BranchingNode, 
  BranchingConnection,
  LearnerPath,
  ItemPool 
} from '@/types/branching';
import type { FormItem } from '@/types/forms';

// Mock item bank with metadata
export const mockItemBank: FormItem[] = [
  { id: 'item-1', title: 'What is 2 + 2?', type: 'mcq', marks: 1, category: 'Arithmetic', difficulty: 'easy' },
  { id: 'item-2', title: 'Solve for x: 2x + 5 = 15', type: 'mcq', marks: 2, category: 'Algebra', difficulty: 'medium' },
  { id: 'item-3', title: 'What is the derivative of x²?', type: 'mcq', marks: 3, category: 'Calculus', difficulty: 'hard' },
  { id: 'item-4', title: 'What is 10 - 7?', type: 'mcq', marks: 1, category: 'Arithmetic', difficulty: 'easy' },
  { id: 'item-5', title: 'Factor x² - 9', type: 'mcq', marks: 2, category: 'Algebra', difficulty: 'medium' },
  { id: 'item-6', title: 'Integrate 2x dx', type: 'mcq', marks: 3, category: 'Calculus', difficulty: 'hard' },
  { id: 'item-7', title: 'What is 5 × 6?', type: 'mcq', marks: 1, category: 'Arithmetic', difficulty: 'easy' },
  { id: 'item-8', title: 'Solve: 3x - 7 = 14', type: 'mcq', marks: 2, category: 'Algebra', difficulty: 'medium' },
  { id: 'item-9', title: 'Find the limit as x→0 of sin(x)/x', type: 'essay', marks: 4, category: 'Calculus', difficulty: 'hard' },
  { id: 'item-10', title: 'What is 15 ÷ 3?', type: 'mcq', marks: 1, category: 'Arithmetic', difficulty: 'easy' },
  { id: 'item-11', title: 'Simplify: (x+2)(x-2)', type: 'fill-blank', marks: 2, category: 'Algebra', difficulty: 'medium' },
  { id: 'item-12', title: 'Is π a rational number?', type: 'true-false', marks: 1, category: 'Number Theory', difficulty: 'easy' },
];

// Mock item pools
export const mockItemPools: ItemPool[] = [
  {
    id: 'pool-easy',
    name: 'Easy Questions Pool',
    items: mockItemBank.filter(i => i.difficulty === 'easy'),
    selectionCriteria: {
      difficulty: 'easy',
      randomize: true,
      maxItems: 3,
    },
  },
  {
    id: 'pool-medium',
    name: 'Medium Questions Pool',
    items: mockItemBank.filter(i => i.difficulty === 'medium'),
    selectionCriteria: {
      difficulty: 'medium',
      randomize: true,
      maxItems: 3,
    },
  },
  {
    id: 'pool-hard',
    name: 'Hard Questions Pool',
    items: mockItemBank.filter(i => i.difficulty === 'hard'),
    selectionCriteria: {
      difficulty: 'hard',
      randomize: true,
      maxItems: 2,
    },
  },
  {
    id: 'pool-remedial',
    name: 'Remedial Questions',
    items: mockItemBank.filter(i => i.difficulty === 'easy' && i.category === 'Arithmetic'),
    selectionCriteria: {
      difficulty: 'easy',
      topic: 'Arithmetic',
      randomize: true,
      maxItems: 2,
    },
  },
];

// Mock branching nodes
export const mockBranchingNodes: BranchingNode[] = [
  {
    id: 'node-start',
    type: 'start',
    label: 'Assessment Start',
    description: 'Begin the adaptive assessment',
    position: { x: 400, y: 50 },
    branches: [],
    defaultTargetId: 'node-1',
  },
  {
    id: 'node-1',
    type: 'item',
    itemId: 'item-2',
    item: mockItemBank.find(i => i.id === 'item-2'),
    label: 'Medium Algebra Question',
    description: 'Initial assessment question',
    position: { x: 400, y: 150 },
    branches: [
      {
        id: 'branch-1-correct',
        name: 'Correct Response',
        conditions: [
          { id: 'cond-1', type: 'response_value', operator: 'equals', value: 'correct' }
        ],
        conditionLogic: 'AND',
        targetType: 'item',
        targetId: 'node-2',
        priority: 1,
      },
      {
        id: 'branch-1-incorrect',
        name: 'Incorrect Response',
        conditions: [
          { id: 'cond-2', type: 'response_value', operator: 'equals', value: 'incorrect' }
        ],
        conditionLogic: 'AND',
        targetType: 'item',
        targetId: 'node-3',
        priority: 2,
      },
    ],
    metadata: {
      difficulty: 'medium',
      topic: 'Algebra',
      skill: 'Equation Solving',
      exposureCount: 45,
      maxExposure: 100,
    },
  },
  {
    id: 'node-2',
    type: 'item',
    itemId: 'item-3',
    item: mockItemBank.find(i => i.id === 'item-3'),
    label: 'Hard Calculus Question',
    description: 'Advanced question for high performers',
    position: { x: 250, y: 280 },
    branches: [
      {
        id: 'branch-2-correct',
        name: 'Mastery Achieved',
        conditions: [
          { id: 'cond-3', type: 'score_threshold', operator: 'greater_than', value: 80 }
        ],
        conditionLogic: 'AND',
        targetType: 'end_assessment',
        targetId: 'node-end-success',
        priority: 1,
      },
    ],
    defaultTargetId: 'node-4',
    metadata: {
      difficulty: 'hard',
      topic: 'Calculus',
      skill: 'Derivatives',
      exposureCount: 23,
      maxExposure: 100,
    },
  },
  {
    id: 'node-3',
    type: 'item',
    itemId: 'item-1',
    item: mockItemBank.find(i => i.id === 'item-1'),
    label: 'Easy Arithmetic (Remedial)',
    description: 'Remedial question for struggling learners',
    position: { x: 550, y: 280 },
    branches: [
      {
        id: 'branch-3-correct',
        name: 'Recovery Path',
        conditions: [
          { id: 'cond-4', type: 'response_value', operator: 'equals', value: 'correct' }
        ],
        conditionLogic: 'AND',
        targetType: 'item',
        targetId: 'node-5',
        priority: 1,
      },
    ],
    defaultTargetId: 'node-pool-remedial',
    metadata: {
      difficulty: 'easy',
      topic: 'Arithmetic',
      skill: 'Basic Operations',
      exposureCount: 67,
      maxExposure: 100,
    },
  },
  {
    id: 'node-4',
    type: 'item',
    itemId: 'item-6',
    item: mockItemBank.find(i => i.id === 'item-6'),
    label: 'Hard Calculus - Integration',
    position: { x: 250, y: 400 },
    branches: [],
    defaultTargetId: 'node-end-success',
    metadata: {
      difficulty: 'hard',
      topic: 'Calculus',
      skill: 'Integration',
      exposureCount: 18,
      maxExposure: 100,
    },
  },
  {
    id: 'node-5',
    type: 'item',
    itemId: 'item-5',
    item: mockItemBank.find(i => i.id === 'item-5'),
    label: 'Medium Algebra - Factoring',
    position: { x: 550, y: 400 },
    branches: [],
    defaultTargetId: 'node-end-standard',
    metadata: {
      difficulty: 'medium',
      topic: 'Algebra',
      skill: 'Factoring',
      exposureCount: 34,
      maxExposure: 100,
    },
  },
  {
    id: 'node-pool-remedial',
    type: 'pool',
    label: 'Remedial Pool',
    description: 'Additional practice questions',
    position: { x: 700, y: 400 },
    branches: [],
    defaultTargetId: 'node-end-needs-improvement',
    metadata: {
      difficulty: 'easy',
    },
  },
  {
    id: 'node-end-success',
    type: 'end',
    label: 'Assessment Complete - Advanced',
    description: 'Congratulations on completing the advanced path!',
    position: { x: 250, y: 520 },
    branches: [],
  },
  {
    id: 'node-end-standard',
    type: 'end',
    label: 'Assessment Complete - Standard',
    description: 'Good job completing the assessment!',
    position: { x: 450, y: 520 },
    branches: [],
  },
  {
    id: 'node-end-needs-improvement',
    type: 'end',
    label: 'Assessment Complete - Review Recommended',
    description: 'Consider reviewing the fundamentals',
    position: { x: 700, y: 520 },
    branches: [],
  },
];

// Mock connections
export const mockBranchingConnections: BranchingConnection[] = [
  { id: 'conn-start', sourceNodeId: 'node-start', targetNodeId: 'node-1', isDefault: true },
  { id: 'conn-1-2', sourceNodeId: 'node-1', targetNodeId: 'node-2', ruleId: 'branch-1-correct', label: 'Correct' },
  { id: 'conn-1-3', sourceNodeId: 'node-1', targetNodeId: 'node-3', ruleId: 'branch-1-incorrect', label: 'Incorrect' },
  { id: 'conn-2-end', sourceNodeId: 'node-2', targetNodeId: 'node-end-success', ruleId: 'branch-2-correct', label: 'Score > 80%' },
  { id: 'conn-2-4', sourceNodeId: 'node-2', targetNodeId: 'node-4', isDefault: true, label: 'Default' },
  { id: 'conn-3-5', sourceNodeId: 'node-3', targetNodeId: 'node-5', ruleId: 'branch-3-correct', label: 'Correct' },
  { id: 'conn-3-pool', sourceNodeId: 'node-3', targetNodeId: 'node-pool-remedial', isDefault: true, label: 'Default' },
  { id: 'conn-4-end', sourceNodeId: 'node-4', targetNodeId: 'node-end-success', isDefault: true },
  { id: 'conn-5-end', sourceNodeId: 'node-5', targetNodeId: 'node-end-standard', isDefault: true },
  { id: 'conn-pool-end', sourceNodeId: 'node-pool-remedial', targetNodeId: 'node-end-needs-improvement', isDefault: true },
];

// Mock branching assessment
export const mockBranchingAssessment: BranchingAssessment = {
  id: 'branch-assess-1',
  name: 'Adaptive Math Assessment',
  description: 'An adaptive assessment that adjusts difficulty based on learner performance',
  repositoryId: 'repo-1',
  nodes: mockBranchingNodes,
  connections: mockBranchingConnections,
  startNodeId: 'node-start',
  endNodeIds: ['node-end-success', 'node-end-standard', 'node-end-needs-improvement'],
  settings: {
    maxItems: 10,
    minItems: 3,
    timeLimit: 30,
    allowBacktrack: false,
    showProgress: true,
    exposureControl: true,
    balanceExposure: true,
  },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-03-01T14:30:00Z',
  status: 'published',
  version: 3,
};

// Mock learner paths for analytics
export const mockLearnerPaths: LearnerPath[] = [
  {
    id: 'path-1',
    assessmentId: 'branch-assess-1',
    learnerId: 'learner-1',
    learnerName: 'Alice Johnson',
    steps: [
      { nodeId: 'node-start', timeSpent: 0, timestamp: '2024-03-01T09:00:00Z' },
      { nodeId: 'node-1', itemId: 'item-2', response: 'correct', score: 2, timeSpent: 45, timestamp: '2024-03-01T09:00:45Z', branchRuleApplied: 'branch-1-correct' },
      { nodeId: 'node-2', itemId: 'item-3', response: 'correct', score: 3, timeSpent: 90, timestamp: '2024-03-01T09:02:15Z', branchRuleApplied: 'branch-2-correct' },
      { nodeId: 'node-end-success', timeSpent: 0, timestamp: '2024-03-01T09:02:15Z' },
    ],
    totalScore: 5,
    maxScore: 5,
    startTime: '2024-03-01T09:00:00Z',
    endTime: '2024-03-01T09:02:15Z',
    status: 'completed',
  },
  {
    id: 'path-2',
    assessmentId: 'branch-assess-1',
    learnerId: 'learner-2',
    learnerName: 'Bob Smith',
    steps: [
      { nodeId: 'node-start', timeSpent: 0, timestamp: '2024-03-01T10:00:00Z' },
      { nodeId: 'node-1', itemId: 'item-2', response: 'incorrect', score: 0, timeSpent: 60, timestamp: '2024-03-01T10:01:00Z', branchRuleApplied: 'branch-1-incorrect' },
      { nodeId: 'node-3', itemId: 'item-1', response: 'correct', score: 1, timeSpent: 20, timestamp: '2024-03-01T10:01:20Z', branchRuleApplied: 'branch-3-correct' },
      { nodeId: 'node-5', itemId: 'item-5', response: 'correct', score: 2, timeSpent: 55, timestamp: '2024-03-01T10:02:15Z' },
      { nodeId: 'node-end-standard', timeSpent: 0, timestamp: '2024-03-01T10:02:15Z' },
    ],
    totalScore: 3,
    maxScore: 5,
    startTime: '2024-03-01T10:00:00Z',
    endTime: '2024-03-01T10:02:15Z',
    status: 'completed',
  },
  {
    id: 'path-3',
    assessmentId: 'branch-assess-1',
    learnerId: 'learner-3',
    learnerName: 'Carol Davis',
    steps: [
      { nodeId: 'node-start', timeSpent: 0, timestamp: '2024-03-01T11:00:00Z' },
      { nodeId: 'node-1', itemId: 'item-2', response: 'incorrect', score: 0, timeSpent: 30, timestamp: '2024-03-01T11:00:30Z', branchRuleApplied: 'branch-1-incorrect' },
      { nodeId: 'node-3', itemId: 'item-1', response: 'incorrect', score: 0, timeSpent: 25, timestamp: '2024-03-01T11:00:55Z' },
      { nodeId: 'node-pool-remedial', timeSpent: 120, timestamp: '2024-03-01T11:02:55Z' },
      { nodeId: 'node-end-needs-improvement', timeSpent: 0, timestamp: '2024-03-01T11:02:55Z' },
    ],
    totalScore: 0,
    maxScore: 3,
    startTime: '2024-03-01T11:00:00Z',
    endTime: '2024-03-01T11:02:55Z',
    status: 'completed',
  },
];

// List of all branching assessments
export const mockBranchingAssessments: BranchingAssessment[] = [
  mockBranchingAssessment,
  {
    id: 'branch-assess-2',
    name: 'Language Proficiency Test',
    description: 'Adaptive language assessment for placement',
    repositoryId: 'repo-1',
    nodes: [],
    connections: [],
    startNodeId: '',
    endNodeIds: [],
    settings: {
      maxItems: 15,
      minItems: 5,
      timeLimit: 45,
      allowBacktrack: false,
      showProgress: true,
      exposureControl: true,
      balanceExposure: true,
    },
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z',
    status: 'draft',
    version: 1,
  },
];
