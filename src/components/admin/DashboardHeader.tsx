import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Grid3X3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const DashboardHeader = ({ searchQuery, onSearchChange }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "NA";
  const initials = userEmail.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Grid3X3 className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <div>
            <span className="font-bold text-lg text-foreground">Saras</span>
            <span className="text-[10px] text-muted-foreground block -mt-1">TEST & ASSESSMENT</span>
          </div>
        </div>
        <span className="text-foreground font-medium ml-4">Home</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">NSE Admin</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
