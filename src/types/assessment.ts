export interface Schedule {
  id: string;
  scheduleName: string;
  status: "published" | "unpublished";
  assessmentName: string;
  numberOfBatches: number;
  numberOfTestTakers: number;
  testStartDate: string;
  testEndDate: string;
  attempted: number;
  notAttempted: number;
  pendingApprovals: number;
  sourceType: "form" | "sequence";
  assignedMarkers?: Array<{
    markerId: string;
    markerName: string;
    assignedCandidates: number;
  }>;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  scheduleId: string;
  profileImageUrl: string;
  testImageUrl: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  testCompleted: boolean;
  markerId?: string;
  markerName?: string;
  evaluationStatus?: "not_started" | "in_progress" | "completed";
  totalScore?: number;
  maxScore?: number;
  completionDate?: string;
}

export interface Question {
  id: string;
  questionText: string;
  questionType: "essay" | "short_answer" | "coding" | "file_upload";
  maxScore: number;
  candidateAnswer: string;
  modelAnswer?: string;
  candidateScore?: number;
  markerComments?: string;
}

export interface CandidateEvaluation {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  profileImageUrl: string;
  testImageUrl: string;
  scheduleId: string;
  scheduleName: string;
  assessmentName: string;
  submittedAt: string;
  testDuration: string;
  questions: Question[];
  rubric: string;
}
