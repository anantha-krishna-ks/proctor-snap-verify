import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AdminNavButtonProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const AdminNavButton = ({ to, icon: Icon, children }: AdminNavButtonProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === to;

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      onClick={() => navigate(to)}
      className={cn(
        "gap-2",
        isActive && "bg-secondary text-secondary-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Button>
  );
};
