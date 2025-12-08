import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import type { FormConfiguration } from "@/types/forms";

const CreateConfiguration = () => {
  const navigate = useNavigate();
  
  const [config, setConfig] = useState<Omit<FormConfiguration, 'id' | 'createdAt'>>({
    name: "",
    isDefault: false,
    examRules: {
      duration: 60,
      language: "English",
      allowBackNavigation: true,
      enableSectionTimers: false,
      allowPauseResume: false,
      showItemFeedback: false,
    },
    examInstructions: "",
    security: {
      startPaused: false,
      preventCopyPaste: false,
      disableRightClick: false,
      fullScreenMode: false,
      shuffleQuestions: false,
      shuffleOptions: false,
    },
  });

  const updateExamRules = <K extends keyof FormConfiguration['examRules']>(
    key: K,
    value: FormConfiguration['examRules'][K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      examRules: { ...prev.examRules, [key]: value },
    }));
  };

  const updateSecurity = <K extends keyof FormConfiguration['security']>(
    key: K,
    value: FormConfiguration['security'][K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      security: { ...prev.security, [key]: value },
    }));
  };

  const handleSubmit = () => {
    if (!config.name.trim()) {
      toast({ title: "Error", description: "Configuration name is required", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Configuration created successfully" });
    navigate("/forms/configurations");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/forms/configurations")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create Configuration</h1>
                <p className="text-sm text-muted-foreground">
                  Define exam rules, instructions, and security settings
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/forms/configurations")}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Configuration</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Configuration Name */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Details</CardTitle>
              <CardDescription>Give your configuration a name</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="configName">Configuration Name *</Label>
                <Input
                  id="configName"
                  placeholder="e.g., Standard Exam Settings"
                  value={config.name}
                  onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Exam Rules Section */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Rules</CardTitle>
              <CardDescription>Configure timing, language, and navigation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={config.examRules.duration}
                    onChange={(e) => updateExamRules('duration', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={config.examRules.language}
                    onValueChange={(value) => updateExamRules('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="allowBack"
                    checked={config.examRules.allowBackNavigation}
                    onCheckedChange={(checked) =>
                      updateExamRules('allowBackNavigation', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="allowBack" className="cursor-pointer">
                      Allow users to go back and change answers
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Users can navigate to previous questions and modify their responses
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="sectionTimers"
                    checked={config.examRules.enableSectionTimers}
                    onCheckedChange={(checked) =>
                      updateExamRules('enableSectionTimers', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="sectionTimers" className="cursor-pointer">
                      Enable section timers and navigation
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Each section will have its own timer and navigation controls
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="pauseResume"
                    checked={config.examRules.allowPauseResume}
                    onCheckedChange={(checked) =>
                      updateExamRules('allowPauseResume', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="pauseResume" className="cursor-pointer">
                      Allow users to pause and resume their own exam
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Users can pause the exam and continue later without losing progress
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="itemFeedback"
                    checked={config.examRules.showItemFeedback}
                    onCheckedChange={(checked) =>
                      updateExamRules('showItemFeedback', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="itemFeedback" className="cursor-pointer">
                      Show item feedback after each page
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Display feedback for answered questions after each page submission
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Instructions Section */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Instructions</CardTitle>
              <CardDescription>
                Write instructions that will be shown to candidates before the exam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter exam instructions here. You can include important rules, guidelines, and what to expect during the exam..."
                className="min-h-[200px]"
                value={config.examInstructions}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, examInstructions: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Use clear and concise language. Include any specific rules about materials allowed, time management, and submission guidelines.
              </p>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Configure security and anti-cheating measures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="startPaused"
                  checked={config.security.startPaused}
                  onCheckedChange={(checked) =>
                    updateSecurity('startPaused', checked as boolean)
                  }
                />
                <div className="space-y-0.5">
                  <Label htmlFor="startPaused" className="cursor-pointer">
                    Start the exam in a paused state
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Exam will not start until manually triggered by the proctor
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="preventCopy"
                  checked={config.security.preventCopyPaste}
                  onCheckedChange={(checked) =>
                    updateSecurity('preventCopyPaste', checked as boolean)
                  }
                />
                <div className="space-y-0.5">
                  <Label htmlFor="preventCopy" className="cursor-pointer">
                    Prevent copy and paste
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Disable copy and paste functionality during the exam
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="disableRightClick"
                  checked={config.security.disableRightClick}
                  onCheckedChange={(checked) =>
                    updateSecurity('disableRightClick', checked as boolean)
                  }
                />
                <div className="space-y-0.5">
                  <Label htmlFor="disableRightClick" className="cursor-pointer">
                    Disable right-click context menu
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Prevent right-click actions during the exam
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="fullScreen"
                  checked={config.security.fullScreenMode}
                  onCheckedChange={(checked) =>
                    updateSecurity('fullScreenMode', checked as boolean)
                  }
                />
                <div className="space-y-0.5">
                  <Label htmlFor="fullScreen" className="cursor-pointer">
                    Require full-screen mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Force the exam to run in full-screen mode to prevent tab switching
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="shuffleQuestions"
                  checked={config.security.shuffleQuestions}
                  onCheckedChange={(checked) =>
                    updateSecurity('shuffleQuestions', checked as boolean)
                  }
                />
                <div className="space-y-0.5">
                  <Label htmlFor="shuffleQuestions" className="cursor-pointer">
                    Shuffle questions
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Randomize the order of questions for each candidate
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="shuffleOptions"
                  checked={config.security.shuffleOptions}
                  onCheckedChange={(checked) =>
                    updateSecurity('shuffleOptions', checked as boolean)
                  }
                />
                <div className="space-y-0.5">
                  <Label htmlFor="shuffleOptions" className="cursor-pointer">
                    Shuffle answer options
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Randomize the order of answer options for multiple choice questions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateConfiguration;
