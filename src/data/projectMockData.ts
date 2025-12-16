export interface ProjectRoleStats {
  // Admin stats
  totalUsers?: number;
  activeSchedules?: number;
  pendingApprovals?: number;
  
  // Marker stats
  assignedItems?: number;
  pendingEvaluations?: number;
  completedToday?: number;
  
  // Author stats
  draftItems?: number;
  publishedItems?: number;
  reviewPending?: number;
  
  // Proctor stats
  activeSessions?: number;
  upcomingSessions?: number;
  flaggedCandidates?: number;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  image?: string;
  itemCount: number;
  testCount: number;
  scheduleCount: number;
  roleStats?: ProjectRoleStats;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    code: "TestingPayload2",
    name: "TestingPayload2",
    itemCount: 0,
    testCount: 0,
    scheduleCount: 0,
    roleStats: {
      totalUsers: 5,
      activeSchedules: 0,
      pendingApprovals: 0,
      assignedItems: 0,
      pendingEvaluations: 0,
      completedToday: 0,
      draftItems: 0,
      publishedItems: 0,
      reviewPending: 0,
      activeSessions: 0,
      upcomingSessions: 0,
      flaggedCandidates: 0,
    },
  },
  {
    id: "2",
    code: "TestingPayload1",
    name: "TestingPayload1",
    itemCount: 0,
    testCount: 0,
    scheduleCount: 0,
    roleStats: {
      totalUsers: 3,
      activeSchedules: 0,
      pendingApprovals: 2,
      assignedItems: 5,
      pendingEvaluations: 3,
      completedToday: 2,
      draftItems: 4,
      publishedItems: 0,
      reviewPending: 1,
      activeSessions: 0,
      upcomingSessions: 1,
      flaggedCandidates: 0,
    },
  },
  {
    id: "3",
    code: "TestingPayload",
    name: "TestingPayload",
    itemCount: 0,
    testCount: 0,
    scheduleCount: 0,
    roleStats: {
      totalUsers: 8,
      activeSchedules: 1,
      pendingApprovals: 3,
      assignedItems: 12,
      pendingEvaluations: 8,
      completedToday: 4,
      draftItems: 6,
      publishedItems: 0,
      reviewPending: 2,
      activeSessions: 1,
      upcomingSessions: 2,
      flaggedCandidates: 1,
    },
  },
  {
    id: "4",
    code: "SM0001",
    name: "STOCK MARKET",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
    itemCount: 10,
    testCount: 1,
    scheduleCount: 2,
    roleStats: {
      totalUsers: 15,
      activeSchedules: 2,
      pendingApprovals: 5,
      assignedItems: 25,
      pendingEvaluations: 18,
      completedToday: 7,
      draftItems: 3,
      publishedItems: 7,
      reviewPending: 4,
      activeSessions: 2,
      upcomingSessions: 3,
      flaggedCandidates: 2,
    },
  },
  {
    id: "5",
    code: "FPBI",
    name: "Financial Planning, Banking & Insurance",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
    itemCount: 25,
    testCount: 3,
    scheduleCount: 5,
    roleStats: {
      totalUsers: 42,
      activeSchedules: 5,
      pendingApprovals: 12,
      assignedItems: 68,
      pendingEvaluations: 45,
      completedToday: 23,
      draftItems: 8,
      publishedItems: 17,
      reviewPending: 6,
      activeSessions: 4,
      upcomingSessions: 8,
      flaggedCandidates: 3,
    },
  },
  {
    id: "6",
    code: "ISFM",
    name: "Investment Strategies for Markets",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    itemCount: 15,
    testCount: 2,
    scheduleCount: 3,
    roleStats: {
      totalUsers: 28,
      activeSchedules: 3,
      pendingApprovals: 7,
      assignedItems: 35,
      pendingEvaluations: 22,
      completedToday: 13,
      draftItems: 5,
      publishedItems: 10,
      reviewPending: 3,
      activeSessions: 2,
      upcomingSessions: 5,
      flaggedCandidates: 1,
    },
  },
];
