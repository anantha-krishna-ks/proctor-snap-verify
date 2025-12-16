import { Project } from "./projectMockData";

export interface MarkerAssignment {
  projectId: string;
  scheduleId: string;
  scheduleName: string;
  assessmentName: string;
  candidateCount: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  deadline: string;
}

export interface AssignedProject extends Project {
  totalCandidates: number;
  completedEvaluations: number;
  pendingEvaluations: number;
}

// Projects assigned to the marker
export const mockMarkerProjects: AssignedProject[] = [
  {
    id: "4",
    code: "SM0001",
    name: "STOCK MARKET",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
    itemCount: 10,
    testCount: 1,
    scheduleCount: 2,
    status: "active",
    progress: 53,
    lastActivity: "2 hours ago",
    totalCandidates: 15,
    completedEvaluations: 8,
    pendingEvaluations: 7,
  },
  {
    id: "5",
    code: "FPBI",
    name: "Financial Planning, Banking & Insurance",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
    itemCount: 25,
    testCount: 3,
    scheduleCount: 5,
    status: "active",
    progress: 80,
    lastActivity: "30 mins ago",
    totalCandidates: 25,
    completedEvaluations: 20,
    pendingEvaluations: 5,
  },
];

// Schedules within projects assigned to the marker
export const mockMarkerSchedules: MarkerAssignment[] = [
  {
    projectId: "4",
    scheduleId: "s1",
    scheduleName: "Q1 2024 Assessment - Batch A",
    assessmentName: "Stock Market Fundamentals",
    candidateCount: 10,
    completedCount: 5,
    inProgressCount: 3,
    notStartedCount: 2,
    deadline: "2024-12-15",
  },
  {
    projectId: "4",
    scheduleId: "s2",
    scheduleName: "Q1 2024 Assessment - Batch B",
    assessmentName: "Advanced Trading Strategies",
    candidateCount: 5,
    completedCount: 3,
    inProgressCount: 1,
    notStartedCount: 1,
    deadline: "2024-12-20",
  },
  {
    projectId: "5",
    scheduleId: "s3",
    scheduleName: "Banking Certification - Wave 1",
    assessmentName: "Banking Fundamentals Test",
    candidateCount: 15,
    completedCount: 12,
    inProgressCount: 2,
    notStartedCount: 1,
    deadline: "2024-12-10",
  },
  {
    projectId: "5",
    scheduleId: "s4",
    scheduleName: "Insurance Module - Group A",
    assessmentName: "Insurance Principles Exam",
    candidateCount: 10,
    completedCount: 8,
    inProgressCount: 1,
    notStartedCount: 1,
    deadline: "2024-12-18",
  },
];

export interface MarkerCandidate {
  id: string;
  name: string;
  email: string;
  scheduleId: string;
  scheduleName: string;
  assessmentName: string;
  submittedAt: string;
  evaluationStatus: "not_started" | "in_progress" | "completed";
  totalScore?: number;
  maxScore: number;
  completionDate?: string;
}

// Candidates for each schedule
export const mockMarkerCandidates: MarkerCandidate[] = [
  // Schedule s1 candidates
  {
    id: "c1",
    name: "John Smith",
    email: "john.smith@example.com",
    scheduleId: "s1",
    scheduleName: "Q1 2024 Assessment - Batch A",
    assessmentName: "Stock Market Fundamentals",
    submittedAt: "2024-03-15T10:30:00",
    evaluationStatus: "not_started",
    maxScore: 100,
    completionDate: "2024-12-15",
  },
  {
    id: "c2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    scheduleId: "s1",
    scheduleName: "Q1 2024 Assessment - Batch A",
    assessmentName: "Stock Market Fundamentals",
    submittedAt: "2024-03-15T11:45:00",
    evaluationStatus: "in_progress",
    totalScore: 45,
    maxScore: 100,
    completionDate: "2024-12-15",
  },
  {
    id: "c3",
    name: "Mike Chen",
    email: "mike.chen@example.com",
    scheduleId: "s1",
    scheduleName: "Q1 2024 Assessment - Batch A",
    assessmentName: "Stock Market Fundamentals",
    submittedAt: "2024-03-14T14:20:00",
    evaluationStatus: "completed",
    totalScore: 87,
    maxScore: 100,
    completionDate: "2024-12-15",
  },
  // Schedule s2 candidates
  {
    id: "c4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    scheduleId: "s2",
    scheduleName: "Q1 2024 Assessment - Batch B",
    assessmentName: "Advanced Trading Strategies",
    submittedAt: "2024-03-16T09:00:00",
    evaluationStatus: "not_started",
    maxScore: 100,
    completionDate: "2024-12-20",
  },
  {
    id: "c5",
    name: "Robert Wilson",
    email: "robert.w@example.com",
    scheduleId: "s2",
    scheduleName: "Q1 2024 Assessment - Batch B",
    assessmentName: "Advanced Trading Strategies",
    submittedAt: "2024-03-16T10:15:00",
    evaluationStatus: "completed",
    totalScore: 92,
    maxScore: 100,
    completionDate: "2024-12-20",
  },
  // Schedule s3 candidates
  {
    id: "c6",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    scheduleId: "s3",
    scheduleName: "Banking Certification - Wave 1",
    assessmentName: "Banking Fundamentals Test",
    submittedAt: "2024-03-17T08:30:00",
    evaluationStatus: "in_progress",
    totalScore: 60,
    maxScore: 100,
    completionDate: "2024-12-10",
  },
  {
    id: "c7",
    name: "James Brown",
    email: "james.b@example.com",
    scheduleId: "s3",
    scheduleName: "Banking Certification - Wave 1",
    assessmentName: "Banking Fundamentals Test",
    submittedAt: "2024-03-17T09:45:00",
    evaluationStatus: "completed",
    totalScore: 78,
    maxScore: 100,
    completionDate: "2024-12-10",
  },
];
