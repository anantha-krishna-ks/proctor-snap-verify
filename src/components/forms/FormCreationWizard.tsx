import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Settings,
  Layers,
  Eye,
  Save,
  Plus,
  Trash2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { subjects, grades, allTags, type FormType, type NavigationStyle, type ScoringType, type DifficultyLevel, type BloomLevel } from "@/types/formTemplates";

interface FormCreationWizardProps {
  onBack: () => void;
  onSave: () => void;
}

const steps = [
  { id: 1, title: "Metadata", description: "Basic information", icon: FileText },
  { id: 2, title: "Preferences", description: "Configuration", icon: Settings },
  { id: 3, title: "Blueprint", description: "Item rules", icon: Layers },
  { id: 4, title: "Preview", description: "Review form", icon: Eye },
  { id: 5, title: "Save", description: "Finalize", icon: Save },
];

interface BlueprintRule {
  id: string;
  topic: string;
  difficulty: DifficultyLevel;
  bloomLevel: BloomLevel;
  count: number;
}

export const FormCreationWizard = ({ onBack, onSave }: FormCreationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    grade: "",
    type: "test" as FormType,
    tags: [] as string[],
    description: "",
    duration: 60,
    navigationStyle: "free" as NavigationStyle,
    scoringType: "scaled" as ScoringType,
    passingScore: 65,
    proctoring: {
      enabled: false,
      webcam: false,
      screenShare: false,
      lockdownBrowser: false,
    },
    anonymity: false,
    shuffleQuestions: true,
    shuffleOptions: true,
    showResults: true,
    allowReview: false,
  });
  const [blueprintRules, setBlueprintRules] = useState<BlueprintRule[]>([
    { id: "1", topic: "", difficulty: "medium", bloomLevel: "apply", count: 5 },
  ]);
  const [tagInput, setTagInput] = useState("");

  const totalItems = blueprintRules.reduce((sum, rule) => sum + rule.count, 0);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleAddRule = () => {
    setBlueprintRules([
      ...blueprintRules,
      { id: Date.now().toString(), topic: "", difficulty: "medium", bloomLevel: "apply", count: 5 },
    ]);
  };

  const handleRemoveRule = (id: string) => {
    if (blueprintRules.length > 1) {
      setBlueprintRules(blueprintRules.filter((r) => r.id !== id));
    }
  };

  const handleRuleChange = (id: string, field: keyof BlueprintRule, value: any) => {
    setBlueprintRules(
      blueprintRules.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = () => {
    toast.success("Form template saved successfully!");
    onSave();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Label htmlFor="title">Template Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Grade 10 Math Aptitude Test"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Form Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v as FormType })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="practice">Practice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Subject *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(v) => setFormData({ ...formData, subject: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Grade</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(v) => setFormData({ ...formData, grade: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="">Not applicable</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/20"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))
                  }
                </div>
              </div>

              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of this assessment template..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1.5 min-h-[100px]"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Duration */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Duration</CardTitle>
                  <CardDescription>Time allowed for completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[formData.duration]}
                      onValueChange={([v]) => setFormData({ ...formData, duration: v })}
                      min={5}
                      max={180}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-20 text-right font-medium">{formData.duration} min</span>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Style */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Navigation Style</CardTitle>
                  <CardDescription>How candidates move through items</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.navigationStyle}
                    onValueChange={(v) => setFormData({ ...formData, navigationStyle: v as NavigationStyle })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="free">Free Navigation</SelectItem>
                      <SelectItem value="forward-only">Forward Only</SelectItem>
                      <SelectItem value="section-locked">Section Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Scoring */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Scoring</CardTitle>
                  <CardDescription>How results are calculated</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={formData.scoringType}
                    onValueChange={(v) => setFormData({ ...formData, scoringType: v as ScoringType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="scaled">Scaled Score</SelectItem>
                      <SelectItem value="raw">Raw Score</SelectItem>
                      <SelectItem value="weighted">Weighted</SelectItem>
                      <SelectItem value="none">No Scoring</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.scoringType !== "none" && (
                    <div>
                      <Label className="text-sm">Passing Score: {formData.passingScore}%</Label>
                      <Slider
                        value={[formData.passingScore]}
                        onValueChange={([v]) => setFormData({ ...formData, passingScore: v })}
                        min={0}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Proctoring */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Proctoring</CardTitle>
                  <CardDescription>Security and monitoring options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Enable Proctoring</Label>
                    <Switch
                      checked={formData.proctoring.enabled}
                      onCheckedChange={(v) =>
                        setFormData({ ...formData, proctoring: { ...formData.proctoring, enabled: v } })
                      }
                    />
                  </div>
                  {formData.proctoring.enabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Webcam</Label>
                        <Switch
                          checked={formData.proctoring.webcam}
                          onCheckedChange={(v) =>
                            setFormData({ ...formData, proctoring: { ...formData.proctoring, webcam: v } })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Screen Share</Label>
                        <Switch
                          checked={formData.proctoring.screenShare}
                          onCheckedChange={(v) =>
                            setFormData({ ...formData, proctoring: { ...formData.proctoring, screenShare: v } })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Lockdown Browser</Label>
                        <Switch
                          checked={formData.proctoring.lockdownBrowser}
                          onCheckedChange={(v) =>
                            setFormData({ ...formData, proctoring: { ...formData.proctoring, lockdownBrowser: v } })
                          }
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Other Settings */}
              <Card className="col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Additional Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Anonymous Responses</Label>
                      <Switch
                        checked={formData.anonymity}
                        onCheckedChange={(v) => setFormData({ ...formData, anonymity: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Shuffle Questions</Label>
                      <Switch
                        checked={formData.shuffleQuestions}
                        onCheckedChange={(v) => setFormData({ ...formData, shuffleQuestions: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Shuffle Options</Label>
                      <Switch
                        checked={formData.shuffleOptions}
                        onCheckedChange={(v) => setFormData({ ...formData, shuffleOptions: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Results</Label>
                      <Switch
                        checked={formData.showResults}
                        onCheckedChange={(v) => setFormData({ ...formData, showResults: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Allow Review</Label>
                      <Switch
                        checked={formData.allowReview}
                        onCheckedChange={(v) => setFormData({ ...formData, allowReview: v })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Blueprint Rules</h3>
                <p className="text-sm text-muted-foreground">
                  Define item selection criteria from the item bank
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{totalItems}</p>
                  <p className="text-xs text-muted-foreground">Total Items</p>
                </div>
                <Button onClick={handleAddRule} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {blueprintRules.map((rule, index) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>

                        <div className="flex-1 grid grid-cols-4 gap-4">
                          <div>
                            <Label className="text-xs">Topic</Label>
                            <Input
                              placeholder="e.g., Algebra"
                              value={rule.topic}
                              onChange={(e) => handleRuleChange(rule.id, "topic", e.target.value)}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-xs">Difficulty</Label>
                            <Select
                              value={rule.difficulty}
                              onValueChange={(v) => handleRuleChange(rule.id, "difficulty", v)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover">
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                                <SelectItem value="mixed">Mixed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs">Bloom's Level</Label>
                            <Select
                              value={rule.bloomLevel}
                              onValueChange={(v) => handleRuleChange(rule.id, "bloomLevel", v)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover">
                                <SelectItem value="remember">Remember</SelectItem>
                                <SelectItem value="understand">Understand</SelectItem>
                                <SelectItem value="apply">Apply</SelectItem>
                                <SelectItem value="analyze">Analyze</SelectItem>
                                <SelectItem value="evaluate">Evaluate</SelectItem>
                                <SelectItem value="create">Create</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs">Item Count</Label>
                            <Input
                              type="number"
                              min={1}
                              max={50}
                              value={rule.count}
                              onChange={(e) => handleRuleChange(rule.id, "count", parseInt(e.target.value) || 1)}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRule(rule.id)}
                          disabled={blueprintRules.length === 1}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
              }
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">How Blueprint Rules Work</p>
                  <p>
                    Items are dynamically selected from the item bank based on these rules. The system
                    uses semantic search and metadata matching to find the best items that meet your criteria.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Form Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Template Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Title</span>
                    <span className="font-medium">{formData.title || "Untitled"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant="outline" className="capitalize">{formData.type}</Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Subject</span>
                    <span className="font-medium">{formData.subject || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{formData.duration} minutes</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Proctoring</span>
                    <span className="font-medium">{formData.proctoring.enabled ? "Enabled" : "Disabled"}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Blueprint Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Blueprint Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {blueprintRules.map((rule, index) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {rule.count}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{rule.topic || `Topic ${index + 1}`}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {rule.difficulty} • {rule.bloomLevel}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Ready for Preview</p>
                    <p className="text-sm text-muted-foreground">
                      Based on your blueprint, {totalItems} items will be dynamically assembled from the item bank.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <Check className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Save</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Your form template is complete. Save it to make it available for scheduling
              and reuse across projects.
            </p>
            <Button size="lg" onClick={handleSave} className="gap-2">
              <Save className="h-5 w-5" />
              Save Template
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Create Form Template</h1>
            <p className="text-sm text-muted-foreground">
              Build a reusable assessment configuration
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      isCompleted
                        ? "bg-success text-success-foreground"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1.5 font-medium",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-20 h-0.5 mx-2",
                      currentStep > step.id ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })
          }
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border bg-card">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
          {currentStep < 5 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
