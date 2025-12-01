import { Navigate } from "react-router-dom";
import { usePrivileges } from "@/hooks/usePrivileges";

interface PrivilegeRouteProps {
  children: React.ReactNode;
  requiredPrivilege?: string;
  requiredAnyPrivileges?: string[];
  requiredAllPrivileges?: string[];
}

export const PrivilegeRoute = ({
  children,
  requiredPrivilege,
  requiredAnyPrivileges,
  requiredAllPrivileges,
}: PrivilegeRouteProps) => {
  const { hasPrivilege, hasAnyPrivilege, hasAllPrivileges } = usePrivileges();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check single privilege
  if (requiredPrivilege && !hasPrivilege(requiredPrivilege)) {
    return <Navigate to="/login" replace />;
  }

  // Check any of multiple privileges
  if (requiredAnyPrivileges && !hasAnyPrivilege(requiredAnyPrivileges)) {
    return <Navigate to="/login" replace />;
  }

  // Check all privileges
  if (requiredAllPrivileges && !hasAllPrivileges(requiredAllPrivileges)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
