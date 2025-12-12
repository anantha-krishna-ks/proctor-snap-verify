import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import type { FormConfiguration } from "@/types/forms";

interface CreateConfigurationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigurationCreated: (config: FormConfiguration) => void;
}

const CreateConfigurationSheet = ({
  open,
  onOpenChange,
  onConfigurationCreated,
}: CreateConfigurationSheetProps) => {
  const [config, setConfig] = useState<Omit<FormConfiguration, 'id' | 'createdAt'>>({
    name: "",
    repositoryId: "",
    isDefault: false,
    updatedAt: new Date().toISOString(),
    version: 1,
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

  const resetForm = () => {
    setConfig({
      name: "",
      repositoryId: "",
      isDefault: false,
      updatedAt: new Date().toISOString(),
      version: 1,
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
  };

  const handleSubmit = () => {
    if (!config.name.trim()) {
      toast({ title: "Error", description: "Configuration name is required", variant: "destructive" });
      return;
    }

    const newConfig: FormConfiguration = {
      ...config,
      id: `config-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    onConfigurationCreated(newConfig);
    toast({ title: "Success", description: "Configuration created successfully" });
    resetForm();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Create Configuration</SheetTitle>
          <SheetDescription>
            Define exam rules, instructions, and security settings
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] pr-4">
          <div className="space-y-6 py-4">
            {/* Configuration Name */}
            <div className="space-y-2">
              <Label htmlFor="configName">Configuration Name *</Label>
              <Input
                id="configName"
                placeholder="e.g., Standard Exam Settings"
                value={config.name}
                onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <Separator />

            {/* Exam Rules Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Exam Rules</h3>
              
              <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="allowBack"
                    checked={config.examRules.allowBackNavigation}
                    onCheckedChange={(checked) =>
                      updateExamRules('allowBackNavigation', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="allowBack" className="cursor-pointer text-sm">
                      Allow users to go back and change answers
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="sectionTimers"
                    checked={config.examRules.enableSectionTimers}
                    onCheckedChange={(checked) =>
                      updateExamRules('enableSectionTimers', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="sectionTimers" className="cursor-pointer text-sm">
                      Enable section timers and navigation
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="pauseResume"
                    checked={config.examRules.allowPauseResume}
                    onCheckedChange={(checked) =>
                      updateExamRules('allowPauseResume', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="pauseResume" className="cursor-pointer text-sm">
                      Allow users to pause and resume their own exam
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="itemFeedback"
                    checked={config.examRules.showItemFeedback}
                    onCheckedChange={(checked) =>
                      updateExamRules('showItemFeedback', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="itemFeedback" className="cursor-pointer text-sm">
                      Show item feedback after each page
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Exam Instructions Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Exam Instructions</h3>
              <Textarea
                placeholder="Enter exam instructions here..."
                className="min-h-[120px]"
                value={config.examInstructions}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, examInstructions: e.target.value }))
                }
              />
            </div>

            <Separator />

            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Security</h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="startPaused"
                    checked={config.security.startPaused}
                    onCheckedChange={(checked) =>
                      updateSecurity('startPaused', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="startPaused" className="cursor-pointer text-sm">
                      Start the exam in a paused state
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="preventCopy"
                    checked={config.security.preventCopyPaste}
                    onCheckedChange={(checked) =>
                      updateSecurity('preventCopyPaste', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="preventCopy" className="cursor-pointer text-sm">
                      Prevent copy and paste
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="disableRightClick"
                    checked={config.security.disableRightClick}
                    onCheckedChange={(checked) =>
                      updateSecurity('disableRightClick', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="disableRightClick" className="cursor-pointer text-sm">
                      Disable right-click context menu
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="fullScreen"
                    checked={config.security.fullScreenMode}
                    onCheckedChange={(checked) =>
                      updateSecurity('fullScreenMode', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="fullScreen" className="cursor-pointer text-sm">
                      Require full-screen mode
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="shuffleQuestions"
                    checked={config.security.shuffleQuestions}
                    onCheckedChange={(checked) =>
                      updateSecurity('shuffleQuestions', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="shuffleQuestions" className="cursor-pointer text-sm">
                      Shuffle questions
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="shuffleOptions"
                    checked={config.security.shuffleOptions}
                    onCheckedChange={(checked) =>
                      updateSecurity('shuffleOptions', checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="shuffleOptions" className="cursor-pointer text-sm">
                      Shuffle answer options
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Configuration</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateConfigurationSheet;
