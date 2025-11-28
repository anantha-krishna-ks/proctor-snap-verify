import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Shield, UserCheck, Users, Eye, FileEdit, Wrench } from "lucide-react";
import { toast } from "sonner";

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !selectedRole) {
      toast.error("Please fill in all fields");
      return;
    }

    // Mock login - store role in localStorage
    localStorage.setItem("userRole", selectedRole);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("isAuthenticated", "true");

    toast.success(`Logged in as ${roles.find(r => r.value === selectedRole)?.label}`);

    // Redirect based on role
    if (selectedRole === "marker") {
      navigate("/marker");
    } else if (selectedRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Assessment Platform</CardTitle>
          <CardDescription>
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {role.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-foreground">Quick Test Credentials:</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div><span className="font-medium">Email:</span> Any email (e.g., test@example.com)</div>
                <div><span className="font-medium">Password:</span> Any password (e.g., password123)</div>
                <div className="pt-2 font-medium text-foreground">Test as:</div>
                <div className="pl-2 space-y-0.5">
                  <div>• <span className="font-medium">Marker</span> - Evaluate candidates</div>
                  <div>• <span className="font-medium">Admin</span> - Full system access</div>
                  <div>• <span className="font-medium">Proctor</span> - Monitor assessments</div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 text-center text-xs text-muted-foreground">
        Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd
      </div>
    </div>
  );
};

export default Login;
