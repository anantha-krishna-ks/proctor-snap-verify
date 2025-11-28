export interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalAuthors: number;
  totalProctors: number;
  totalTestAuthors: number;
  totalMarkers: number;
  totalItems: number;
  totalTests: number;
  successfulTestsTaken: number;
  activeAssessments: number;
  pendingApprovals: number;
}

export interface RecentActivity {
  id: string;
  type: "user_created" | "test_created" | "item_created" | "assessment_completed" | "approval_pending";
  description: string;
  timestamp: string;
  user: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "author" | "proctor" | "test_author" | "marker";
  organization: string;
  status: "active" | "inactive";
  createdAt: string;
}
