import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, UserCheck, Users, Eye, FileEdit, EyeOff, BookOpen, LogIn } from "lucide-react";
import { toast } from "sonner";
import graduationImg from "@/assets/graduation-illustration.png";

const roles = [
  { value: "admin", label: "Admin", icon: Shield, description: "Full system access" },
  { value: "marker", label: "Marker", icon: UserCheck, description: "Evaluate candidates" },
  { value: "proctor", label: "Proctor", icon: Eye, description: "Monitor assessments" },
  { value: "test_author", label: "Test Author", icon: FileEdit, description: "Create tests" },
  { value: "author", label: "Author", icon: Users, description: "Create content" },
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !selectedRole) {
      toast.error("Please fill in all fields");
      return;
    }

    localStorage.setItem("userRole", selectedRole);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("isAuthenticated", "true");

    toast.success(`Logged in as ${roles.find(r => r.value === selectedRole)?.label}`);

    if (selectedRole === "marker") {
      navigate("/marker");
    } else if (selectedRole === "author" || selectedRole === "test_author") {
      navigate("/author");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-secondary/30 p-12">
        <img
          src={graduationImg}
          alt="Graduating students celebrating"
          className="max-w-lg w-full object-contain"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo / Brand */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <BookOpen className="h-10 w-10" />
              <span className="text-3xl font-bold tracking-tight">Saras</span>
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">
              Test & Assessment
            </p>
            <p className="text-sm text-muted-foreground mt-3">TestPlayer</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/40 border-0 h-11"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/40 border-0 h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Select Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role" className="bg-secondary/40 border-0 h-11">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{role.label}</span>
                          <span className="text-xs text-muted-foreground">— {role.description}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-semibold uppercase tracking-wider">
              <LogIn className="h-4 w-4" />
              Login
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot Password?
              </Link>
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          Powered by Saras | Copyright © 2025 Excelsoft Technologies Ltd
        </p>
      </div>
    </div>
  );
};

export default Login;
