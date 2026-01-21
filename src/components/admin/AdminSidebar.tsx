import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Building2,
  Package,
  Shield,
  Users,
  Database,
  Settings,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", url: "/admin", icon: Home },
  { title: "Organization", url: "/admin/organization", icon: Building2 },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Roles", url: "/admin/roles", icon: Shield },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Metadata", url: "/admin/metadata", icon: Database },
  { title: "AI Settings", url: "/admin/ai-settings", icon: Brain },
  { title: "Masters", url: "/admin/masters", icon: Settings },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-20 bg-card border-r border-border flex flex-col items-center py-4 shrink-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.url;

        return (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex flex-col items-center justify-center w-full py-3 px-2 text-xs transition-colors hover:bg-accent/50",
              isActive && "text-primary bg-primary/5 border-l-2 border-primary"
            )}
          >
            <Icon className={cn("h-5 w-5 mb-1", isActive ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-center leading-tight", isActive ? "text-primary font-medium" : "text-muted-foreground")}>
              {item.title}
            </span>
          </NavLink>
        );
      })}
    </aside>
  );
};
