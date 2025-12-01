export type PrivilegeCategory = 
  | "user_management"
  | "role_management"
  | "assessment_operations"
  | "scheduling"
  | "approval"
  | "dashboard"
  | "reports"
  | "marker_operations"
  | "proctor_operations"
  | "author_operations";

export interface Privilege {
  id: string;
  name: string;
  description: string;
  category: PrivilegeCategory;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  privileges: string[]; // Array of privilege IDs
  isSystemRole: boolean; // Cannot be deleted or renamed
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
}

export const AVAILABLE_PRIVILEGES: Privilege[] = [
  // User & Role Management
  { id: "user.view", name: "View Users", description: "View user list and details", category: "user_management" },
  { id: "user.create", name: "Create Users", description: "Create new user accounts", category: "user_management" },
  { id: "user.edit", name: "Edit Users", description: "Modify user information", category: "user_management" },
  { id: "user.delete", name: "Delete Users", description: "Remove user accounts", category: "user_management" },
  { id: "role.view", name: "View Roles", description: "View role list and privileges", category: "role_management" },
  { id: "role.create", name: "Create Roles", description: "Create new roles", category: "role_management" },
  { id: "role.edit", name: "Edit Roles", description: "Modify role privileges", category: "role_management" },
  { id: "role.delete", name: "Delete Roles", description: "Remove roles", category: "role_management" },
  { id: "role.assign", name: "Assign Roles", description: "Assign roles to users", category: "role_management" },
  
  // Assessment Operations
  { id: "item.view", name: "View Items", description: "View item bank", category: "assessment_operations" },
  { id: "item.create", name: "Create Items", description: "Create assessment items", category: "assessment_operations" },
  { id: "item.edit", name: "Edit Items", description: "Modify assessment items", category: "assessment_operations" },
  { id: "item.delete", name: "Delete Items", description: "Remove assessment items", category: "assessment_operations" },
  { id: "test.view", name: "View Tests", description: "View test bank", category: "assessment_operations" },
  { id: "test.create", name: "Create Tests", description: "Create new tests", category: "assessment_operations" },
  { id: "test.edit", name: "Edit Tests", description: "Modify tests", category: "assessment_operations" },
  { id: "test.delete", name: "Delete Tests", description: "Remove tests", category: "assessment_operations" },
  
  // Scheduling
  { id: "schedule.view", name: "View Schedules", description: "View assessment schedules", category: "scheduling" },
  { id: "schedule.create", name: "Create Schedules", description: "Schedule assessments", category: "scheduling" },
  { id: "schedule.edit", name: "Edit Schedules", description: "Modify schedules", category: "scheduling" },
  { id: "schedule.delete", name: "Delete Schedules", description: "Remove schedules", category: "scheduling" },
  
  // Approval
  { id: "approval.headshot", name: "Approve Headshots", description: "Review and approve candidate headshots", category: "approval" },
  { id: "approval.results", name: "Approve Results", description: "Review and approve assessment results", category: "approval" },
  
  // Dashboard & Reports
  { id: "dashboard.admin", name: "Admin Dashboard", description: "Access admin dashboard", category: "dashboard" },
  { id: "dashboard.marker", name: "Marker Dashboard", description: "Access marker dashboard", category: "dashboard" },
  { id: "reports.view", name: "View Reports", description: "View assessment reports", category: "reports" },
  { id: "reports.export", name: "Export Reports", description: "Export report data", category: "reports" },
  
  // Marker Operations
  { id: "marker.evaluate", name: "Evaluate Responses", description: "Evaluate candidate responses", category: "marker_operations" },
  { id: "marker.assign", name: "Assign Markers", description: "Assign markers to assessments", category: "marker_operations" },
  
  // Proctor Operations
  { id: "proctor.monitor", name: "Monitor Sessions", description: "Monitor assessment sessions", category: "proctor_operations" },
  { id: "proctor.intervene", name: "Intervene in Sessions", description: "Take action during sessions", category: "proctor_operations" },
  
  // Author Operations
  { id: "author.content", name: "Author Content", description: "Create assessment content", category: "author_operations" },
  { id: "author.review", name: "Review Content", description: "Review assessment content", category: "author_operations" },
];
