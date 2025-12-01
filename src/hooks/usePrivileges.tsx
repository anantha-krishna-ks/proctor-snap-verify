import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Role, UserRole, AVAILABLE_PRIVILEGES } from "@/types/privileges";

interface PrivilegeContextType {
  roles: Role[];
  userRoles: UserRole[];
  hasPrivilege: (privilegeId: string) => boolean;
  hasAnyPrivilege: (privilegeIds: string[]) => boolean;
  hasAllPrivileges: (privilegeIds: string[]) => boolean;
  getUserRoles: (userId: string) => Role[];
  assignRole: (userId: string, roleId: string) => void;
  removeRole: (userId: string, roleId: string) => void;
  createRole: (role: Omit<Role, "id" | "createdAt" | "updatedAt">) => void;
  updateRole: (roleId: string, updates: Partial<Role>) => void;
  deleteRole: (roleId: string) => void;
}

const PrivilegeContext = createContext<PrivilegeContextType | undefined>(undefined);

const STORAGE_KEY_ROLES = "app_roles";
const STORAGE_KEY_USER_ROLES = "app_user_roles";

// Default system roles
const DEFAULT_ROLES: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access with all privileges",
    privileges: AVAILABLE_PRIVILEGES.map(p => p.id),
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "marker",
    name: "Marker",
    description: "Can evaluate candidate responses",
    privileges: [
      "dashboard.marker",
      "marker.evaluate",
      "schedule.view",
      "test.view",
      "item.view",
      "reports.view",
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proctor",
    name: "Proctor",
    description: "Can monitor assessment sessions",
    privileges: [
      "schedule.view",
      "proctor.monitor",
      "proctor.intervene",
      "approval.headshot",
      "test.view",
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "author",
    name: "Author",
    description: "Can create and manage assessment content",
    privileges: [
      "item.view",
      "item.create",
      "item.edit",
      "test.view",
      "test.create",
      "test.edit",
      "author.content",
      "author.review",
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "test_author",
    name: "Test Author",
    description: "Can create and manage tests",
    privileges: [
      "test.view",
      "test.create",
      "test.edit",
      "item.view",
      "author.content",
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const PrivilegeProvider = ({ children }: { children: ReactNode }) => {
  const [roles, setRoles] = useState<Role[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_ROLES);
    return stored ? JSON.parse(stored) : DEFAULT_ROLES;
  });

  const [userRoles, setUserRoles] = useState<UserRole[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_USER_ROLES);
    if (stored) return JSON.parse(stored);
    
    // Initialize with default assignments based on mock auth
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    if (email && role) {
      return [{
        userId: email,
        roleId: role,
        assignedAt: new Date().toISOString(),
        assignedBy: "system",
      }];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROLES, JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER_ROLES, JSON.stringify(userRoles));
  }, [userRoles]);

  const getCurrentUserId = () => localStorage.getItem("userEmail") || "";

  const getUserRoles = (userId: string): Role[] => {
    const userRoleIds = userRoles
      .filter(ur => ur.userId === userId)
      .map(ur => ur.roleId);
    return roles.filter(role => userRoleIds.includes(role.id));
  };

  const hasPrivilege = (privilegeId: string): boolean => {
    const userId = getCurrentUserId();
    if (!userId) return false;
    
    const userRolesList = getUserRoles(userId);
    return userRolesList.some(role => role.privileges.includes(privilegeId));
  };

  const hasAnyPrivilege = (privilegeIds: string[]): boolean => {
    return privilegeIds.some(id => hasPrivilege(id));
  };

  const hasAllPrivileges = (privilegeIds: string[]): boolean => {
    return privilegeIds.every(id => hasPrivilege(id));
  };

  const assignRole = (userId: string, roleId: string) => {
    const exists = userRoles.some(ur => ur.userId === userId && ur.roleId === roleId);
    if (!exists) {
      setUserRoles([
        ...userRoles,
        {
          userId,
          roleId,
          assignedAt: new Date().toISOString(),
          assignedBy: getCurrentUserId(),
        },
      ]);
    }
  };

  const removeRole = (userId: string, roleId: string) => {
    setUserRoles(userRoles.filter(ur => !(ur.userId === userId && ur.roleId === roleId)));
  };

  const createRole = (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">) => {
    const newRole: Role = {
      ...roleData,
      id: `role_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRoles([...roles, newRole]);
  };

  const updateRole = (roleId: string, updates: Partial<Role>) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? { ...role, ...updates, updatedAt: new Date().toISOString() }
        : role
    ));
  };

  const deleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystemRole) return; // Cannot delete system roles
    
    setRoles(roles.filter(r => r.id !== roleId));
    setUserRoles(userRoles.filter(ur => ur.roleId !== roleId));
  };

  return (
    <PrivilegeContext.Provider
      value={{
        roles,
        userRoles,
        hasPrivilege,
        hasAnyPrivilege,
        hasAllPrivileges,
        getUserRoles,
        assignRole,
        removeRole,
        createRole,
        updateRole,
        deleteRole,
      }}
    >
      {children}
    </PrivilegeContext.Provider>
  );
};

export const usePrivileges = () => {
  const context = useContext(PrivilegeContext);
  if (!context) {
    throw new Error("usePrivileges must be used within PrivilegeProvider");
  }
  return context;
};
