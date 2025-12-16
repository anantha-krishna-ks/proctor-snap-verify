// Mock user roles system - maps users to their roles per project

export interface UserProjectRoles {
  userId: string;
  projectId: string;
  roles: string[];
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
}

export const mockUsers: MockUser[] = [
  { id: "user-1", name: "John Admin", email: "john@example.com" },
  { id: "user-2", name: "Sarah Multi", email: "sarah@example.com" },
  { id: "user-3", name: "Mike Marker", email: "mike@example.com" },
  { id: "user-4", name: "Lisa Author", email: "lisa@example.com" },
];

// User project role assignments - a user can have multiple roles per project
export const userProjectRoles: UserProjectRoles[] = [
  // John Admin - admin on all projects
  { userId: "user-1", projectId: "1", roles: ["admin"] },
  { userId: "user-1", projectId: "2", roles: ["admin"] },
  { userId: "user-1", projectId: "3", roles: ["admin"] },
  { userId: "user-1", projectId: "4", roles: ["admin", "author"] },
  { userId: "user-1", projectId: "5", roles: ["admin"] },
  { userId: "user-1", projectId: "6", roles: ["admin"] },
  
  // Sarah Multi - multiple roles: author + marker on several projects
  { userId: "user-2", projectId: "1", roles: ["author", "marker"] },
  { userId: "user-2", projectId: "2", roles: ["author", "marker", "proctor"] },
  { userId: "user-2", projectId: "3", roles: ["marker"] },
  { userId: "user-2", projectId: "4", roles: ["author", "marker"] },
  { userId: "user-2", projectId: "5", roles: ["author", "marker", "admin"] },
  { userId: "user-2", projectId: "6", roles: ["author"] },
  
  // Mike Marker - marker and proctor
  { userId: "user-3", projectId: "3", roles: ["marker", "proctor"] },
  { userId: "user-3", projectId: "4", roles: ["marker"] },
  { userId: "user-3", projectId: "5", roles: ["marker", "proctor"] },
  
  // Lisa Author - author only
  { userId: "user-4", projectId: "1", roles: ["author"] },
  { userId: "user-4", projectId: "4", roles: ["author", "test_author"] },
  { userId: "user-4", projectId: "5", roles: ["author"] },
];

// Helper function to get user's roles for a specific project
export const getUserRolesForProject = (userId: string, projectId: string): string[] => {
  const assignment = userProjectRoles.find(
    (upr) => upr.userId === userId && upr.projectId === projectId
  );
  return assignment?.roles || [];
};

// Helper function to get all projects a user has access to with their roles
export const getUserProjects = (userId: string): { projectId: string; roles: string[] }[] => {
  return userProjectRoles
    .filter((upr) => upr.userId === userId)
    .map((upr) => ({ projectId: upr.projectId, roles: upr.roles }));
};

// Get current logged in user (mock - defaults to Sarah Multi who has multiple roles)
export const getCurrentUserId = (): string => {
  return localStorage.getItem("mockUserId") || "user-2";
};

export const setCurrentUserId = (userId: string): void => {
  localStorage.setItem("mockUserId", userId);
};
