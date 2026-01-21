import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Sparkles, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Zap,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  tier: "free" | "paid";
  enabled: boolean;
  costPerRequest?: string;
}

interface UsageStats {
  totalRequests: number;
  totalItemsGenerated: number;
  creditsUsed: number;
  creditsRemaining: number;
  creditsLimit: number;
  lastUsed: string;
}

const AISettings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock usage stats
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalRequests: 47,
    totalItemsGenerated: 235,
    creditsUsed: 156,
    creditsRemaining: 844,
    creditsLimit: 1000,
    lastUsed: "2 hours ago"
  });

  // AI Models configuration
  const [models, setModels] = useState<AIModel[]>([
    { id: "gemini-flash", name: "Gemini 3 Flash", provider: "Google", description: "Fast & efficient", tier: "paid", enabled: true, costPerRequest: "~0.5 credits" },
    { id: "gemini-pro", name: "Gemini 3 Pro", provider: "Google", description: "Advanced reasoning", tier: "paid", enabled: true, costPerRequest: "~2 credits" },
    { id: "gpt-5", name: "GPT-5", provider: "OpenAI", description: "Powerful all-rounder", tier: "paid", enabled: true, costPerRequest: "~3 credits" },
    { id: "gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI", description: "Cost-effective", tier: "paid", enabled: true, costPerRequest: "~1 credit" },
    { id: "llama-free", name: "Llama 3.3 70B", provider: "Meta (Free)", description: "Open-source, no cost", tier: "free", enabled: true, costPerRequest: "Free" },
    { id: "mistral-free", name: "Mistral 7B", provider: "Mistral (Free)", description: "Fast, free inference", tier: "free", enabled: true, costPerRequest: "Free" },
  ]);

  // Rate limit settings
  const [rateLimits, setRateLimits] = useState({
    maxRequestsPerMinute: 10,
    maxItemsPerRequest: 20,
    dailyRequestLimit: 100,
    enableRateLimiting: true
  });

  const toggleModel = (modelId: string) => {
    setModels(prev => prev.map(m => 
      m.id === modelId ? { ...m, enabled: !m.enabled } : m
    ));
    toast.success("Model settings updated");
  };

  const handleSaveSettings = () => {
    toast.success("AI settings saved successfully!");
  };

  const usagePercentage = (usageStats.creditsUsed / usageStats.creditsLimit) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">AI Settings</h1>
                <p className="text-sm text-muted-foreground">Manage AI models, usage limits, and credits</p>
              </div>
            </div>
            <Button onClick={handleSaveSettings} className="gap-2">
              <Settings className="h-4 w-4" />
              Save Settings
            </Button>
          </div>

          {/* Usage Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold">{usageStats.totalRequests}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Items Generated</p>
                    <p className="text-2xl font-bold">{usageStats.totalItemsGenerated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-lg">
                    <TrendingUp className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credits Used</p>
                    <p className="text-2xl font-bold">{usageStats.creditsUsed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Zap className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credits Remaining</p>
                    <p className="text-2xl font-bold">{usageStats.creditsRemaining}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credits Progress */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Credits Usage
              </CardTitle>
              <CardDescription>
                {usageStats.creditsUsed} of {usageStats.creditsLimit} credits used this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={usagePercentage} className="h-3" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Last used: {usageStats.lastUsed}</span>
                <span>{Math.round(usagePercentage)}% used</span>
              </div>
              {usagePercentage > 80 && (
                <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm text-warning">
                    You're approaching your credit limit. Consider upgrading or using free models.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available AI Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Available AI Models
                </CardTitle>
                <CardDescription>
                  Enable or disable AI models for item generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {models.map((model) => (
                  <div 
                    key={model.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${model.tier === "free" ? "bg-green-500/10" : "bg-primary/10"}`}>
                        <Brain className={`h-4 w-4 ${model.tier === "free" ? "text-green-500" : "text-primary"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{model.name}</span>
                          <Badge variant={model.tier === "free" ? "secondary" : "outline"} className={model.tier === "free" ? "bg-green-500/10 text-green-600 border-green-500/30" : ""}>
                            {model.tier === "free" ? "Free" : "Paid"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{model.provider}</span>
                          <span>•</span>
                          <span>{model.description}</span>
                          <span>•</span>
                          <span>{model.costPerRequest}</span>
                        </div>
                      </div>
                    </div>
                    <Switch 
                      checked={model.enabled} 
                      onCheckedChange={() => toggleModel(model.id)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Rate Limit Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Rate Limit Settings
                </CardTitle>
                <CardDescription>
                  Configure limits to manage AI usage and costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Rate Limiting</Label>
                    <p className="text-xs text-muted-foreground">Prevent excessive API usage</p>
                  </div>
                  <Switch 
                    checked={rateLimits.enableRateLimiting}
                    onCheckedChange={(checked) => setRateLimits(prev => ({ ...prev, enableRateLimiting: checked }))}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="maxRequestsPerMinute">Max Requests per Minute</Label>
                  <Input
                    id="maxRequestsPerMinute"
                    type="number"
                    value={rateLimits.maxRequestsPerMinute}
                    onChange={(e) => setRateLimits(prev => ({ ...prev, maxRequestsPerMinute: parseInt(e.target.value) || 0 }))}
                    disabled={!rateLimits.enableRateLimiting}
                  />
                  <p className="text-xs text-muted-foreground">Limits how many AI requests can be made per minute</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxItemsPerRequest">Max Items per Request</Label>
                  <Input
                    id="maxItemsPerRequest"
                    type="number"
                    value={rateLimits.maxItemsPerRequest}
                    onChange={(e) => setRateLimits(prev => ({ ...prev, maxItemsPerRequest: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of items that can be generated in a single request</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyRequestLimit">Daily Request Limit</Label>
                  <Input
                    id="dailyRequestLimit"
                    type="number"
                    value={rateLimits.dailyRequestLimit}
                    onChange={(e) => setRateLimits(prev => ({ ...prev, dailyRequestLimit: parseInt(e.target.value) || 0 }))}
                    disabled={!rateLimits.enableRateLimiting}
                  />
                  <p className="text-xs text-muted-foreground">Maximum AI requests allowed per day per user</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">💡 Cost Saving Tips</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use free models (Llama, Mistral) for simple item generation</li>
                    <li>• Reserve paid models for complex reasoning tasks</li>
                    <li>• Generate items in smaller batches to avoid errors</li>
                    <li>• Set daily limits to prevent unexpected costs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Powered by Saras | Copyright © 2025 of Excelsoft Technologies Ltd{" "}
            <a
              href="https://www.excelsoftcorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://www.excelsoftcorp.com
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AISettings;
