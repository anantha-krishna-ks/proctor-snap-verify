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
}
